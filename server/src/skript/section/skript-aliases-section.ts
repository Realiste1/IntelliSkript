import { TokenTypes } from "../../token-types";
import { SkriptContext } from "../validation/skript-context";
import { SkriptSection } from "./skript-section/skript-section";

export class SkriptAliasesSection extends SkriptSection {
	processLine(context: SkriptContext): void {
		const parts = context.currentString.split(/ = /);
		context.addToken(TokenTypes.pattern, 0, parts[0].length);
	}
}