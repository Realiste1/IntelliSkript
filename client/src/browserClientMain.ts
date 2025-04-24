/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { ExtensionContext, Uri } from 'vscode';
import { BaseLanguageClient, LanguageClientOptions } from 'vscode-languageclient';

import { LanguageClient } from 'vscode-languageclient/browser';
import { startClient } from './client';
// this method is called when vs code is activated
export async function activate(context: ExtensionContext) {
	/*
	 * all except the code to create the language client is not browser specific
	 * and could be shared with a regular (Node) extension
	 */

	return startClient(createLanguageClient, context);
}



function createLanguageClient(context: ExtensionContext, clientOptions: LanguageClientOptions): BaseLanguageClient {
	// Create a worker. The worker main file implements the language server.
	const serverMain = Uri.joinPath(context.extensionUri, 'server/dist/browserServerMain.js');
	const worker = new Worker(serverMain.toString(true));

	// create the language server client to communicate with the server running in the worker
	return new LanguageClient('intelliskript', 'IntelliSkript', clientOptions, worker);
}
