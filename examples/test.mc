int main() {
  int x = test(100);
  print(x);
}


int test(int y) {
  int x = 10;
  if (x + y >= 100) {
    return x + y * 2;
  } else {
    if (x + y >= 1000) {
      return x + 1000 / 2;
    } else {
      return x + 1;
    }
  }
}