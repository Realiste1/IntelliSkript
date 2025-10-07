import { SkriptContext } from '../../validation/skript-context';
import { SkriptSection } from '../skript-section/skript-section';
import { ReflectPatternContainerSection } from './reflect-pattern-container-section';

export class ReflectPatternSection extends SkriptSection {

	//highLightHierarchically (context: SkriptContext, Hierarchy: SkriptNestHierarchy) : void {
	//	for(let i = 0; i < Hierarchy.children.length; i++) {
	//		const child = Hierarchy.children[i];
	//		if (child.character == '%')
	//		{
	//			context.addToken(TokenTypes.type, child.start, child.end - child.start);
	//		}
	//		else {
	//			this.highLightHierarchically(context, child);
	//		}
	//	}
	//}

	override processLine(context: SkriptContext): void {
		(this.parent as ReflectPatternContainerSection).addPattern(context);
	}
}