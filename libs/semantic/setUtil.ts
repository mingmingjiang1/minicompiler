import { Production } from ".";
import {
  Add_Class,
  Assign_Class,
  Bool_Class,
  Branch_Class,
  Caller_Class,
  Cond_Class,
  Declare_Class,
  Div_Class,
  Formal_Class,
  Function_Class,
  Indentifier_Class,
  Int_Contant_Class,
  Mul_Class,
  Return_Class,
  Sub_Class,
} from "./tree";

export const EMPTY = "ε";

export function switchCase(
  production: Production,
  key2production: {
    [key: number]: string;
  },
  yyvalsp: any[]
) {
  let res, tmp;
  // success("本次规约动作: ", production.lfh + '->' + production.rfh);
  switch (production.lfh + "->" + production.rfh.join(" ")) {
    case key2production[0]:
      // todo
      break;
    case key2production[1]:
      res = yyvalsp[0];
      break;
    case key2production[2]:
      tmp = yyvalsp[1];
      while (tmp.next) {
        tmp = tmp.next;
      }
      tmp.next = yyvalsp[0];
      res = yyvalsp[1];
      break;
    case key2production[3]:
      res = new Function_Class(
        yyvalsp?.[5]?.[2],
        yyvalsp?.[4]?.[2],
        yyvalsp[2],
        yyvalsp[0]
      );
      break;
    case key2production[4]:
      res = new Formal_Class(yyvalsp[0][2], yyvalsp[1][2]);
      break;
    case key2production[5]:
      res = new Formal_Class(yyvalsp[0][2], yyvalsp[1][2], yyvalsp[3]);
      break;

    case key2production[6]:
      res = yyvalsp[0];
      break;
    case key2production[7]:
      res = yyvalsp[0];
      break;
    case key2production[8]:
      res = yyvalsp[0];
      break;
    case key2production[9]:
      res = yyvalsp[0];
      break;
    case key2production[10]:
      res = yyvalsp[0];
      break;

    case key2production[11]:
      res = new Return_Class(yyvalsp[0]);
      break;
    case key2production[12]:
      res = new Declare_Class(yyvalsp[2][2], yyvalsp[3][2], yyvalsp[0]);
      break;
    case key2production[13]:
      res = new Add_Class(yyvalsp[2], yyvalsp[0]);
      break;
    case key2production[29]:
      res = new Sub_Class(yyvalsp[2], yyvalsp[0]);
      break;
    case key2production[30]:
      res = new Mul_Class(yyvalsp[2], yyvalsp[0]);
      break;
    case key2production[31]:
      res = new Div_Class(yyvalsp[2], yyvalsp[0]);
      break;
    case key2production[14]:
      res = yyvalsp[0];
      break;
    case key2production[15]:
      res = new Indentifier_Class(yyvalsp[0][2]);
      break;
    case key2production[16]:
      res = new Int_Contant_Class(yyvalsp[0][2]);
      break;
    case key2production[17]:
      res = new Cond_Class(yyvalsp[2], yyvalsp[1][2], yyvalsp[0]);
      break;
    case key2production[18]:
      res = new Caller_Class(yyvalsp[2][2]);
      break;
    case key2production[19]:
      res = new Caller_Class(yyvalsp[3][2], yyvalsp[1]);
      break;
    case key2production[20]:
      tmp = yyvalsp[2];
      while (tmp.next) {
        tmp = tmp.next;
      }
      tmp.next = yyvalsp[0];
      res = yyvalsp[2];
      break;
    case key2production[21]:
      res = yyvalsp[0];
      break;
    case key2production[22]:
      res = yyvalsp[0];
      break;
    case key2production[23]:
      res = yyvalsp[1];
      break;
    case key2production[24]:
      res = new Branch_Class(yyvalsp[4], yyvalsp[2], yyvalsp[0]);
      break;
    case key2production[25]:
      res = new Function_Class(
        yyvalsp[4][2],
        yyvalsp[3][2],
        undefined,
        yyvalsp[0]
      );
      break;
    case key2production[26]: //  statements复数
      tmp = yyvalsp[1];
      while (tmp.next) {
        tmp = tmp.next;
      }
      tmp.next = yyvalsp[0];
      res = yyvalsp[1];
      break;
    case key2production[27]:
      res = yyvalsp[0];
      break;
    case key2production[28]:
      res = yyvalsp[1];
      break;
    case key2production[32]:
      res = new Bool_Class(yyvalsp[0][2]);
      break;
    case key2production[33]:
      res = yyvalsp[0];
      break;
    case key2production[34]:
      res = new Assign_Class(new Indentifier_Class(yyvalsp[2][2]), yyvalsp[0]);
      break;
    case key2production[35]:
      res = yyvalsp[1];
      break;
    case key2production[36]:
      res = yyvalsp[0];
      break;
    case key2production[37]:
      res = new Branch_Class(yyvalsp[2], yyvalsp[0]);
      break;
  }
  return res;
}
