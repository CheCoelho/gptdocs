import { getLanguageBundle, SupportedLanguage } from "../types/languages";

export const assemblePrompt = (
  match: Array<any>,
  language: SupportedLanguage,
  code: string
) =>
  createPromptIntroduction(match, language) +
  addDocumentationExpectations(language) +
  addCode(code);

export const createPromptIntroduction = (
  match: Array<any>,
  language: SupportedLanguage
) => {
  const languageBundle = getLanguageBundle(language);
  return `Create ${languageBundle["language"]} documentation for this function named: "${match[1]}" following the ${languageBundle["documentation_standard"]} standard. `;
};

export const addDocumentationExpectations = (language: SupportedLanguage) => {
  if (language === "python") {
    return;
  }
  return `Provide a description of the arguments to the function. Ensure to also include a summary of the function and the return of the function.`;
};

// Add recursive searching for related modules here:

export const addCode = (code: string) => {
  return `The function code is: ${code}. Ensure not to alter any of the code in your response `;
};
