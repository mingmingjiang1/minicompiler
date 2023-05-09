%%
import { Int_Contant_Class, TreeNode, Function_Class, Add_Class, Formal_Class, Mutiply_Class, Indentifier_Class } from "./tree";
let yyval: TreeNode;
%%

// xxx -> xxx : {} | xxx: {}

%%
E -> P$ : {
  yyval = new Int_Contant_Class("constant")
};


P -> F:  {
  yyval = yyvalsp[0];
} | PF : {
  Root.append_funcs([yyvalsp[1], yyvalsp[0]] as any);
  break;
};

F -> TOKEN.TYPE TOKEN.ID ( O ) { B } : {
 yyval = new Function_Class(
              "function",
              yyvalsp[4],
              yyvalsp[1],
              yyvalsp[6]
    );
};

O -> TOKEN.TYPE TOKEN.ID : {
  yyval = new Formal_Class($0, $1);
} | O , TOKEN.TYPE TOKEN.ID : {
  yyval = [yyvalsp[3] as any, new Formal_Class(yyvalsp[0], yyvalsp[1])];
  break;
};

B -> TOKEN.TYPE TOKEN.ID = A ; | TOKEN.KEYWORD TOKEN.ID ; : {
  yyval = new Int_Contant_Class("constant")
};

A -> A + C : {
  yyval = new Add_Class("plus");
} | A * C : {
  yyval = new Mutiply_Class("plus");
} | C : {
  yyval = $0;
};

C -> TOKEN.ID : {
  yyval = new Indentifier_Class("identifier");
  break;
} | TOKEN.NUM : {
  yyval = new Int_Contant_Class("constant")
};
%%

	expression	: OBJECTID ASSIGN expression {
					$$ = assign($1, $3);
				}
				| expression '.' OBJECTID '(' expression_list1 ')' {
					$$ = dispatch($1, $3, $5);
				}
        switch (production.lfh + "->" + production.rfh) {
          // case ProductionEnummap[10]:
          //   const returnClass = new Return_Class("return");
          //   symStack.unshift(returnClass);
          //   break;
          // case ProductionEnummap[9]:
          //   console.log(matches[5].length, 7277);
          //   let tmp;
          //   if (matches?.[5]?.length) {
          //     tmp = [new Assign_Class("assign", "", "" as any), ...matches[5]];
          //   } else {
          //     tmp = [new Assign_Class("assign", "", "" as any), matches[5]];
          //   }
          //   symStack.unshift(tmp);
          //   break;
        }