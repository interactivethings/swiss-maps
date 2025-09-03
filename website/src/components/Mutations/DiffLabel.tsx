import { alpha, Box, Tooltip } from "@mui/material";
import { MunicipalityMigrationDataItem } from "src/domain/municipality-migrations";
import { Chip } from "@mui/material";
import { ADDED_COLOR, REMOVED_COLOR } from "@/components/Mutations/Map";

export const DiffLabel = ({
  item,
}: {
  item: MunicipalityMigrationDataItem;
}) => {
  const { added, removed } = item;

  // Find municipalities that are both added and removed (changed)
  const addedOfsNumbers = new Set(added.map((m) => m.ofsNumber));
  const removedOfsNumbers = new Set(removed.map((m) => m.ofsNumber));

  const changed = added.filter((m) => removedOfsNumbers.has(m.ofsNumber));
  const onlyAdded = added.filter((m) => !removedOfsNumbers.has(m.ofsNumber));
  const onlyRemoved = removed.filter((m) => !addedOfsNumbers.has(m.ofsNumber));

  if (
    onlyAdded.length === 0 &&
    onlyRemoved.length === 0 &&
    changed.length === 0
  ) {
    return "No changes";
  }

  const renderMunicipalities = (
    municipalities: typeof added,
    type: "addition" | "removal" | "change"
  ) =>
    municipalities.map((municipality) => (
      <Box
        component="span"
        sx={{
          display: "inline-block",
          mb: 0.25,
          mr: 0.25,
          height: 24,
          whiteSpace: "balance",
          bgcolor: alpha(
            type === "addition"
              ? ADDED_COLOR.hex
              : type === "removal"
              ? REMOVED_COLOR.hex
              : "#ff9800", // Orange for changes
            0.1
          ),
        }}
        key={municipality.ofsNumber}
      >
        <Tooltip
          enterDelay={500}
          title={`${
            type === "addition"
              ? "Added"
              : type === "removal"
              ? "Removed"
              : "Changed"
          } municipality ${municipality.municipalityName}`}
          arrow
        >
          <span>{municipality.municipalityName}</span>
        </Tooltip>{" "}
        <Tooltip title="This is the ofsNumber" arrow enterDelay={500}>
          <Chip label={municipality.ofsNumber} size="small" />
        </Tooltip>
      </Box>
    ));

  return (
    <>
      {changed.length > 0 && (
        <span>{renderMunicipalities(changed, "change")}</span>
      )}
      {onlyAdded.length > 0 && (
        <span>{renderMunicipalities(onlyAdded, "addition")}</span>
      )}
      {onlyAdded.length > 0 &&
        (onlyRemoved.length > 0 || changed.length > 0) && <>&nbsp;</>}
      {onlyRemoved.length > 0 && (
        <span>{renderMunicipalities(onlyRemoved, "removal")}</span>
      )}
      {onlyRemoved.length > 0 && changed.length > 0 && <>&nbsp;</>}
    </>
  );
};
