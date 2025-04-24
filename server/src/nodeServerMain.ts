/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import {
	createConnection
} from 'vscode-languageserver/node';
import { startServer } from './server';

const connection = createConnection();

//run server.ts
startServer(connection);