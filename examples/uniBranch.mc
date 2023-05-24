int main() {
  // print(test(77)); // 11
  // print(test(11)); // 10

  // print(test1(77)); // 33
  // print(test1(11)); // -11

  // print(test2(77)); // 1011
  // print(test2(81)); // 1011 xxxxxx 110
  // print(test2(65)); // 1011
  // print(test2(12)); // 10

  // print(test3(77)); // 77 + 11 + 10 = 98
  // print(test3(91)); // 1000 + 22 = 1022
  // print(test3(7)); // 10 + 22 = 32

  // print(test4(72)); // 0
  // print(test4(175)); // 
  // print(test4(34));
  // print(test4(1));
  // print(test4(27));
  print(test5(91));
  // print(test5(97));
  return 0;
}


// int test(int x) {
//   int y = 22;
//   // 单一if
//   if (x > 50) {
//     int x = 11;
//     return x;
//   }
//   return 10;
// }


// int test1(int x) {
//   int y = 22;
//   // 普通成对if-else
//   if (x > 50) {
//     int x = 11;
//     return x + y;
//   } else {
//     return x - y;
//   }
//   return 10;
// }

// int test2(int x) {
//   int y = 22;
//   // 嵌套成对if-else
//   if (x > 50) {
//     int x = 11;
//     if (x > 80) {
//       int x = 100;
//       int z = 10;
//       return x + z;
//     }
//     return x + 1000;
//   }
//   return 10;
// }


// int test3(int x) {
//   int y = 22;
//   // 嵌套成对if-else
//   if (x > 50) {
//     int yyy = 11;
//     if (x > 80) {
//       x = 1000;
//     } else {
//       int m = 10;
//       return yyy + m + x;
//     }
//   } else {
//     x = 10;
//   }
//   return x + y;
// }


int test5(int x) {
  // 嵌套成对if-else
  if (x > 50) {
    int mm = 11; // step-1: 1
  } else {
    if (x > 10) {
      int z1 = 10; // 2
      x = 19;
    } else {
      int xx = 21;
    }
  }
  if (x > 51) {
    int mm1 = 21; // step-2: 2
    print(x);
  } else {
    if (x > 13) {
      print(x);
      int z = 10; // step-3: 2
      x = 12;
    } else {
      print(x);
      int y = 21; // step-4: 2
    }
  }
  return x;
}


// int test5(int x) {
//   int y = 22;
//   // 嵌套成对if-else
//   if (x > 50) {
//     int x = 11;
//     return x;
//     if (x > 10) {
//       int z = 10;
//     } else {
//       int m = 10;
//     }
//   } else {
//     int x = 10;
//     if (x > 10) {
//       int z = 10;
//     }
//   }
//   return 10;
// }