//USEUNIT Logs
//USEUNIT Main

function firstTest_DeleteOldLogs() {
  Logs.verifyFiles_MHT();
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

function test() {
  var foundFiles, aFile;
  foundFiles = aqFileSystem.FindFiles(Project.Path + "LogMHT\\", "*.xml");
  if (foundFiles != null) {
    while (foundFiles.HasNext())
    {
      aFile = foundFiles.Next();
      Log.Message(aFile.Name);
    }
  }
  else {
    Log.Message("No files were found.");
  }
}