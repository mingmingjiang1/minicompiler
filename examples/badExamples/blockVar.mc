int main() {
  print(test1(27));
  print(test3(25));
  return 0;
}


int test1 (int x) {
  if (x == 10) {
    return 12;
  } else {
    int x = 10; // error: Cant't declare block variable
  }
  print(1);
  return x;
}

int test3 (int x) {
  if (x <= 2) {
    return 1;
  } else {
    return test3(x-1) + test3(x-2);
  }
  return 0;
}

void test3 (int x) {
  if (x <= 2) {
    return 1;
  } else {
    return test3(x-1) + test3(x-2);
  }
  return 0;
}
