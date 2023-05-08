// 测试数据

int main() {
  int m = multibranch(6, 5);
  print(m); // 100
}

int multibranch(int x, int y) {
  print(x); // 6
  print(y); // 5
  if (x + y == 10) {
    int x = 2222;
    return x + y;
  } else {
    return 100;
  }
}

