int main() {
  print(test(3)); // 1
  print(test(2)); // 0
  print(test2(10)); // 1
  print(test2(1)); // 0
  return 0;
}


bool test(int x) {
  return x != 2;
}

bool test2(int x) {
  return x > 2;
}