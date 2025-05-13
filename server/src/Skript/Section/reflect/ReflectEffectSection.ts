import { DiagnosticSeverity } from 'vscode-languageserver/browser';
import { PatternType } from '../../../pattern/PatternType';
import { TokenTypes } from '../../../TokenTypes';
import type { SkriptContext } from '../../validation/SkriptContext';
import {
	SkriptSection
} from "../skriptSection/SkriptSection";
import { ReflectPatternContainerSection } from './ReflectPatternContainerSection';

export class ReflectEffectSection extends ReflectPatternContainerSection {
	static patternType = PatternType.effect;
	createSection(context: SkriptContext): SkriptSection | undefined {
		const regex = /^(usable in|parse|trigger)$/;
		const result = regex.exec(context.currentString);

		if (result) {
			context.addToken(TokenTypes.keyword, 0, context.currentString.length);
			return new SkriptSection(this, context);
		}
		else return super.createSection(context);
	}
	processLine(context: SkriptContext): void {
		context.addDiagnostic(0, context.currentString.length, "make sure to put your code for the effect in triggers", DiagnosticSeverity.Error, "IntelliSkript->Section->Wrong");
	}

}