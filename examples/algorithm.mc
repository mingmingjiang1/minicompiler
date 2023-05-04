int main() {
  // 得到的
  int y = test2();
  int x = test1();
  int m = test3();
  int n = test4();
  print(y);
  print(x);
  print(m);
  print(n);
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