import { Production } from ".";
import { success } from "../utils";
import {
  Add_Class,
  Assign_Class,
  Bool_Class,
  Branch_Class,
  Caller_Class,
  Cond_Class,
  Div_Class,
  Formal_Class,
  Function_Class,
  Indentifier_Class,
  Int_Contant_Class,
  Mul_Class,
  Params_Class,
  Return_Class,
  Sub_Class,
} from "./tree";

// 求first集合
function firstSet(lfh: string, rfhs: string[][]): any {
  for (const rfh of rfhs) {
    if (this.isTermainl(rfh[0])) {
      return rfh[0];
    } else {
      for (const char of rfh) {
        const res = this.firstSet(char, this.lfh2rfh.get(char));
        if (res) {
          return res;
        }
      }
    }
  }
}

// // 求follow集合
// function followSet(lfh: string, rfhs: string[][], arr:) {

//   // 1. 将$放入结果中
//   // 2. 对于当前lfh，寻找包含该lfh的所有其他产生shi，如果该产生shi作为其他产生shi的末尾，则当前lfh merge(followSet(该产生shi的lfh))；
//   // 3. 否则，对于当前lfh，寻找包含该lfh的所有其他产生shi，merge(firstSet(该产生shi的lfh的后面一位)，当然如果求得的结果为空，则继续followSet(该shi))
// }

function makechanging() {
  let length: Map<string, number>;
  let isChanging: boolean;
  function changing(d: Map<string, Set<string>>) {
    if (!length) {
      length = new Map<string, number>();
      for (const k of Object.keys(d)) {
        length.set(k, d.get(k).size);
      }
      return true;
    }
    isChanging = false;
    for (const k of Object.keys(d)) {
      isChanging = length.get(k) != d.get(k).size;
      length.set(k, d.get(k).size);
    }
    return isChanging;
  }

  return changing;
}

// function followSet(nts: Map<string, string[][]>, startsymbol: string) {
//   const follow: Map<string, Set<string>> = new Map([]);
//   for (const [name, rules] of Object.entries(nts)) {
//     follow.set(name, new Set());
//   }
//   if (startsymbol) {
//     // follow[startsymbol].add('$')
//   }

//   const changing = makechanging();

//   while (changing(follow)) {
//     for (const [name, rules] of Object.entries(nts)) {
//       // follow.set(name, new Set());
//       for (const rule of rules) {
//         trailer = deepcopy(follow[name]);

//       }
//     }
//   }

//   return follow
// }

// for i in range(len(rule) - 1, -1, -1):
// # 从右至左遍历产生式体中的符号
//     if rule[i][0] == '<': #“<>”括着的都是非终结符
//         follow[rule[i]] |= trailer
//         # 如果最里层 for 循环的首轮迭代就调用这一行的话，
//         # 它能起到上面第三点的作用

//         # 以下的 if-else 语句对应上面的第二点
//         # 到了下一轮迭代就可以改 FOLLOW 集了
//         if '""' in first[rule[i]]:
//             trailer |= first[rule[i]]
//             trailer.discard('""')
//         else:
//             trailer = deepcopy(first[rule[i]])
//     else: # 否则就只修改 trailer，不修改其他非终结符的 FOLLOW 集
//         trailer = deepcopy(first[rule[i]])

export const EMPTY = "ε";
// const firstSet = {};
// const processFirst = () => {
//   for (let nts of nonTermialSymbol) firstSet[nts] = new Set();
//   for (let nts of nonTermialSymbol) _processFirst(nts);
// };

// const { cloneDeep, isEqual } = require("lodash");
// const START = "S";
// const END = "$";
// const followSet = {};
let prevFollowSet = {};
// const processFollow = () => {
//   for (let nts of nonTermialSymbol) followSet[nts] = new Set();
//   followSet[START].add(END);
//   while (true) {
//     let flag = false;
//     for (let nts of nonTermialSymbol) {
//       _processFollow(nts);
//       if (isEqual(prevFollowSet, followSet)) flag = true;
//       else flag = false;
//       prevFollowSet = cloneDeep(followSet);
//     }
//     if (flag) break;
//   }
// };

export function switchCase(
  production: Production,
  key2production: {
    [key: number]: string;
  },
  yyvalsp: any[]
) {
  let res, tmp;
  success("本次规约动作: ", production.lfh + '->' + production.rfh);
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
      res = new Assign_Class(yyvalsp[2][2], yyvalsp[3][2], yyvalsp[0]);
      break;
    case key2production[13]:
      console.log("++++++", yyvalsp);
      res = new Add_Class(yyvalsp[2], yyvalsp[0]);
      break;
    case key2production[29]:
      res = new Sub_Class(yyvalsp[2], yyvalsp[0]);
      break;
    case key2production[30]:
      console.log("***********");
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
  }
  return res;
}
