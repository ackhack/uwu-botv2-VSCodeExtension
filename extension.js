// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let com1 = vscode.commands.registerCommand('uwu-ct.createCT', function () { //Creates a Command-Template

		vscode.window.showInputBox({ placeHolder: 'Enter Command name here' }).then(input => {

			let name = input.toLowerCase();
			let File = '/**\n * @usage !' + name + '\n * @does WHAT DOES YOUR COMMAND\n */\nmodule.exports = {\n   ' + name + ': function(message) {\n	   message.channel.send(\'Function ' + name + '\');\n   }\n}';
			let Location = vscode.workspace.rootPath + '/Commands/' + name + '.js';

			try {
				fs.writeFileSync(Location, File);
				vscode.window.showInformationMessage('Created Command');
			} catch (err) {
				vscode.window.showInformationMessage('Error :' + err);
			}
		})
	})

	context.subscriptions.push(com1);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
