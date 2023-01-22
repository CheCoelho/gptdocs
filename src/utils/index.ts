import { Configuration, OpenAIApi } from "openai";
import * as vscode from "vscode";
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});
const openai = new OpenAIApi(configuration);

const generateDocumentation = async (code: string): Promise<string | Error> => {
  console.log(process.env.OPEN_AI_SECRET_KEY);
  console.log(process.env);
  code = code.trim();
  try {
    let functionRegex;
    if (code.startsWith("export const")) {
      functionRegex = /(?<=export\s*const)\s+(\w+)\s*=/;
    } else if (code.startsWith("export function")) {
      functionRegex = /(?<=export\s*function)\s+(\w+)\s*(?=\()/;
    } else if (code.startsWith("const")) {
      functionRegex = /(?<=const)\s+(\w+)\s*(?=())/;
    } else if (code.startsWith("function")) {
      functionRegex = /(?<=function)\s+(\w+)\s*(?=\()/;
    }
    if (!functionRegex) {
      return new Error(
        `Failed to match the given function with a regular expression`
      );
    }

    const match = code.match(functionRegex);
    if (!match) {
      return new Error(`No function name found in code`);
    }
    const functionName = match[1];
    vscode.window.showInformationMessage(
      "Creating documentation... Please wait."
    );
    const res = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Create Typescript documentation for this function: ${functionName} following the TsDocs standard. 
      The comments should sit underneath the function definition before the logic of the function body. 
      The function is: ${code}. Ensure that any params are documented, as well as the return of the function.`,
      max_tokens: 2048,
    });
    console.log("RES", res);
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
