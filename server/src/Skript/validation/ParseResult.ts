import { Diagnostic } from 'vscode-languageserver/browser';
import { SkriptNestHierarchy } from '../../nesting/SkriptNestHierarchy';
import { PatternData } from '../../pattern/data/PatternData';
import { FrequencyMatrix } from '../../pattern/frequencyMatrix';
import { Scope } from '../../pattern/Scope';
import { SkriptPatternCall } from '../../pattern/SkriptPattern';
import { SkriptSection } from '../section/skriptSection/SkriptSection';
import { semanticTokenContainer, SemanticTokenLine } from '../section/UnOrderedSemanticTokensBuilder';

export class ParseResult {

	/**	diagnostics will be added to this list.
	 * normally it'll be collected to the currentSkriptFile, but sometimes we need to try something and see if it works.
	 * if it doesn't work, we don't add the diagnostics.
	*/

	diagnostics: Diagnostic[] = [];
	tokens: semanticTokenContainer;
	/**these sections are parsed. we use this for tab completions*/
	patternSections?: SkriptNestHierarchy;
	newSection?: SkriptSection;
	/**patterns parsed per hierarchy member */
	patternsParsed: [SkriptPatternCall, SkriptNestHierarchy][] = [];
	/**new patterns to add to which scope*/
	newPatterns: [Scope, PatternData][] = [];
	constructor(tokens: semanticTokenContainer = new SemanticTokenLine()) {
		this.tokens = tokens;
	}
	//frequency [from][to]
	frequencyMatrix = new FrequencyMatrix();
}