import * as vscode from 'vscode';
import path = require("path");

export const extensionId = "objectscript-to-xml";

import {getExportXML} from "./commands/exportXML";

// このメソッドは拡張機能がアクティブ化されたときに呼び出されます
// 拡張機能はコマンドが最初に実行されたときにアクティブになります
export function activate(context: vscode.ExtensionContext) {

	// コンソールを使用して診断情報 (console.log) とエラー (console.error) を出力します。
	// このコード行は拡張機能が有効化されるときに一度だけ実行されます
	console.log('Congratulations, your extension "objectscript-to-xml" is now active!');

	context.subscriptions.push(
		// コマンドはpackage.jsonファイルで定義されています
		// 次に、registerCommandを使用してコマンドの実装を提供します。
		// commandIdパラメータはpackage.jsonのコマンドフィールドと一致する必要があります
		vscode.commands.registerCommand(`${extensionId}.exportXML`, async (_file, files) => {
			// ここに記述したコードはコマンドが実行されるたびに実行されます
			
			const conn = vscode.workspace.getConfiguration("objectscript.conn");
			const serverName: string = conn.server;
			const configServer = vscode.workspace.getConfiguration(`intersystems.servers.${serverName.toLowerCase()}`);
			let username: string = configServer.get("username") || "";
			let password: string = configServer.get("password") || "";
			const configEXML = vscode.workspace.getConfiguration('objectscript-to-xml');
			const bundled: boolean = configEXML.get("bundled") || false;

			if (!username) {
				username = await vscode.window.showInputBox({
					prompt: 'Please enter your login user name.'
				}) || "";
			}
			if (!password) {
				password = await vscode.window.showInputBox({
					prompt: `Please enter your ${username} password.`,
					placeHolder: `Password for user '${username}' on '${serverName}'`,
					password: true
				}) || "";
			}
			// prompt: "Optionally use key button above to store password",

			if (files === undefined) {
				if (_file !== undefined) {
					files.push(_file);
				}
			}

			if (bundled) {
				getExportXML(files, username, password);
			} else {
				files.map((file: any) => {
					getExportXML([file], username, password);
				});
			}
		})
	);
}

// このメソッドは拡張機能が非アクティブ化されたときに呼び出されます
export function deactivate() {}