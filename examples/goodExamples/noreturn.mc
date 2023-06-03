int main() {
  print(test(26)); // 200
  print(test1(27)); //240
  test(void1());
  return 0;
}

int void1() {
  bool isgood = false; // 如果是true，or false需要把它转为数字
  return 12;
}

int test(int x) {
  int y = 22;
  if (x > 50) {
    return x;
  } else {
    if (x < 25) {
      return y;
    } else {
      return 200;
    }
    return x;
  }
  return y + x;
}

int test1 (int x) {
  int m = 20;
  x = x - 1;
  x = (x - 2) * 10; // 240
  int y = (20 + 33 + 444 - 34) * x; // 111120
  int z = (20 + 33 + 444 - 34) * 22; // 10186
  print(y);
  print(z);
  return x;
}