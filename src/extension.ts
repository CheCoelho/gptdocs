// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import axios from "axios";
import { json } from "stream/consumers";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export const activate = async (context: vscode.ExtensionContext) => {
  const exampleFunc = () => {
    console.log("Example Function");
  };
  const baseUrl = "https://api.openai.com/v1/completions";
  const headerDict = {
    "Content-Type": "application/json",
    Authorization: "Bearer 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",
  };
  const functionBody = exampleFunc.toString();
  const functionName = exampleFunc.name;

  const params = {
    model: "text-davinci-003",
    prompt: `Create JsDocs or TsDocs for the following function body ${functionBody} with a name of ${functionName}`,
    temperature: 0,
    max_tokens: 160,
  };

  const makeRequest = async () => {
    try {
      const test = await axios.post(baseUrl, params, { headers: headerDict });
      return JSON.stringify(test.data);
    } catch (error: any) {
      return error.toString();
    }
  };

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "gptdocs" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "gptdocs.helloWorld",
    async () => {
      try {
        const res = await makeRequest();

        vscode.window.showInformationMessage(
          //   `Hello World from GPTDocs! your function named ${functionName} has the body ${functionBody}`
          res
        );
      } catch (error) {
        vscode.window.showInformationMessage(
          //   `Hello World from GPTDocs! your function named ${functionName} has the body ${functionBody}`
          "Error in code"
        );
      }
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
    }
  );

  context.subscriptions.push(disposable);
};

// This method is called when your extension is deactivated
export function deactivate() {}
