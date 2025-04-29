//the standard token types
//https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide#standard-token-types-and-modifiers
export enum TokenTypes {
	namespace,
	class,
	comment,
	decorator,
	enum,
	enumMember,
	event,
	function,
	keyword,
	interface,
	label,
	macro,
	method,
	number,
	parameter,
	property,
	regexp,
	string,
	struct,
	type,
	typeParameter,
	variable,
	//custom types
	//skript patterns when defined
	pattern,
	//a permission for a command
	permission,
	effect,
	expression,
	condition,
	//the length of this enum
	length
}
