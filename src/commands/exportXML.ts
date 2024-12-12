import * as vscode from 'vscode';
import path = require("path");
import * as fs from 'fs';
import axios from "axios";

const serverName: string = "docker";

const configServer = vscode.workspace.getConfiguration(`intersystems.servers.${serverName.toLowerCase()}`);
const proto: string = vscode.workspace.getConfiguration(`intersystems.servers.${serverName.toLowerCase()}.webServer`).get("scheme") || "";
const host: string = vscode.workspace.getConfiguration(`intersystems.servers.${serverName.toLowerCase()}.webServer`).get("host") || "";
const port: number = vscode.workspace.getConfiguration(`intersystems.servers.${serverName.toLowerCase()}.webServer`).get("port") || 80;
const configConn = vscode.workspace.getConfiguration('objectscript.conn');
const namespace: string = configConn.get("ns") || "";
const username: string = configServer.get("username") || "_SYSTEM";
const password: string = configServer.get("password") || "SYS";;

export async function getExportXML(files: vscode.Uri[]): Promise<any> {

    try {
        const list: string[] = [];
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(files[0]);
        const configEXML = vscode.workspace.getConfiguration('objectscript-to-xml');
        let api: string = configEXML.get("applicationName") || "";
		let exportDir: string = configEXML.get("exportDir") || "";
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
            file: list,
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
            let mineType = response.headers["content-type"];
            const name = getFileName(response.headers["content-disposition"]);
            
            //const saveUri = await vscode.window.showSaveDialog({ defaultUri: vscode.Uri.file(name) });
            //console.log(saveUri);
            const savePath: string = "" + exportDir + "/" + name;
            console.log(savePath);
            if (savePath) {
                fs.writeFileSync(savePath, response.data);
                vscode.window.showInformationMessage('Export ObjectScript Classes in XML');
            }
        }
    } catch (error) {
        //let name: string = path.basename(file.path) || ".";
        //let message = `Failed to create export file '${name}'.`;
        const message = "";
        vscode.window.showErrorMessage(message, "Dismiss");
        throw error;
    }
};

const getFileName = (contentDisposition: string) => {
    return contentDisposition.substring(
        contentDisposition.indexOf("filename=") + 9,
        contentDisposition.length,
    );
};