import { PatternTreeNode } from "./PatternTreeNode";

export class StringNode extends PatternTreeNode {
	patternKey?: string;

	constructor(patternKey?: string) {
		super();
		this.patternKey = patternKey;
	}
}