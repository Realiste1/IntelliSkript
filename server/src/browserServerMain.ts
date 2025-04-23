/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
	BrowserMessageReader,
	BrowserMessageWriter,
	createConnection
} from 'vscode-languageserver/browser';
import { Server } from './server';
import * as IntelliSkriptConstants from './IntelliSkriptConstants';
import { Sleep } from './Thread';

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self);
const messageWriter = new BrowserMessageWriter(self);

const connection = createConnection(messageReader, messageWriter);

//works for the client only
//const myExtDir = vscode.extensions.getExtension ("JohnHeikens.IntelliSkript").extensionPath;
//if (IntelliSkriptConstants.IsDebugMode) {
//	Sleep(5000);//give the debugger time to start
//}
console.log("initializing");
/* from here on, all code is non-browser specific and could be shared with a regular extension */

//run server.ts
export let currentServer = new Server(connection);