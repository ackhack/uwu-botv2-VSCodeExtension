// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

var createDC = function () {
	vscode.window.showInputBox({ placeHolder: 'Enter Command name here' }).then(input => {

		let name = input[0].toUpperCase() + input.slice(1);
		let File = `import DiscordJS from 'discord.js';\nimport { ApplicationCommandOptionTypes } from 'discord.js/typings/enums';\nimport { DevCommandClass } from '../utils/Commands/DevCommand/DevCommand';\n\nclass ${name} extends DevCommandClass {\n    name = "${name.toLowerCase()}";\n    shortcut: string | undefined;\n    description: string;\n    options: { name: string; description: string; required: boolean; type: ApplicationCommandOptionTypes; }[];\n    reply(interaction: DiscordJS.CommandInteraction<DiscordJS.CacheType>): void {\n        interaction.reply({ content: "${name} Command called" });\n    }\n}\n\nexport function getInstance() { return new ${name}() };`;
		let Location = vscode.workspace.workspaceFolders[0].uri.fsPath + path.sep + 'src' + path.sep + 'DevCommands' + path.sep + name + '.ts';

		try {
			fs.writeFileSync(Location, File);
			vscode.window.showInformationMessage('Created Command');
			vscode.workspace.openTextDocument(Location).then(doc => {
				vscode.window.showTextDocument(doc);
			});
		} catch (err) {
			vscode.window.showInformationMessage('Error :' + err);
		}
	})
}

var dcToNc = function () {
	let filePath = vscode.window.activeTextEditor.document.uri.fsPath;
	if (!filePath.includes(vscode.workspace.workspaceFolders[0].uri.fsPath + path.sep + 'src' + path.sep + 'DevCommands' + path.sep)) {
		vscode.window.showInformationMessage('This is not a DevCommand, check if it is in the DevCommands folder');
		return;
	}
	try {
		let content = fs.readFileSync(filePath).toString();
		content = content.replace(`import { DevCommandClass } from '../utils/Commands/DevCommand/DevCommand';`, `import { NormalCommandClass } from '../utils/Commands/NormalCommand/NormalCommand';`);
		content = content.replace(/class (\w+) extends DevCommandClass {/, `class $1 extends NormalCommandClass {`);
		let newPath = filePath.replace('DevCommands', 'Commands');
		fs.writeFileSync(newPath, content);
		fs.rmSync(filePath);
		vscode.workspace.openTextDocument(newPath).then(doc => {
			vscode.window.showTextDocument(doc);
		});
		vscode.window.showInformationMessage('Converted to Normal Command');
	} catch (err) {
		vscode.window.showInformationMessage('Error :' + err);
	}
}

var dcToAc = function () {
	let filePath = vscode.window.activeTextEditor.document.uri.fsPath;
	if (!filePath.includes(vscode.workspace.workspaceFolders[0].uri.fsPath + path.sep + 'src' + path.sep + 'DevCommands' + path.sep)) {
		vscode.window.showInformationMessage('This is not a DevCommand, check if it is in the DevCommands folder');
		return;
	}
	try {
		let content = fs.readFileSync(filePath).toString();
		content = content.replace(`import { DevCommandClass } from '../utils/Commands/DevCommand/DevCommand';`, `import { AdminCommandClass } from '../utils/Commands/AdminCommand/AdminCommand';`);
		content = content.replace(/class (\w+) extends DevCommandClass {/, `class $1 extends AdminCommandClass {`);
		let newPath = filePath.replace('DevCommands', 'AdminCommands');
		fs.writeFileSync(newPath, content);
		fs.rmSync(filePath);
		vscode.workspace.openTextDocument(newPath).then(doc => {
			vscode.window.showTextDocument(doc);
		});
		vscode.window.showInformationMessage('Converted to Admin Command');
	} catch (err) {
		vscode.window.showInformationMessage('Error :' + err);
	}
}

var Functions = { //Add new Functions here
	"uwu-ct.createDC": createDC,
	"uwu-ct.DCtoNC": dcToNc,
	"uwu-ct.DCtoAC": dcToAc
}

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) { //Add all Functions as Commands
	for (let x in Functions) {
		context.subscriptions.push(vscode.commands.registerCommand(x, Functions[x]));
	}
}
// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}