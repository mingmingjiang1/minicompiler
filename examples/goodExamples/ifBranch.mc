int main() {
  bool x = test(1);
  print(x); // 0
  print(test(10));
}

bool test(int x) {
  int z = 10;
  if(x == 1) {
    return x < 1;
  }
  return true;
}