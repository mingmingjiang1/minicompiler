int main() {
  bool x = test(1, 2);
  print(x); // -190
}

bool test(int x, int y) {
  int z = 10;
  if(x == 1) {
    int x = 11;
    return x < 1;
  } else {
    int x = 100;
    int y = 1000;
    return x > 2;
  }
}