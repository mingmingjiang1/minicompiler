# minicompiler

<center class="half"> 
  <img align="left" 		src="https://img.shields.io/github/actions/workflow/status/mingmingjiang1/minicompiler/node.js.yml" /> 
  <img align="left"  src="https://img.shields.io/badge/language-node.js-brightgreen" />    
  <img align="left" src="https://img.shields.io/badge/category-learning-yellowgreen"/>
  <img src="https://img.shields.io/badge/blog-emoer-orange" align="left" /> 
</center>

<br/>

<br/>

> *This is a simple compiler named minicompiler  implemented in node js that include parser, syntax analysis and assembly code generation.*



💡： *Recommended for running on linux*



## Prerequste:

1. spim:  `sudo apt install spim`
2. *node: support at least version 14.0.0*
3. npm: `npm sudo apt install npm`




## How to run ?
1. *Create file named  `*.mc`  and execute*  ` npx mccompiler *.mc `  
2. *Run assembly file:*  ` npx run *.s ` 
3. *Install the syntax highlighting plugin：Vscode plugin Marketplace search minic and install*



## **minic syntax：**

1. *Operator: Support  `+-*/` operation, support logical operation, also support operator combination, such as:  `(2 + 3) * 10`*
2. *Type: Supports natural numbers (int), boolean, and void*
3. *Statements: Support function calls, nested if-else statements*
4. *Like C, you must have main function* 
5. *Assign values to variables when they must be declared*
6. *Built-in Print function*
7. *Each path of a function must have a return value*
7. *Also support condition expression, like `return x > 10`*



## **Examples**

*example 1:*

```c
int main() {
  int x = sum(2, 3);
  print(x);
}

int sum(int x, int y) {
  return x + y;
}

```



*example 2:*

```c
int main() {
  int y = test2();
  int x = test1();
  int m = test3();
  int n = test4();
  print(y); // 13
  print(x); // 8
  print(m); // 15
  print(n); // 3
  return y;
}

int test1() {
  return 2 + 2 * 3;
}

int test2() {
  return 2 + 2 * 3 + 5;
}

int test3() {
  return 2 * 2 + 3 + 8;
}

int test4() {
  return 2 / 2 * 3;
}
```

*example 3:*

```c
int total(int x) {
  if (x == 0) {
    return x;
  } else {
    int m = total(x - 1);
    return x + m;
  }
}

int sum(int x, int y) {
  return x + y;
}


int main() {
  int x = total(10);
  print(x); // 55
}
```

*example 4:*

```c
int main() {
  print(test(3)); // 1
  return 0;
}


bool test(int x) {
  return x != 2;
}

bool test2(int x) {
  return x > 2;
}
```



> 💗：*The author has limited energy and there may be many inadequacies in consideration. If there are any bugs, please contact the author in a timely manner. For the sake of simplicity, the code style of this implementation is not very good.*





