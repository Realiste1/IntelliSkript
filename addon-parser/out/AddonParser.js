"use strict";
//import * as SkriptJson from './Addon Json/WolvSK.json';
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddonParser = exports.fileJson = exports.SectionJson = exports.TypeJson = exports.FunctionJson = exports.ExpressionJson = exports.ModifierJson = exports.EventJson = exports.ConditionJson = exports.EffectJson = exports.PatternJson = exports.GeneralJson = exports.skriptFileHeader = exports.AddonSkFilesDirectory = exports.ServerAssetsDirectory = exports.ServerDirectory = void 0;
const fs = require("fs");
const path = require("path");
const Parser_1 = require("./Parser");
exports.ServerDirectory = path.join(Parser_1.RepoDirectory, 'server');
exports.ServerAssetsDirectory = path.join(exports.ServerDirectory, "assets");
exports.AddonSkFilesDirectory = path.join(exports.ServerAssetsDirectory, "addons");
exports.skriptFileHeader = "#AUTOMATICALLY GENERATED SKRIPT FILE\n#COPYRIGHT JOHN HEIKENS\n#https://github.com/JohnHeikens/IntelliSkript\n";
class GeneralJson {
    constructor() {
        this.name = "";
        this.id = "";
    }
}
exports.GeneralJson = GeneralJson;
class PatternJson extends GeneralJson {
    constructor() {
        super(...arguments);
        this.patterns = [];
    }
}
exports.PatternJson = PatternJson;
class EffectJson extends PatternJson {
}
exports.EffectJson = EffectJson;
class ConditionJson extends PatternJson {
}
exports.ConditionJson = ConditionJson;
class EventJson extends PatternJson {
    constructor() {
        super(...arguments);
        this.cancellable = false;
    }
}
exports.EventJson = EventJson;
class ModifierJson extends PatternJson {
    constructor() {
        super(...arguments);
        this["return type"] = "";
    }
}
exports.ModifierJson = ModifierJson;
class ExpressionJson extends ModifierJson {
}
exports.ExpressionJson = ExpressionJson;
class FunctionJson extends ModifierJson {
}
exports.FunctionJson = FunctionJson;
class TypeJson extends PatternJson {
}
exports.TypeJson = TypeJson;
class SectionJson extends PatternJson {
}
exports.SectionJson = SectionJson;
class fileJson {
}
exports.fileJson = fileJson;
class AddonParser extends Parser_1.Parser {
    //this function makes type names match better with the ones defined in the inheritance text file
    static normalizeName(name) {
        return name.toLowerCase().replace(' ', '');
    }
    static PatternToCall(pattern) {
        while (true) {
            //replace innermost braces
            const newPattern = pattern.replace(/\[[^\[\]]*\]/g, "");
            if (pattern == newPattern)
                break;
            pattern = newPattern;
        }
        ;
        pattern = pattern.replace(/\((.+?)\|.+?\)/g, "$1");
        pattern = pattern.split('|')[0];
        return pattern;
    }
    static parseFileJson(file) {
        var _b, _c, _d, _e, _f, _g, _h;
        function format(str) {
            //trim() removes \n too
            str = str.replace(/#/g, "");
            str = str.replace(/<br>/g, "\n"); //convert <br> to a new line
            str = str.replace(/\\n/g, "\n"); //convert \m to a new line
            str = str.replace(/\n/g, "\n#");
            return str;
        }
        function generalData(elem) {
            let str = "\n#" + elem.name + "\n";
            if (elem.description) {
                elem.description.forEach(line => {
                    if (line != "") {
                        str += "#" + format(line) + "\n";
                    }
                });
            }
            if (elem.since) {
                str += "#since ";
                str += elem.since.join(", ");
                str += "\n";
            }
            if (elem.examples != undefined) {
                str += "#Examples:\n";
                elem.examples.forEach(line => {
                    if (line != "") {
                        str += "#" + format(line) + "\n";
                    }
                });
            }
            if (elem["required plugins"] != undefined) {
                str += "#" + elem["required plugins"] + "\n";
            }
            return str;
        }
        function patterns(elem, noSpaces = false) {
            let str = "";
            str += "\tpatterns:\n";
            elem.patterns.forEach(line => {
                if (line != "") {
                    if (noSpaces) {
                        line = line.replace(/(?<!\[) | (?!\])/g, '[ ]');
                    }
                    str += "\t\t" + line + "\n";
                }
            });
            return str;
        }
        function defineType(elem, parents) {
            let str = "";
            str += generalData(elem);
            str += "type:\n";
            str += patterns(elem, true);
            if (parents)
                str += `\tinherits: ${parents}\n`;
            if (elem.usage) {
                const patterns = elem.usage.toLowerCase().split(",");
                if (patterns) {
                    let expressionString = "\n";
                    expressionString += 'expression:\n';
                    expressionString += "\treturn type: " + _a.PatternToCall(elem.patterns[0]) + "\n";
                    expressionString += "\tpatterns:\n";
                    for (const pattern of patterns) {
                        const invalidPatternRegex = /([^a-z \._])/g;
                        if (invalidPatternRegex.test(pattern))
                            //this was not meant as pattern list
                            return str;
                        expressionString += "\t\t" + pattern.trim() + "\n";
                    }
                    str += expressionString;
                }
            }
            return str;
        }
        let str = exports.skriptFileHeader;
        const toDefine = new Map();
        //define types at first as they are used in effects and other patterns
        (_b = file.types) === null || _b === void 0 ? void 0 : _b.forEach(type => {
            this.allTypes.set(type.name, type);
            const normalizedName = this.normalizeName(type.name);
            if (this.inheritanceByID.has(normalizedName)) {
                toDefine.set(normalizedName, type);
            }
            else {
                str += defineType(type);
            }
        });
        //deriving types
        this.inheritanceByID.forEach((parents, name) => {
            if (parents != 'predefined') {
                //types should be defined in order of dependency. so types that derive from something, will need to be defined after the other type.
                const type = toDefine.get(name);
                if (type)
                    str += defineType(type, parents);
                //else
                //	throw "type not found";
            }
        });
        (_c = file.sections) === null || _c === void 0 ? void 0 : _c.forEach(condition => {
            str += generalData(condition);
            str += "section:\n";
            str += patterns(condition);
        });
        (_d = file.effects) === null || _d === void 0 ? void 0 : _d.forEach(effect => {
            str += generalData(effect);
            str += "effect:\n";
            str += patterns(effect);
        });
        (_e = file.conditions) === null || _e === void 0 ? void 0 : _e.forEach(condition => {
            str += generalData(condition);
            str += "condition:\n";
            str += patterns(condition);
        });
        (_f = file.events) === null || _f === void 0 ? void 0 : _f.forEach(event => {
            str += generalData(event);
            str += "event \"" + event.id + "\":\n";
            str += patterns(event);
            if (event["event values"]) {
                str += "\tevent-values: ";
                //str += event["event values"].join(", ");
                event["event values"].forEach((line, index) => {
                    if (line != "") {
                        if (index > 0) {
                            str += ", ";
                        }
                        const eventValueParserRegExp = /(event-)?(.*)/;
                        const valueName = eventValueParserRegExp.exec(line);
                        if (valueName) {
                            str += valueName[2];
                        }
                    }
                });
                str += "\n";
            }
        });
        (_g = file.expressions) === null || _g === void 0 ? void 0 : _g.forEach(expression => {
            if (expression.name != "ExprCustomEventValue") {
                str += generalData(expression);
                str += "expression:\n";
                str += patterns(expression);
                if (expression.changers) {
                    expression.changers.forEach(changer => {
                        str += "\t" + (changer == "unknown" ? "get" : changer) + ":\n";
                        str += "#\t\t(internal code)\n";
                    });
                }
                const type = this.allTypes.get(expression["return type"]);
                str += "\treturn type: ";
                if (type)
                    str += this.PatternToCall(type.patterns[0]);
                else
                    str += this.normalizeName(expression["return type"]);
            }
        });
        (_h = file.functions) === null || _h === void 0 ? void 0 : _h.forEach(f => {
            str += generalData(f);
            str += "function " + f.patterns[0] + " :: " + f['return type'] + ":\n";
            str += "#\t(internal code)\n";
        });
        return str;
    }
    static ParseFile(file, contents) {
        const fileData = JSON.parse(contents);
        const parseResult = _a.parseFileJson(fileData);
        const inputFileName = file.substring(0, file.indexOf('.'));
        const outputFileName = inputFileName;
        const targetPath = path.join(exports.AddonSkFilesDirectory, outputFileName) + ".sk";
        fs.writeFileSync(targetPath, parseResult);
    }
    static ParseFiles() {
        if (!fs.existsSync(exports.AddonSkFilesDirectory)) {
            fs.mkdirSync(exports.AddonSkFilesDirectory, { recursive: true });
        }
        const text = fs.readFileSync(path.join(this.parserDirectory, "inheritance.txt"), "utf8").toLocaleLowerCase();
        for (const line of text.split('\n')) {
            const parts = line.trim().split('#')[0].split('->');
            if (parts.length > 1)
                this.inheritanceByID.set(this.normalizeName(parts[0]), parts[1]);
        }
        super.ParseFiles();
    }
}
exports.AddonParser = AddonParser;
_a = AddonParser;
AddonParser.idDirectory = path.join(_a.parserDirectory, "json");
AddonParser.inheritanceByID = new Map();
AddonParser.allTypes = new Map();
//import { readFile } from "fs/promises";
//async function readJsonFile(path) {
//	const file = await readFile(path, "utf8");
//	return JSON.parse(file);
//  }
//
//  readJsonFile("./package.json").then((data) => {
//	console.log(data);
//  });
//# sourceMappingURL=AddonParser.js.map