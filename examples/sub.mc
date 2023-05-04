int main() {
  int x = test(1, 2, 6);
  print(x);
}

int test(int x, int y, int z) {
  return x + y - z + 1000;
}