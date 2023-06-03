int main() {
  int x = test(50); // 510
  print(x);
  print(test(90)); // 12
  print(test(91)); // 12
  print(test(10)); // 10
}


int test(int y) {
  int x = 10;
  if (x + y>= 100) {
    x = 12;
  } else {
    if (x + y > 50) {
      return x + 1000 / 2;
    }
  }
  return x;
}