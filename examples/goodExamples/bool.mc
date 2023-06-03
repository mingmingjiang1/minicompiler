int main() {
  print(test()); // 0
  print(bool1(true, 4));
  return 0;
}


bool test() {
  bool isgood = false; // 如果是true，or false需要把它转为数字
  return isgood;
}

int bool1(bool x, int y) {
  return y;
}