export enum TOKEN {
  TYPE,
  ID,
  NUM,
  KEYWORD,
  // '{',
  // '}',
  // LEFTPARENT,
  // RIGHTPARENT,
  // SEMICOLON,
  // COMMA,
  IF,
  ERROR,
  WHITE,
}
export const TOKENMAP = {
  [TOKEN.IF]: "IF",
  [TOKEN.ID]: "ID",
  [TOKEN.NUM]: "NUM",
  [TOKEN.ERROR]: "ERROR",
  [TOKEN.WHITE]: "WHITE",
  // [TOKEN.LEFTBIG]: "LEFTBIG",
  // [TOKEN.RIGHTBIG]: "RIGHTBIG",
  // [TOKEN.LEFTPARENT]: "LEFTPARENT",
  // [TOKEN.RIGHTPARENT]: "RIGHTPARENT",
  // [TOKEN.SEMICOLON]: "SEMICOLON",
  // [TOKEN.COMMA]: "COMMA",
  [TOKEN.KEYWORD]: "KEYWORD",
  [TOKEN.TYPE]: "TYPE",
};

export const TOKENMAP2: {
  [key: string]: TOKEN
} = {
  "IF": TOKEN.IF,
  "ID": TOKEN.ID,
  "NUM": TOKEN.NUM,
  "ERROR": TOKEN.ERROR,
  "WHITE": TOKEN.WHITE,
  // "LEFTBIG": TOKEN.LEFTBIG,
  // "RIGHTBIG": TOKEN.RIGHTBIG,
  // "LEFTPARENT": TOKEN.LEFTPARENT,
  // "RIGHTPARENT": TOKEN.RIGHTPARENT,
  // "SEMICOLON": TOKEN.SEMICOLON,
  // "COMMA": TOKEN.COMMA,
  "KEYWORD": TOKEN.KEYWORD,
  "TYPE": TOKEN.TYPE,
};

export interface ProductionType {
  lfh: string;
  rfh: string;
  ind: number;
}