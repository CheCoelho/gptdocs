export type SupportedLanguage = "typescript" | "javascript" | "python";
const documentationStandards: { [K in SupportedLanguage]: string } = {
  typescript: "TsDocs",
  javascript: "JsDocs",
  python: "PyDocs",
};

export interface LanguageBundle<SupportedLanguage> {
  language: SupportedLanguage;
  documentation_standard: string;
}

export function getLanguageBundle(
  language: SupportedLanguage
): LanguageBundle<typeof language> {
  return {
    language: language,
    documentation_standard: documentationStandards[language],
  };
}
