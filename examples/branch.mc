int main() {
  int x = test(82);
  print(x);
}

int test(int x) {
  int global = 100;
  if (x > 50) {
    int z = 20;
    return 200 + 50 * 20;
  } else {
    int x = 200;
    return 300;
  }
}