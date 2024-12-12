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
		vscode.commands.registerCommand(`${extensionId}.exportXML`, (_file, files) => {
			// ここに記述したコードはコマンドが実行されるたびに実行されます
			
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
		})
	);
}

// このメソッドは拡張機能が非アクティブ化されたときに呼び出されます
export function deactivate() {}
