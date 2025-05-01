import { PatternData } from '../../pattern/data/PatternData';
import { Scope } from '../../pattern/Scope';
import { PatternType } from '../../pattern/PatternType';
import { SkriptTypeState } from '../storage/type/SkriptTypeState';
import { SkriptContext } from '../validation/SkriptContext';
import { SkriptTypeSection } from './custom/SkriptTypeSection';
import { SkriptSection } from './skriptSection/SkriptSection';

export class SkriptLoopSection extends SkriptSection {
	constructor(parent: SkriptSection, context: SkriptContext) {
		super(parent, context);
		//const loopValueContext = context.push("loop ".length);
		const pattern = this.detectPatternsRecursively(context, [PatternType.expression]);
		let result = pattern.detectedPattern?.returnType;
		if (!result) {
			const unknownData = this.getTypeData('unknown');
			result = unknownData ? new SkriptTypeState(unknownData) : new SkriptTypeState();
		}
		this.scope = new Scope(parent.getScope());
		this.scope.addPattern(new PatternData("[the] loop-value", "(the )?loop-value", context.getLocation(), PatternType.expression, undefined, [], [], result));
	}

}