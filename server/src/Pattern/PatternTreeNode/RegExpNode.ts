import { PatternTreeNode } from "./PatternTreeNode";

export class RegExpNode extends PatternTreeNode{
	regExp : RegExp;
	constructor(regExp: RegExp){
		super();
		this.regExp = regExp;
	}
}