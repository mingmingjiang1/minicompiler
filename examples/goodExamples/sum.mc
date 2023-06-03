int main() {
  print(add(add(total(10), 3), add(total(10), 3))); // 116
  return 0;
}


int add(int x, int y) {
  return x + y;
}

int total(int x) {
  if (x == 0) {
    return x;
  } else {
    return x + total(x - 1);
  }
  return 900;
}