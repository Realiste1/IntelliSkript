import { DiagnosticSeverity } from 'vscode-languageserver';
import { PatternData } from '../../../pattern/data/PatternData';
import { PatternTree } from '../../../pattern/PatternTree';
import { Scope } from '../../../pattern/Scope';
import { PatternType } from "../../../pattern/PatternType";
import { TokenTypes } from '../../../TokenTypes';
import { SkriptTypeState } from '../../storage/type/SkriptTypeState';
import { SkriptContext } from '../../validation/SkriptContext';
import { SkriptSection } from '../skriptSection/SkriptSection';
import { SkriptSectionGroup } from '../SkriptSectionGroup';
import { ReflectPatternSection } from './ReflectPatternSection';


const patternRegEx = /pattern(|s)/;
export class ReflectPatternContainerSection extends SkriptSection {
	static patternType = PatternType.expression;
	scope: Scope;
	returnType: SkriptTypeState = new SkriptTypeState();
	patterns: PatternData[] = [];
	/**
	 * used by expression and property section to parse the pattern and extract arguments
	 * @param context
	 * @returns the parsed pattern. it's not added yet!
	 */
	parsePattern(context: SkriptContext): PatternData | undefined {
		const pattern = PatternTree.parsePattern(context, this, (<typeof ReflectPatternContainerSection>this.constructor).patternType);
		if (pattern) {
			//we can still check if this.patterns.length == 0, because on the next line, the newpatterns from the parse result will be added to this.patterns
			pattern.returnType = this.returnType;
			if (this.patterns.length == 0) {
				let counter = 0;
				for (const argumentType of pattern.expressionArguments) {
					const argumentPosition = pattern.argumentPositions[counter];
					//increase before converting to text, so the first argument will be 'expr-1'
					counter++;
					context.parseResult.newPatterns.push([this, new PatternData("expr-" + counter, "expr-" + counter, argumentPosition, PatternType.expression, this, [], [], argumentType)]);
				}
			}
		}
		return pattern;
	}
	addPattern(context: SkriptContext): void {
		const pattern = this.parsePattern(context);
		if (pattern)
			context.parseResult.newPatterns.push([context.currentSkriptFile, pattern]);
	}

	createSection(context: SkriptContext): SkriptSection | undefined {
		//match whole string
		if (new RegExp(`^${patternRegEx.source}$`).test(context.currentString)) {
			context.addToken(TokenTypes.keyword);
			return new ReflectPatternSection(this, context);
		}
		else {
			//we don't recognise this pattern
			//context.addDiagnostic(0, context.currentString.length, "unknown section", DiagnosticSeverity.Hint, "IntelliSkript->Section->Unknown");
			return undefined;
		}
	}
	processLine(context: SkriptContext): void {
		//match start of string and with : and space
		const result = new RegExp(`^${patternRegEx.source}: `).exec(context.currentString)
		if (result) {
			context.addToken(TokenTypes.keyword, 0, result[0].length);
			this.addPattern(context.push(result[0].length));
		}
		else {
			context.addDiagnostic(0, context.currentString.length, 'expected patterns here', DiagnosticSeverity.Error);
		}
	}
	override getScope(): Scope | undefined {
		return this.scope;
	}
	override finish(context: SkriptContext) {
		for (const pattern of this.patterns)
			context.currentSkriptFile.addPattern(pattern);

		super.finish(context);
	}
	constructor(parent: SkriptSectionGroup, context?: SkriptContext) {
		super(parent, context);
		this.scope = new Scope(parent.getScope());
	}
}
