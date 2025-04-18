import path = require('path');
import { AddonParser } from './AddonParser';
import { idParser } from './idParser';
import { RepoDirectory } from './Parser';
import * as fs from 'fs';
import { ResourceParser } from './resourceParser';

let totalString = AddonParser.ParseFiles();
totalString += idParser.ParseFiles();
totalString += ResourceParser.ParseFiles();
const targetPath = path.join(RepoDirectory, "client", "src", "assets", "resourceFiles.ts");
fs.writeFileSync(targetPath, `export let resourceFiles: Map<string, string> = new Map(([${totalString}] as [string, string][])     // ← assert as tuple-array
	  .sort((a, b) => a[0].localeCompare(b[0])));`);