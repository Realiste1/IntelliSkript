import { PatternType } from "../../pattern/PatternType";
import { TokenModifiers } from "../../TokenModifiers";
import { TokenTypes } from "../../TokenTypes";
import { SkriptContext } from "../validation/SkriptContext";
import { SkriptSection } from "./skriptSection/SkriptSection";

export class SkriptVariablesSection extends SkriptSection{
	processLine(context: SkriptContext): void {
		const parts = context.currentString.split(/ = /);
		context.addToken(TokenTypes.variable, 0, parts[0].length, TokenModifiers.definition);
		this.detectPatternsRecursively(context.push(context.currentString.length - parts[1].length), PatternType.expression);
	}
}