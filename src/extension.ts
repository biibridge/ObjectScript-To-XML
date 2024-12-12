// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import path = require("path");

export const extensionId = "objectscript-to-xml";

import {getExportXML} from "./commands/exportXML";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "objectscript-to-xml" is now active!');

	context.subscriptions.push(
		// The command has been defined in the package.json file
		// Now provide the implementation of the command with registerCommand
		// The commandId parameter must match the command field in package.json
		vscode.commands.registerCommand(`${extensionId}.exportXML`, (_file, files) => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user

			const configEXML = vscode.workspace.getConfiguration('objectscript-to-xml');
			const bundled: boolean = configEXML.get("bundled") || false;

			if (files === undefined) {
				if (_file !== undefined) {
					files.push(_file);
				}
			}

			if (bundled) {
				getExportXML(files);
			} else {
				files.map((file: any) => {
					getExportXML([file]);
				});
			}
			
			/*
			if (files != undefined) {
				
				files.map((file: any) => {
					try {
						getExportXML(file);
						vscode.window.showInformationMessage('Export ObjectScript Classes in XML');
					} catch (error) {
						let name: string = path.basename(file.path) || ".";
						let message = `Failed to create export file '${name}'.`;
						vscode.window.showErrorMessage(message, "Dismiss");
					}
				});
			} else {
				try {
					getExportXML(_file);
					vscode.window.showInformationMessage('Export ObjectScript Classes in XML');
				} catch (error) {
					let name: string = path.basename(_file.path) || ".";
					let message = `Failed to create export file '${name}'.`;
					vscode.window.showErrorMessage(message, "Dismiss");
				}
			}
				*/
		})
		/*,
		vscode.commands.registerCommand(`${extensionId}.exportXMLs`, (_file, files) => {
			if (files != undefined) {
				try {
					getExportXMLs(files);
					vscode.window.showInformationMessage('Export ObjectScript Classes in XML');
				} catch (error) {
					let name: string = path.basename(files.path) || ".";
					let message = `Failed to create export file '${name}'.`;
					vscode.window.showErrorMessage(message, "Dismiss");
				}
			} else {
				try {
					getExportXMLs([_file]);
					vscode.window.showInformationMessage('Export ObjectScript Classes in XML');
				} catch (error) {
					let name: string = path.basename(_file.path) || ".";
					let message = `Failed to create export file '${name}'.`;
					vscode.window.showErrorMessage(message, "Dismiss");
				}
			}
		});
		*/
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
