int test(int x, int y) {
  print(x); // 9
  int z = x * y;
  int m = x / y;
  int mm = x + y;
  print(mm); // 12
  print(z); // 27
  print(m); // 3
  return z;
// // 你好
}
int main() {
  int z = test(false, 3); // error: There is no suitable 
  // function signature for test, check the function name, parameter type, and return type 
  // because 1st arg of function test is int, not bool
}


