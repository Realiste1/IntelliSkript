import { Range } from 'vscode-languageserver/browser';
import { PatternData } from '../../pattern/data/pattern-data';
import { SkriptVariable } from '../storage/skript-variable';

export interface WordInfo {
	wordRange?: Range;
	//result: wordLookupResult;
	variable?: SkriptVariable;
	pattern?: PatternData;
}