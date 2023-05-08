int test(int x, int y) {
  print(x); // 9
  int z = x * y;
  int m = x / y;
  int x = x + y;
  print(x); // 12
  print(z); // 27
  print(m); // 3
  return z;
// // 你好
}
int main() {
  int z= test(9, 3);
  print(z); // 27
}


