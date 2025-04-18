/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, ExtensionMode, extensions, RelativePattern, TextDocumentContentProvider, Uri, window, workspace } from 'vscode';
import { LanguageClientOptions } from 'vscode-languageclient';

import { LanguageClient } from 'vscode-languageclient/browser';
import { resourceFiles } from './assets/resourceFiles';
const intelliskriptScheme = 'intelliskript';
const resourceFolderString = '/resources';
let client: LanguageClient | undefined;
// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {

	console.log('intelliskript activated!');

	/*
	 * all except the code to create the language client in not browser specific
	 * and could be shared with a regular (Node) extension
	 */
	const documentSelector = [{ language: 'skript' }];

	// Options to control the language client
	const clientOptions: LanguageClientOptions = {
		documentSelector,
		synchronize: {},
		initializationOptions: {}
	};

	const myProvider = new (class implements TextDocumentContentProvider {
		provideTextDocumentContent(uri: Uri): string {
			//remove the '\'
			return resourceFiles.get(uri.path.substring((resourceFolderString + '/').length)) ?? "#document could not be opened";
		}
	})();
	workspace.registerTextDocumentContentProvider(intelliskriptScheme, myProvider);

	client = createWorkerLanguageClient(context, clientOptions);

	return activateClient(context, client);
}

export async function deactivate(): Promise<void> {
	if (client !== undefined) {
		await client.stop();
	}
}

function createWorkerLanguageClient(context: ExtensionContext, clientOptions: LanguageClientOptions) {
	// Create a worker. The worker main file implements the language server.
	const serverMain = Uri.joinPath(context.extensionUri, 'server/dist/browserServerMain.js');
	const worker = new Worker(serverMain.toString(true));

	// create the language server client to communicate with the server running in the worker
	return new LanguageClient('intelliskript', 'IntelliSkript', clientOptions, worker);
}

export async function activateClient(context: ExtensionContext, client: LanguageClient) {
	//if (context.extensionMode != ExtensionMode.Production) {
	//	//debugging
	//	setTimeout(function () {
	//		//sleep 5 sec to give the debugger time to start
	//	}, 5000);
	//}
	await client.start();

	//make the server able to read and list files
	const readFileListener = client.onRequest('custom/readFile', async (params: { uri: string }) => {
		const uri = Uri.parse(params.uri);
		const fileContent = await workspace.fs.readFile(uri);
		return Buffer.from(fileContent).toString('utf8');
	})
	const listFilesListener = client.onRequest('custom/listFiles', async (params: { folderUri: string }) => {
		const folderUri = Uri.parse(params.folderUri);
		const files = await workspace.findFiles(new RelativePattern(folderUri, '**/*'), '**/node_modules/**');
		return files.map(file => file.toString());
	})

	//this listener just sends the skript contents of an entire folder to the server
	const getDocumentsListener = client.onRequest('custom/getDocuments', async (params: { folderUri: string }) => {
		const folderUri = Uri.parse(params.folderUri);
		if (folderUri.scheme == intelliskriptScheme) {
			//just return all files
			let fileList: { uri: string, content: string }[] = [];
			for (const file of resourceFiles) {
				fileList.push({ uri: Uri.from({ scheme: intelliskriptScheme, path: resourceFolderString + '/' + file[0] }).toString(), content: file[1] });
			}
			return fileList;
		}
		const files = await workspace.findFiles(new RelativePattern(folderUri, '**/*.sk'));

		const decoder = new TextDecoder('utf-8');
		//read all files at once:
		return Promise.all(
			files.map(
				async file => ({
					uri: file.toString(),
					//convert bytes to string
					content: decoder.decode(await workspace.fs.readFile(file))
				})));
	})
	const extensionUri = extensions.getExtension('JohnHeikens.intelliskript')?.extensionUri;
	//for debugger
	if (extensionUri)
		client.onRequest('custom/getStartData', async (_params: {}) => {
			return {
				addonPath: Uri.from({ scheme: intelliskriptScheme, path: resourceFolderString }).toString()
			};
		})
	// Listen for active text editor changes
	window.onDidChangeActiveTextEditor(editor => {
		if (editor && editor.document) {
			client.sendNotification('custom/onDidChangeActiveTextEditor', { uri: editor.document.uri.toString() });
		}
	});
	context.subscriptions.push(readFileListener, listFilesListener, getDocumentsListener);
	//window.showInformationMessage('client finished loading');
	console.log('intelliskript is ready');

}