import { PatternData } from '../data/PatternData';
import { PatternTreeNode } from '../patternTreeNode/PatternTreeNode';
import { PatternType } from '../PatternType';
import { SkriptPatternCall } from '../SkriptPattern';
import { MatchResult } from './matchResult';
import { PatternMatch } from './PatternMatch';
/**stores how far this (sub)match is */
export interface MatchProgress {
	/**the pattern to match for.*/
	testPattern: SkriptPatternCall;
	/**the pattern type we're currently matching for */
	patternType: PatternType;
	/**the pattern found */
	result?: MatchResult;
	subMatches: PatternMatch[];

	/**the super match */
	parent?: MatchProgress;

	/**the node this submatch started checking at. is used to check against recursion. if we just started checking, we shouldn't check again.*/
	startNode: PatternTreeNode;
	/**the node this submatch is at currently. */
	currentNode: PatternTreeNode;
	/**the start of this submatch in charachters from the start of the full pattern string */
	start: number;
	/**the progression of the submatch in charachters from the start of the full pattern string */
	index: number;
	/**the amount of arguments (%'s without slashes in front of them) passed in the full pattern string */
	argumentIndex: number;
}
export function cloneMatches(matches: PatternMatch[]): PatternMatch[] {
	return matches.map((match: PatternMatch, index: number, array: PatternMatch[]): PatternMatch => {
		return new PatternMatch(match.start, match.end, match.matchedPattern, cloneMatches(match.children));
	})
}
export function cloneProgress(progress: MatchProgress): MatchProgress {
	return { ...progress, subMatches: cloneMatches(progress.subMatches), parent: progress.parent ? cloneProgress(progress.parent) : undefined }
}

//export function cloneProgress(toClone: MatchProgress): MatchProgress {
//    return {
//        currentNode: toClone.currentNode,
//        parent: toClone.parent? cloneProgress(toClone.parent) : undefined,
//        root: toClone.root,
//        foundPattern: toClone.foundPattern
//    };
//    //result.children = result.children?.map(cloneProgress);
//    //if (toClone.parent)
//    //    result.parent = cloneProgress(toClone.parent);
//    //return result;
//}