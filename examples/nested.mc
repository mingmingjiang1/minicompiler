int main() {
  int x = test(1, 2);
  print(x);
}

int test(int x, int y) {
  int z = 10;
  if(x == 1) {
    int x = 11;
    return x - 1;
  } else {
    int x = 100;
    int y = 1000;
    return y - x;
  }
}