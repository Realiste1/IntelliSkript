import { Diagnostic } from 'vscode-languageserver/browser';
import { semanticTokenContainer, SemanticTokenLine } from '../section/UnOrderedSemanticTokensBuilder';
import { SkriptNestHierarchy } from '../../nesting/SkriptNestHierarchy';
import { SkriptSection } from '../section/skriptSection/SkriptSection';
import { PatternData } from '../../pattern/data/PatternData';
import { SkriptPatternCall } from '../../pattern/SkriptPattern';

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
	/**new patterns to add to which sections*/
	newPatterns: [SkriptSection, PatternData][] = [];
	constructor(tokens: semanticTokenContainer = new SemanticTokenLine()) {
		this.tokens = tokens;
	}
}