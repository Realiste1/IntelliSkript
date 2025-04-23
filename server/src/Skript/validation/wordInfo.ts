import { Range } from 'vscode-languageserver/browser';
import { SkriptVariable } from '../storage/SkriptVariable';
import { PatternData } from '../../pattern/data/PatternData';

export interface WordInfo {
	wordRange?: Range;
	//result: wordLookupResult;
	variable?: SkriptVariable;
	pattern?: PatternData;
}