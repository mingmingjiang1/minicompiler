int main() {
  print(test(1)); // 1
  return 0;
}


int test(int x) {
  if (x > 2) {
    int x = 10;
    return 333;
  } else {
      int x = 100;
     if (x > 2) {
      int x = 10;
      return 111;
    } else {
      int x = 100;
      return 22;
    }
  }
  return x;
}