// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import generateDocumentation from "./utils/documentation";
import path = require("path");
import { identifyLanguageFromExtension } from "./utils/snippet_handlers";

export const activate = (context: vscode.ExtensionContext) => {
  let disposable = vscode.commands.registerCommand(
    "gptdocs.generate",
    async () => {
      //identify editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No code selected");
        return;
      }
      //identify language
      const language = identifyLanguageFromExtension(
        path.extname(editor.document.fileName)
      );
      if (language instanceof Error) {
        vscode.window.showInformationMessage("Error occured", language.message);
        return;
      }
      // generate docs for selected text based on language
      const response = await generateDocumentation(
        editor.document.getText(editor.selection),
        language
      );
      if (response instanceof Error) {
        vscode.window.showInformationMessage("Error occured", response.message);
        return;
      }
      editor.edit((edit) => {
        edit.replace(editor.selection, response);
      });
      vscode.window.showInformationMessage(
        "Documentation generated successfully"
      );
    }
  );
  context.subscriptions.push(disposable);
};

// This method is called when your extension is deactivated
export function deactivate() {}
