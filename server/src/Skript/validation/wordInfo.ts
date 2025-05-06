import { Range } from 'vscode-languageserver/browser';
import { PatternData } from '../../pattern/data/PatternData';
import { SkriptVariable } from '../storage/SkriptVariable';

export interface WordInfo {
	wordRange?: Range;
	//result: wordLookupResult;
	variable?: SkriptVariable;
	pattern?: PatternData;
}