int test(int x, int x) { // error: Cant't declare x duplcated in params! 
  int x = 12;
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
  int z = test(false, 3);
}


