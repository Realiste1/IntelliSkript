import { Parser } from './parser';
import path = require('path');

export class ResourceParser extends Parser {
	static override idDirectory: string = path.join(this.parserDirectory, 'files');
}