// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');

var createCT = function () { //This creates a Command Template
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
}

var testCommand = function () {
	vscode.window.showInputBox({ placeHolder: 'Enter Arguments for Command' }).then(input => {

		let Location = vscode.window.activeTextEditor.document.fileName;
		let Pattern = /.*[\\/]uwuBot[\\/]Commands[\\/].+\.js/;

		if (Location.match(Pattern) == null) { //Test if File is in CommandFolder
			vscode.window.showInformationMessage(Location + " is not a valid CommandLocation");
			return;
		}

		this.global.wsip = require(vscode.workspace.rootPath + '/Files/local/wsip.json'); //IP thats used for every WS-Call

		let name = Location.match(/.+[\\/]Commands[\\/](.+)\.js/)[1];
		let message = {};

		message.content = "!" + name + " " + input;

		message.channel = {};
		message.channel.send = function (toSend) {
			vscode.window.showInformationMessage(toSend);
		}

		try {
			let com = require(Location);
			com[name](message);
			delete require.cache[Location];
		} catch (err) {
			vscode.window.showInformationMessage(err);
		}
	})
}

var Functions = { //Add new Functions here
	"uwu-ct.createCT": createCT,
	"uwu-ct.testCommand": testCommand
}

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) { //Add all Functions as Commands
	for (let x in Functions) {
		context.subscriptions.push(vscode.commands.registerCommand(x, Functions[x]));
	}
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
