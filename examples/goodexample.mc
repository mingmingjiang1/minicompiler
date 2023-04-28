int total(int x) {
  if (x == 124) {
    return x;
  } else {
    int m = total(x + 1 + 10 + 10 + 10);
    return x + m;
  }
}

int sum(int x, int y) {
  return x + y;
}

int main() {
  int x = total(0);
  int y = sum(10, 100);
  print(y);
  print(x);
}