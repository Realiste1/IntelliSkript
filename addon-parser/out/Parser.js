"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.RepoDirectory = exports.currentDirectory = void 0;
const path = require("path");
const fs = require("fs");
exports.currentDirectory = __dirname; // out directory
exports.RepoDirectory = path.join(exports.currentDirectory, "../..");
class Parser {
    static ParseFile(file, contents) {
        throw "not implemented!";
    }
    static ParseFiles() {
        console.log("Parsing files in " + this.idDirectory);
        const files = fs.readdirSync(this.idDirectory, undefined);
        for (const file of files) {
            const completePath = path.join(this.idDirectory, file);
            const contents = fs.readFileSync(completePath, "utf8");
            this.ParseFile(file, contents);
        }
        ;
    }
}
exports.Parser = Parser;
Parser.parserDirectory = path.join(exports.RepoDirectory, "addon-parser");
//# sourceMappingURL=Parser.js.map