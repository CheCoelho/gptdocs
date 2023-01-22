import { SupportedLanguage } from "../types/languages";

export const identifyLanguageFromExtension = (
  fileExt: string
): SupportedLanguage | Error => {
  let language;
  switch (fileExt) {
    case ".js":
    case ".jsx":
      language = "javascript";
      break;
    case ".tsx":
    case ".ts":
      language = "typescript";
      break;
    case ".py":
      language = "python";
      break;
    case ".java":
      language = "java";
      break;
    default:
      language = new Error("Unsupported file type");
  }
  return language as SupportedLanguage;
};

export const handleTypescript = (code: string) => {
  let functionRegex;
  if (code.startsWith("export const")) {
    functionRegex = /(?<=export\s*const)\s+(\w+)\s*=/;
  } else if (code.startsWith("export function")) {
    functionRegex = /(?<=export\s*function)\s+(\w+)\s*(?=\()/;
  } else if (code.startsWith("const")) {
    functionRegex = /(?<=const)\s+(\w+)\s*(?=())/;
  } else if (code.startsWith("function")) {
    functionRegex = /(?<=function)\s+(\w+)\s*(?=\()/;
  } else {
    return new Error(
      `Failed to match the given function with a regular expression`
    );
  }
  return functionRegex;
};
