int main() {
  // 得到的
  int y = arithmetic2();
  int x = arithmetic1();
  int m = arithmetic3();
  int n = arithmetic4();
  print(y); // 13
  print(x); // 8
  print(m); // 15
  print(n); // 3
  print(arithmetic5()); // -99
  print(arithmetic6()); // 87
  return y;
}

int arithmetic1() {
  return 2 + 2 * 3;
}

int arithmetic2() {
  return 2 + 2 * 3 + 5;
}

int arithmetic3() {
  return 2 * 2 + 3 + 8;
}

int arithmetic4() {
  return 2 / 2 * 3;
}

int arithmetic5() {
  return 2 / 2 * 3 - (2 + 100);
}

int arithmetic6() {
  return ((10 - 1) * 10) - (10/ (4 - 1));
}