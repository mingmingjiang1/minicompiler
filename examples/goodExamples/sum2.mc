int total(int x) {
  if (x == 0) {
    return x;
  } else {
    int m = total(x - 1);
    return x + m;
  }
}

int sum(int x, int y) {
  return x + y;
}


int main() {
  int x = total(10);
  print(x); // 55
}