// 测试数据

int main() {
  int m = multibranch(6, 5);
  print(m);
}

int multibranch(int x, int y) {
  print(x);
  print(y);
  if (x + y == 10) {
    int x = 2222;
    return x + y;
  } else {
    return 100;
  }
}

