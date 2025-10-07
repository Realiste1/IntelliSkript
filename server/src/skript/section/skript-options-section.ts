import { TokenModifiers } from '../../token-modifiers';
import { TokenTypes } from '../../token-types';
import { SkriptOption } from '../storage/skript-option';
import { SkriptContext } from '../validation/skript-context';
import { SkriptSection } from './skript-section/skript-section';
export class SkriptOptionsSection extends SkriptSection {
	processLine(context: SkriptContext): void {
		const colonIndex = context.currentString.indexOf(": ");
		if (colonIndex == -1) {
			context.addDiagnostic(0, context.currentString.length, "this is not an option")
		} else {
			const optionName = context.currentString.substring(0, colonIndex);
			const optionValue = context.currentString.substring(colonIndex).trim();
			context.currentSkriptFile?.options.push(new SkriptOption(optionName, optionValue));
			context.addToken(TokenTypes.variable, 0, colonIndex, TokenModifiers.readonly, TokenModifiers.static, TokenModifiers.definition)
		}
	}
}