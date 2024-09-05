import { JSDOM } from "jsdom";
import { NextApiHandler } from "next";
import { MunicipalityMigrationData } from "src/domain/municipality-migrations";

async function fetchAndParse(dateFrom: string, dateTo: string) {
  const url = `https://www.agvchapp.bfs.admin.ch/fr/mutations/results?EntriesFrom=${dateFrom}&EntriesTo=${dateTo}`;

  const response = await (await fetch(url)).text();
  const html = response;

  const dom = new JSDOM(html);
  const document = dom.window.document;

  const scriptsWithDs = document.querySelectorAll("script");
  let dsValue;

  scriptsWithDs.forEach((script) => {
    const content = script.textContent;
    if (content && content.includes("var ds")) {
      const trimmed = content.slice(0, content.indexOf("var getGroupLabel"));
      dsValue = eval(`${trimmed}; ({ ds: ds, mutations: mutations })`);
      return;
    }
  });

  if (dsValue) {
    return MunicipalityMigrationData.parse(dsValue);
  } else {
    throw new Error("Script with var ds not found");
  }
}

const handler: NextApiHandler = async (req, res) => {
  const { from: dateFrom, to: dateTo } = req.query;
  if (!dateFrom || !dateTo) {
    return res
      .status(400)
      .send('Please provide "from" and "to" query parameters');
  }
  const content = await fetchAndParse(dateFrom as string, dateTo as string);

  return res.send(content);
};

export default handler;
