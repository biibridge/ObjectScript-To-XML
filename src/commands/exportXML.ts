import * as vscode from 'vscode';
import path = require("path");
import * as fs from 'fs';
import axios from "axios";

const conn = vscode.workspace.getConfiguration("objectscript.conn");
const serverName: string = conn.server;
const proto: string = vscode.workspace.getConfiguration(`intersystems.servers.${serverName.toLowerCase()}.webServer`).get("scheme") || "";
const host: string = vscode.workspace.getConfiguration(`intersystems.servers.${serverName.toLowerCase()}.webServer`).get("host") || "";
const port: number = vscode.workspace.getConfiguration(`intersystems.servers.${serverName.toLowerCase()}.webServer`).get("port") || 80;
const configConn = vscode.workspace.getConfiguration('objectscript.conn');
const namespace: string = configConn.get("ns") || "";

export async function getExportXML(files: vscode.Uri[], username: string, password: string): Promise<any> {

    try {
        const list: string[] = [];
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(files[0]);
        const configEXML = vscode.workspace.getConfiguration('objectscript-to-xml');
        let api: string = configEXML.get("applicationName") || "/exml-api";
		let exportDir: string = configEXML.get("exportDir") || "export";
        if (api.substring(0, 1) !== "/") {
            api = "/" + api;
        }
        const pathx: string = api + "/exportsXml";
        
        if (exportDir !== "") {
            exportDir = workspaceFolder?.uri.fsPath + "/" + exportDir;
            if (!fs.existsSync(exportDir)) {
                fs.mkdirSync(exportDir, { recursive: true });
            }
        }

        files.map((file) => {
            let name: string = path.basename(file.path) || ".";

            if (name.split(".").pop()?.toLowerCase()) {
                let className = name.split(".");
                className.pop();
                list.push(className.join("."));
            }
        });
        
        if (list.length === 0) {
            return;
        }
        
        const body = {
            files: list,
            ns: namespace
        };
        
        const request = {
            method: "POST",
            url:`${proto}://${host}:${port}${pathx}`,
            headers: {
                'Accept': 'application/json',
				'Content-Type': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`
            },
            data: body,
            withCredentials: true,
        };
        
        const response = await axios.request(request);
        if (response.status === 200) {
            const mess = response.data.message;
            const xml = response.data.xml;
            const filename = response.data.filename;
            
            // コンソールに出力
            console.log(mess);

            const savePath: string = "" + exportDir + "/" + filename;
            
            if (savePath) {
                fs.writeFile(savePath, xml, (err) => {
                    if (err) {
                        vscode.window.showErrorMessage(`Failed to save XML file. ${err}`);
                    } else {
                        vscode.window.showInformationMessage('Export ObjectScript Classes in XML');
                    }
                });
            }
        }
    } catch (error) {
        let message = "Failed to create export file.";
        vscode.window.showErrorMessage(message);
        throw error;
    }
};
