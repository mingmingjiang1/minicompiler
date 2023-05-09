// import { semanticEntry } from "./semantic";
// import path from "path";
// import { scan } from "./parser";
// import { cgenProgram } from "./gen/codegen";
// import { semanticCheck } from "./semantic/check";

// const fs = require("fs");

// function main() {
//   const targetFile = process.argv[2];
//   const rootDir = process.argv[3];
//   const data = fs.readFileSync(path.join(rootDir, targetFile));
//   const tokens = scan(data.toString());
//   const parser = semanticEntry();
//   const ast = parser.trace(tokens);
//   console.dir(ast, { depth: null });
//   if (ast) {
//     ast.transverse();
//     cgenProgram(ast, targetFile, rootDir);
//     semanticCheck(ast);
//   }
// }

// main(); 