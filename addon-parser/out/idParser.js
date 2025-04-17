"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.idParser = void 0;
const path = require("path");
const fs = require("fs");
const Parser_1 = require("./Parser");
const AddonParser_1 = require("./AddonParser");
class idParser extends Parser_1.Parser {
    static ParseFile(file, contents) {
        const inputFileName = file.substring(0, file.indexOf('.'));
        let outputFileString = AddonParser_1.skriptFileHeader;
        outputFileString += "expression:\n";
        outputFileString += "\treturn type: " + inputFileName + "type\n";
        outputFileString += "\tpatterns:\n";
        const vowels = "aeiou";
        for (const line of contents.split('\n')) {
            const trimmedLine = line.trim();
            const prefix = vowels.includes(trimmedLine.substring(0, 1)) ? "[an] " : "[a] ";
            outputFileString += "\t\t" + prefix + trimmedLine + "\n";
        }
        const outputFileName = "zzz (postload) - IntelliSkript " + inputFileName.substring(0, 1).toUpperCase() + inputFileName.substring(1);
        const targetPath = path.join(AddonParser_1.AddonSkFilesDirectory, outputFileName) + ".sk";
        fs.writeFileSync(targetPath, outputFileString);
    }
}
exports.idParser = idParser;
_a = idParser;
idParser.idDirectory = path.join(_a.parserDirectory, "ids");
//# sourceMappingURL=idParser.js.map