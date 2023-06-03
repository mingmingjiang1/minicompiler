int main() {
  int y = 100;
  int x = 72 + 24 + 45 + y;
  print(test5(x+y, 20)); // 3954
  print(test5(1, 200)); // 77
  print(test5(40, 2000)); // 1253
  print(test5(89, 700)); // 3902
  print(test5(89, 0)); // 3902
  return 0;
}


int test5(int x, int y) {
  if (x > 10) {
    x = x + 12;
    if (x > 100) {
        x = x + 100; // 453
        if (x > 300) {
          x = x + 500; // 953
        } else {
          x = x + 700; // 225
        }
        x = x + 2000; // 2953
    } else {
      x = x + 200; // 225
    }
    x = x + 1001; // 3954
    // common2
  } else  {
    x = x + 76; // 
  }

  if (y > 10) {
    y = y + 12;
    if (y > 1000) {
        y = y + 1000; // 453
        if (y > 3000) {
          y = y + 5000; // 453
        } else {
          y = y + 7000; // 225
        }
        y = y + 2000;
    } else {
      y = y + 20; // 225
    }
    // common2
  }
  // common1
  return x;
}
