import { GenerateId } from "jss";

const pseudoClasses = [
  "checked",
  "disabled",
  "error",
  "focused",
  "focusVisible",
  "required",
  "expanded",
  "selected",
];

export default function createGenerateClassName(): GenerateId {
  const productionPrefix = "jss";
  let ruleCounter = 0;

  const getNextCounterId = () => {
    ruleCounter += 1;
    if (process.env.NODE_ENV !== "production") {
      if (ruleCounter >= 1e10) {
        console.warn(
          [
            "Material-UI: You might have a memory leak.",
            "The ruleCounter is not supposed to grow that much.",
          ].join("")
        );
      }
    }
    return ruleCounter;
  };

  return (rule, styleSheet) => {
    const name = (styleSheet?.options as any)?.name;

    if (name && name.match(/^[MX]ui/) && !styleSheet?.options.link) {
      if (pseudoClasses.indexOf(rule.key) !== -1) {
        return `Mui-${rule.key}`;
      }

      if (rule.key === "root") {
        return name;
      }

      return `${name}-${rule.key}`;
    }

    if (process.env.NODE_ENV === "production") {
      return `${productionPrefix}${getNextCounterId()}`;
    }

    const suffix = `${rule.key}-${getNextCounterId()}`;

    // Help with debuggability.
    if (styleSheet?.options.classNamePrefix) {
      return `${styleSheet?.options.classNamePrefix}-${suffix}`;
    }

    return `${suffix}`;
  };
}
