import { PatternTreeNode } from '../patternTreeNode/PatternTreeNode';
import { SkriptPatternCall } from '../SkriptPattern';
import { PatternMatch } from './PatternMatch';

/**contains the full match and submatches */
export class MatchResult {
    patternCall: SkriptPatternCall;
    fullMatch: PatternMatch;
	nodesPassed: PatternTreeNode[] = [];
    constructor(patternCall: SkriptPatternCall, fullMatch: PatternMatch) {
        this.patternCall = patternCall;
        this.fullMatch = fullMatch;
    }
}