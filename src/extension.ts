// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import generateDocumentation from "./utils";
export const activate = (context: vscode.ExtensionContext) => {
  let disposable = vscode.commands.registerCommand(
    "gptdocs.generate",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showInformationMessage("No code selected");
        return;
      }
      const selectedText = editor.document.getText(editor.selection);
      const response = await generateDocumentation(selectedText);
      console.log("RESPONSE", response, typeof response);
      if (response instanceof Error) {
        vscode.window.showInformationMessage("Error occured", response.message);
        return;
      }
      vscode.window.showInformationMessage(
        "Documentation generated successfully"
      );
      editor.edit((edit) => {
        edit.replace(editor.selection, response);
      });
    }
  );
  context.subscriptions.push(disposable);
};

// This method is called when your extension is deactivated
export function deactivate() {}
