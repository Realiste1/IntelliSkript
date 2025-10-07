import { URI, Utils } from 'vscode-uri';
//https://en.wikipedia.org/wiki/Uniform_Resource_Identifier#Syntax

export const URISeparator = '/';
export function addToPath(uri: string, add: string): string {
	return uri + URISeparator + add;
}

export function addToUri(uri: URI, add: string): URI {
	return Utils.joinPath(uri, add);
}


export function isRelativeURI(base: URI, child: URI): boolean {
	return child.path.startsWith(base.path);
}
/**
 * caution! no checking is done to see if this is a relative uri!
 * @param base the uri of a folder
 * @param child the uri of a file or folder within that folder
 * @returns a string containing the part of the uri without the base uri, without a slash at the start
 */
export function getRelativePathPart(base: URI, child: URI): string {

	return child.path.substring(child.path[base.path.length] == URISeparator ? base.path.length + URISeparator.length : base.path.length);
}