function assertEquals(actual, expected) {
  if (actual === expected) {
    console.log('SUCCESS!!! ${testname}: PASSED');
  } else {
    console.error('erm... ${testName}: FAILED - expected "${expected}" but got "${actual}"');
  }
}

function assertLeq(firstVal, secondVal) {
  if (firstVal <= secondVal) {
    console.log('SUCCESS!!! ${testname}: PASSED');
  } else {
    console.error('erm... ${testName}: FAILED - expected "${firstVal}" to be leq to "${secondVal}"');
  }
}

function testDawudSecondSleepBeforeFajr() {
  assertLeq(calculateDawudSecondSleep("19:00", "05:00"), "05:00");
}

function runTests() {
  testDawudSecondSleepBeforeFajr();
}

runTests();