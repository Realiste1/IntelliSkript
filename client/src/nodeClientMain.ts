import { ExtensionContext, Uri } from 'vscode';
import { startClient } from './client';
import { BaseLanguageClient, LanguageClientOptions } from 'vscode-languageclient';
import { LanguageClient, ServerOptions, TransportKind } from 'vscode-languageclient/node';

export async function activate(context: ExtensionContext) {
	return startClient(createLanguageClient, context);
}

function createLanguageClient(context: ExtensionContext, clientOptions: LanguageClientOptions): BaseLanguageClient {

	const serverModule = Uri.joinPath(context.extensionUri, 'server', 'dist', 'nodeServerMain.js').fsPath;
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc, options: { cwd: process.cwd() } },
		debug: { module: serverModule, transport: TransportKind.ipc, options: { cwd: process.cwd() } }
	};
	// create the language server client to communicate with the server running in the worker
	return new LanguageClient('IntelliSkript', serverOptions, clientOptions);
}