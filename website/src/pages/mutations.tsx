import { z } from "zod";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import dynamic from "next/dynamic";
import { groupBy } from "fp-ts/lib/NonEmptyArray";
import { GeoDataFeature, useGeoData } from "src/domain/geodata";
import * as turf from "@turf/turf";
import { FlyToInterpolator } from "@deck.gl/core";
import { parse } from "path";

const row = z.object({
  "N° d'hist.": z.string(),
  Canton: z.string(),
  "N° du district": z.string(),
  "Nom du district": z.string(),
  "N° OFS commune": z.string().transform((x) => Number(x)),
  "Nom de la commune": z.string(),
  "Raison de la radiation": z.string(),
  "Raison de l'inscription": z.string(),

  "Numéro de mutation": z.string(),
  "Type de mutation": z.string(),
  "Entrée en vigueur": z.string(),
});

interface CsvRow {
  "N° d'hist.": string;
  Canton: string;
  "N° du district": string;
  "Nom du district": string;
  "N° OFS commune": string;
  "Nom de la commune": string;
  "Raison de la radiation": string;
  "Raison de l'inscription": string;
  "Numéro de mutation": string;
  "Type de mutation": string;
  "Entrée en vigueur": string;
}

const parseHTML = (htmlContent: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<html><body>${htmlContent}</body></html>`,
    "text/html"
  );
  const table = doc.querySelector("table");
  if (!table) {
    throw new Error("Could not find table");
  }
  const rows = table.querySelectorAll("tr");
  const headers = Array.from(rows[0].querySelectorAll("th")).map(
    (header) => header.textContent
  );
  const data: CsvRow[] = [];
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");
    const rowData: CsvRow = {} as CsvRow;
    for (let j = 0; j < cells.length; j++) {
      const header = headers[j];
      if (!header) {
        continue;
      }
      rowData[header as NonNullable<keyof CsvRow>] = cells[j]
        .textContent as string;
    }
    data.push(rowData);
  }

  // Filter out special lines and extract mutation information
  const filteredData: CsvRow[] = [];
  let mutationInfo: { num: string; type: string; date: string } | null = null;

  data.forEach((row) => {
    if (row["N° d'hist."].includes("Numéro de mutation :")) {
      mutationInfo = {
        num: "",
        type: "",
        date: "",
      };
      const rx =
        /Numéro de mutation : (.*), Type de mutation : (.*), Entrée en vigueur : (.*)/;
      const match = row["N° d'hist."].match(rx);
      if (match) {
        mutationInfo.num = match[1];
        mutationInfo.type = match[2];
        mutationInfo.date = match[3];
      }
    } else {
      if (mutationInfo) {
        row["Numéro de mutation"] = mutationInfo.num;
        row["Type de mutation"] = mutationInfo.type;
        row["Entrée en vigueur"] = mutationInfo.date;
      }
      filteredData.push(row);
    }
  });

  const mutations = z.array(row).parse(filteredData);
  const groupedMutations = groupBy<Row>(
    (mutation) => mutation["Numéro de mutation"]
  )(mutations);

  return groupedMutations;
};

type Row = z.infer<typeof row>;

const MutationsMap = dynamic(() => import("../components/Mutations/Map"), {
  ssr: false,
});

const parseMutationRows = (rows: Row[]) => {
  const removed = rows.filter((r) => r["Raison de la radiation"]);
  const added = rows.filter((r) => r["Raison de l'inscription"]);
  return {
    label: `+ ${added
      .map((x) => x["Nom de la commune"])
      .join(", ")} / - ${removed
      .map((x) => x["Nom de la commune"])
      .join(", ")}`,
    added,
    removed,
    year: Number(rows[0]?.["Entrée en vigueur"].split(".")[2]),
    "Entrée en vigueur": rows[0]?.["Entrée en vigueur"],
    "Numéro de mutation": rows[0]?.["Numéro de mutation"],
  };
};

type Parsed = ReturnType<typeof parseMutationRows>;

const INITIAL_VIEW_STATE = {
  latitude: 46.8182,
  longitude: 8.2275,
  zoom: 7,
  maxZoom: 16,
  minZoom: 2,
  pitch: 0,
  bearing: 0,
  transitionInterpolator: new FlyToInterpolator(),
  transitionDuration: 1000,
};

export default function Page() {
  const [groupedMutations, setGroupedMutations] = useState<
    ReturnType<typeof parseMutationRows>[]
  >([]);
  const [highlightedMunicipalities, setHighlightedMunicipalities] =
    useState<Parsed>();

  const handleMutationSelect = (parsed: Parsed) => {
    setHighlightedMunicipalities(parsed);
    setYear1(`${parsed.year - 1}`);
    setYear2(`${parsed.year}`);
  };

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const [year1, setYear1] = useState("2022");
  const [year2, setYear2] = useState("2024");
  const { data: geoData1 } = useGeoData({
    year: year1,
    format: "topojson",
    simplify: 0.02,
    shapes: new Set(["municipalities"]),
    projection: "wgs84",
    color: "default",
    dimensions: { width: 800, height: 600 },
    withName: false,
  });

  const { data: geoData2 } = useGeoData({
    year: year2,
    format: "topojson",
    simplify: 0.02,
    shapes: new Set(["municipalities"]),
    projection: "wgs84",
    color: "default",
    dimensions: { width: 800, height: 600 },
    withName: false,
  });
  useEffect(() => {
    const { added = [], removed = [] } = highlightedMunicipalities ?? {};
    const all = [...added, ...removed].map((x) => x["N° OFS commune"]);
    const findFeature = (x: GeoDataFeature) => all.includes(x.properties?.id);
    const municipality =
      geoData1.municipalities?.features.find(findFeature) ??
      geoData2.municipalities?.features.find(findFeature);
    if (municipality) {
      const mbbox = turf.center(municipality);
      setViewState((prev) => ({
        ...prev,
        longitude: mbbox.geometry.coordinates[0],
        latitude: mbbox.geometry.coordinates[1],
        zoom: 9,

        transitionInterpolator: new FlyToInterpolator(),
        transitionDuration: 300,
      }));
    } else {
      console.log(
        "Cannot find municipality",
        municipality,
        highlightedMunicipalities
      );
    }
  }, [highlightedMunicipalities, geoData1, geoData2]);

  const handleChangeContent = (html: string) => {
    try {
      const data = Object.values(parseHTML(html));
      const groupedMutations = data.map(parseMutationRows);
      setGroupedMutations(groupedMutations);
      setHighlightedMunicipalities(groupedMutations[0]);
    } catch (e) {
      alert(e instanceof Error ? e.message : `${e}`);
    }
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="300px 1fr"
      height="100vh"
      overflow="hidden"
    >
      <Box
        component={List}
        sx={{
          overflow: "scroll",
          height: "100%",
          borderRight: "1px solid #ccc",
          p: 1,
        }}
      >
        <Box sx={{ p: 1 }}>
          <Typography variant="body1">
            Copy/paste here the HTML content of the mutation table, see for{" "}
            <Link
              target="_blank"
              href="https://www.agvchapp.bfs.admin.ch/fr/mutations/results?EntriesFrom=01.01.2023&EntriesTo=01.01.2024"
            >
              here
            </Link>
            . Choose display "100" elements to be able to copy all mutations. .
          </Typography>
          <textarea
            onPaste={(event) => {
              event.preventDefault();
              const clipboardData = event.clipboardData;
              const html =
                clipboardData.getData("text/html") ??
                clipboardData.getData("text/plain");
              event.currentTarget.value = html;
              // Display the HTML in the textarea
              handleChangeContent(html);
            }}
          />
          <Button
            size="small"
            onClick={() => {
              handleChangeContent(SAMPLE_HTML);
            }}
          >
            Load sample
          </Button>
        </Box>
        {Object.values(groupedMutations).map((parsed, index) => {
          return (
            <ListItem
              selected={highlightedMunicipalities === parsed}
              key={index}
              button
              onClick={() => handleMutationSelect(parsed)}
            >
              <ListItemText
                primary={parsed.label}
                secondary={`${parsed["Entrée en vigueur"]} - ${parsed["Numéro de mutation"]}`}
              />
            </ListItem>
          );
        })}
      </Box>
      <Box sx={{ p: 2 }}>
        <Box
          display="grid"
          gridTemplateColumns="1fr 1fr"
          gridColumnGap="1rem"
          height="100%"
        >
          <div>
            <Typography variant="h5">{year1}</Typography>
            <Box height="90%" position="relative" border="1px solid #ccc">
              <MutationsMap
                viewState={viewState}
                geoData={geoData1}
                onViewStateChange={({ viewState }: { viewState: $FixMe }) =>
                  setViewState(viewState)
                }
                highlightedMunicipalities={{
                  added:
                    highlightedMunicipalities?.added.map(
                      (x) => x["N° OFS commune"]
                    ) ?? [],
                  removed:
                    highlightedMunicipalities?.removed.map(
                      (x) => x["N° OFS commune"]
                    ) ?? [],
                }}
              />
            </Box>
          </div>
          <div>
            <Typography variant="h5">{year2}</Typography>
            <Box height="90%" position="relative" border="1px solid #ccc">
              <MutationsMap
                geoData={geoData2}
                viewState={viewState}
                highlightedMunicipalities={{
                  added:
                    highlightedMunicipalities?.added.map(
                      (x) => x["N° OFS commune"]
                    ) ?? [],
                  removed:
                    highlightedMunicipalities?.removed.map(
                      (x) => x["N° OFS commune"]
                    ) ?? [],
                }}
              />
            </Box>
          </div>
        </Box>
      </Box>
    </Box>
  );
}

const SAMPLE_HTML = `
<table class="table table-bordered text-right dataTable no-footer dtr-inline" width="100%" id="DataTables_Table_0" role="grid" aria-describedby="DataTables_Table_0_info" style="width: 100%;"><thead><tr class="text-left" role="row"><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 0px;">N° d'hist.</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 0px;">Canton</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 0px;">N° du district</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 0px;">Nom du district</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 0px;">N° OFS commune</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 0px;">Nom de la commune</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 0px;">Raison de la radiation</th><th class="sorting_disabled" rowspan="1" colspan="1" style="width: 0px;">Raison de l'inscription</th></tr>
                </thead>
                <tbody>
                

                

                <tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3964</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2023</em></td></tr><tr role="row" class="odd"><td tabindex="0">11735</td><td>ZH</td><td>102</td><td>Bezirk Andelfingen</td><td>21</td><td>Adlikon</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">12173</td><td>ZH</td><td>102</td><td>Bezirk Andelfingen</td><td>32</td><td>Humlikon</td><td>Radiation</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">13214</td><td>ZH</td><td>102</td><td>Bezirk Andelfingen</td><td>30</td><td>Andelfingen</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="even"><td tabindex="0">16621</td><td>ZH</td><td>102</td><td>Bezirk Andelfingen</td><td>291</td><td>Andelfingen</td><td></td><td>Modification du territoire</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3965</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2023</em></td></tr><tr role="row" class="odd"><td tabindex="0">15116</td><td>BE</td><td>246</td><td>Verwaltungskreis Bern-Mittelland</td><td>536</td><td>Diemerswil</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">15125</td><td>BE</td><td>246</td><td>Verwaltungskreis Bern-Mittelland</td><td>546</td><td>Münchenbuchsee</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">16622</td><td>BE</td><td>246</td><td>Verwaltungskreis Bern-Mittelland</td><td>546</td><td>Münchenbuchsee</td><td></td><td>Modification du territoire</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3966</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2023</em></td></tr><tr role="row" class="even"><td tabindex="0">14441</td><td>SG</td><td>1727</td><td>Wahlkreis Toggenburg</td><td>3372</td><td>Hemberg</td><td>Radiation</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">14444</td><td>SG</td><td>1727</td><td>Wahlkreis Toggenburg</td><td>3375</td><td>Oberhelfenschwil</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">14950</td><td>SG</td><td>1727</td><td>Wahlkreis Toggenburg</td><td>3378</td><td>Neckertal</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">16623</td><td>SG</td><td>1727</td><td>Wahlkreis Toggenburg</td><td>3396</td><td>Neckertal</td><td></td><td>Modification du territoire</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3967</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2023</em></td></tr><tr role="row" class="even"><td tabindex="0">13301</td><td>JU</td><td>2602</td><td>District des Franches-Montagnes</td><td>6743</td><td>Les Breuleux</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">13302</td><td>JU</td><td>2602</td><td>District des Franches-Montagnes</td><td>6744</td><td>La Chaux-des-Breuleux</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">16624</td><td>JU</td><td>2602</td><td>District des Franches-Montagnes</td><td>6743</td><td>Les Breuleux</td><td></td><td>Modification du territoire</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3968</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2023</em></td></tr><tr role="row" class="odd"><td tabindex="0">11503</td><td>AG</td><td>1905</td><td>Bezirk Kulm</td><td>4133</td><td>Burg (AG)</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">12397</td><td>AG</td><td>1905</td><td>Bezirk Kulm</td><td>4139</td><td>Menziken</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">16625</td><td>AG</td><td>1905</td><td>Bezirk Kulm</td><td>4139</td><td>Menziken</td><td></td><td>Modification du territoire</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3969</em>, Type de mutation : <em>Fusion de communes</em>, Entrée en vigueur : <em>01.01.2023</em></td></tr><tr role="row" class="even"><td tabindex="0">10849</td><td>AG</td><td>1906</td><td>Bezirk Laufenburg</td><td>4179</td><td>Ueken</td><td>Radiation</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">12317</td><td>AG</td><td>1906</td><td>Bezirk Laufenburg</td><td>4166</td><td>Herznach</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">16626</td><td>AG</td><td>1906</td><td>Bezirk Laufenburg</td><td>4186</td><td>Herznach-Ueken</td><td></td><td>Création</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3970</em>, Type de mutation : <em>Fusion de communes</em>, Entrée en vigueur : <em>01.01.2023</em></td></tr><tr role="row" class="odd"><td tabindex="0">13334</td><td>JU</td><td>2603</td><td>District de Porrentruy</td><td>6787</td><td>Damphreux</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">13340</td><td>JU</td><td>2603</td><td>District de Porrentruy</td><td>6793</td><td>Lugnez</td><td>Radiation</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">16627</td><td>JU</td><td>2603</td><td>District de Porrentruy</td><td>6811</td><td>Damphreux-Lugnez</td><td></td><td>Création</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3983</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2024</em></td></tr><tr role="row" class="even"><td tabindex="0">15266</td><td>BE</td><td>247</td><td>Verwaltungskreis Thun</td><td>767</td><td>Reutigen</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">15344</td><td>BE</td><td>247</td><td>Verwaltungskreis Thun</td><td>947</td><td>Zwieselberg</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">16651</td><td>BE</td><td>247</td><td>Verwaltungskreis Thun</td><td>767</td><td>Reutigen</td><td></td><td>Modification du territoire</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3984</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2024</em></td></tr><tr role="row" class="odd"><td tabindex="0">15375</td><td>BE</td><td>244</td><td>Verwaltungskreis Oberaargau</td><td>992</td><td>Wangen an der Aare</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="even"><td tabindex="0">15376</td><td>BE</td><td>244</td><td>Verwaltungskreis Oberaargau</td><td>993</td><td>Wangenried</td><td>Radiation</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">16652</td><td>BE</td><td>244</td><td>Verwaltungskreis Oberaargau</td><td>992</td><td>Wangen an der Aare</td><td></td><td>Modification du territoire</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3985</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2024</em></td></tr><tr role="row" class="even"><td tabindex="0">14067</td><td>SO</td><td>1103</td><td>Bezirk Bucheggberg</td><td>2456</td><td>Lüterswil-Gächliwil</td><td>Radiation</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">15642</td><td>SO</td><td>1103</td><td>Bezirk Bucheggberg</td><td>2465</td><td>Buchegg</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="even"><td tabindex="0">16653</td><td>SO</td><td>1103</td><td>Bezirk Bucheggberg</td><td>2465</td><td>Buchegg</td><td></td><td>Modification du territoire</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3986</em>, Type de mutation : <em>Fusion de communes</em>, Entrée en vigueur : <em>01.01.2024</em></td></tr><tr role="row" class="odd"><td tabindex="0">13320</td><td>JU</td><td>2603</td><td>District de Porrentruy</td><td>6773</td><td>Beurnevésin</td><td>Radiation</td><td></td></tr><tr role="row" class="even"><td tabindex="0">13322</td><td>JU</td><td>2603</td><td>District de Porrentruy</td><td>6775</td><td>Bonfol</td><td>Radiation</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">16654</td><td>JU</td><td>2603</td><td>District de Porrentruy</td><td>6812</td><td>Basse-Vendline</td><td></td><td>Création</td></tr><tr><td colspan="9" class="text-left mutation-detail">Numéro de mutation : <em>3987</em>, Type de mutation : <em>Inclusion de commune</em>, Entrée en vigueur : <em>01.01.2024</em></td></tr><tr role="row" class="even"><td tabindex="0">10886</td><td>AG</td><td>1902</td><td>Bezirk Baden</td><td>4042</td><td>Turgi</td><td>Radiation</td><td></td></tr><tr role="row" class="odd"><td tabindex="0">13189</td><td>AG</td><td>1902</td><td>Bezirk Baden</td><td>4021</td><td>Baden</td><td>Modification du territoire</td><td></td></tr><tr role="row" class="even"><td tabindex="0">16655</td><td>AG</td><td>1902</td><td>Bezirk Baden</td><td>4021</td><td>Baden</td><td></td><td>Modification du territoire</td></tr></tbody></table>
`;
