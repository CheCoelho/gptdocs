import { Configuration, OpenAIApi } from "openai";
import * as vscode from "vscode";
import {
  addCode,
  addDocumentationExpectations,
  assemblePrompt,
  createPromptIntroduction,
} from "../constants/constants.prompts";
import { getLanguageBundle, SupportedLanguage } from "../types/languages";
import { handlePython, handleTypescript } from "./snippet_handlers";
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

const generateDocumentation = async (
  code: string,
  language: SupportedLanguage
): Promise<string | Error> => {
  code = code.trim();
  try {
    let functionRegex;
    switch (language) {
      case "typescript":
        functionRegex = handleTypescript(code);
        break;
      case "python":
        functionRegex = handlePython(code);
        break;
      default:
        functionRegex = new Error("Unrecognised language");
    }
    if (functionRegex instanceof Error) {
      return new Error(`Language not recognised`);
    }
    const match = code.match(functionRegex);
    if (!match) {
      return new Error(`No function name found in code`);
    }
    vscode.window.showInformationMessage(
      "Creating documentation... Please wait."
    );
    console.log("PROMPT: ", assemblePrompt(match, language, code));
    const res = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `${assemblePrompt(match, language, code)}`,
      max_tokens: 2048,
    });
    const comments = res.data.choices[0].text;
    if (!comments) {
      return "Comments unsuccessful";
    }
    return comments;
  } catch (error) {
    return error as Error;
  }
};
export default generateDocumentation;
