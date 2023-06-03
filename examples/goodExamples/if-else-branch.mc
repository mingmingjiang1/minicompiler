// 单一分支测试用例

int main() {
  int x = test(82);
  print(x); // 1200
  x = test(50);
  print(x); // 400
}

int test(int x) {
  int global = 100;
  if (x != 50) {
    return 200 + 50 * 20;
  } else {
    return 300 + global;
  }
  return 100;
}