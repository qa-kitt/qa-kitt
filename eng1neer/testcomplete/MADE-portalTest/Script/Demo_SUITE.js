//USEUNIT CommonMAIN
//USEUNIT DemoMAIN

function firstTest_DeleteOldLogs() {
  CommonMAIN.verifyFiles_MHT();
}


function test_LogMessage1() {
  Log.Checkpoint("Test1");
}

function test_LogMessage2() {
  Log.Checkpoint("Test2");
}

function test_LogMessage3() {
  Log.Checkpoint("Test3");
}

function test_LogMessage4() {
  Log.Checkpoint("Test4");
}

function test_LogMessage5() {
  Log.Checkpoint("Test5");
}

