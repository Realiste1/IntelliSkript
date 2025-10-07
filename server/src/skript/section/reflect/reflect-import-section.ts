import { TokenModifiers } from '../../../token-modifiers';
import { TokenTypes } from '../../../token-types';
import { SkriptContext } from '../../validation/skript-context';
import { SkriptSection } from '../skript-section/skript-section';

//TODO: add support for options
export class ReflectImportSection extends SkriptSection {
	processLine(context: SkriptContext): void {
		const regex = /^((?:[a-z]+\.)(?:[A-Za-z0-9_]+\.)+)([a-zA-Z0-9_]+)(?:|\$([a-zA-Z0-9_]+))(?:| as (.*))$/; // /function ([a-zA-Z0-9]{1,})\(.*)\) :: (.*)/;
		const result = regex.exec(context.currentString);
		if (result == null) {
			context.addDiagnostic(0, context.currentString.length, "is this an import? (for example java.util.UUID fits here)");
		}
		else {
			let pos = 0;
			context.addToken(TokenTypes.namespace, pos, result[1].length, TokenModifiers.defaultLibrary);
			pos += result[1].length;
			context.addToken(TokenTypes.type, pos, result[2].length, TokenModifiers.defaultLibrary, ...(result[4] ?? result[5] ? [] : [TokenModifiers.declaration]));
			pos += result[2].length;
			if (result[3]) {
				pos += "$".length;
				context.addToken(TokenTypes.type, pos, result[3].length, ...(result[4] ? [] : [TokenModifiers.declaration]))
				pos += result[3].length;
			}
			if (result[4]) {
				context.addToken(TokenTypes.keyword, pos + " ".length, "as".length);
				context.addToken(TokenTypes.type, pos + " as ".length, result[4].length, TokenModifiers.declaration);
			}
		}
	}

	override createSection(context: SkriptContext): SkriptSection | undefined {
		context.addDiagnostic(0, context.currentString.length, "this is an import section");
		return undefined;
	}
}