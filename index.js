const { semanticEntry } = require("./dist/semantic");
const path = require("path");
const { scan } = require("./dist/parser");
const { cgenProgram } = require("./dist/gen/codegen");
const { semanticCheck } = require("./dist/semantic/check");
const fs = require("fs");


function main() {
  const targetFile = process.argv[2];
  const rootDir = process.argv[3];
  const data = fs.readFileSync(path.join(rootDir, targetFile));
  const tokens = scan(data.toString());
  const parser = semanticEntry();
  const ast = parser.trace(tokens);
  console.dir(ast, { depth: null });
  if (ast) {
    ast.transverse();
    semanticCheck(ast);
    cgenProgram(ast, targetFile, rootDir);
  }
}

main();