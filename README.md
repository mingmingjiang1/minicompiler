
建议在linux上使用

## prerequste:
以下是Ubuntu20.04的命令
1. spim sudo-apt install spim
2. node: 需要14.0以上的版本
3. npm sudo-apt install npm

## How to run ?
1. 编译mc代码文件 => 汇编文件: ` npx mccompiler filename.mc ` 
2. 执行汇编文件: ` npx run filename.s ` 


minic语法：
1. 运算符：支持+-*/运算，支持逻辑运算，不支持运算符结合，如：(2 + 3) * 10
2. 类型：支持自然数(int类型)，布尔值以及void
3. 语句：支持函数调用，嵌套的if-else语句(嵌套的if-else语句)
4. 和C一样，必须要有main函数
5. 变量必须声明的时候同时赋值
6. 内置print函数

eg：
```c
int main() {
  int x = sum(2, 3);
  print(x);
}

int sum(int x, int y) {
  return x + y;
}
```





