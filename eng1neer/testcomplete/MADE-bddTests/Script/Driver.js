/***************************************************************
Name: Driver
Description: General DDT Driver functions
Author: Kitt Random
Creation Date: 11/14/2021
***************************************************************/

var RecNo;
// Posts data to the log (helper routine)
function ddtProcessData() {
  var Fldr, i;
  Fldr = Log.CreateFolder("Record: " + aqConvert.VarToStr(RecNo));
  Log.PushLogFolder(Fldr);

  for (i = 0; i < DDT.CurrentDriver.ColumnCount; i++) {
    Log.Message(
      DDT.CurrentDriver.ColumnName(i) +
        ": " +
        aqConvert.VarToStr(DDT.CurrentDriver.Value(i)),
    );
  }

  Log.PopLogFolder();
  RecNo = RecNo + 1;
}

// Creates, log, and closes the driver
function ddtTestDriver(sheetName) {
  var Driver;
  Driver = DDT.ExcelDriver(
    Project.Path + "Stores\\Files\\testRecordSet.xlsx",
    sheetName,
  );

  RecNo = 0;
  while (!Driver.EOF()) {
    ddtProcessData();
    Driver.Next();
  }

  Log.Checkpoint(ddtRowCount());
  DDT.CloseDriver(Driver.Name);
}

function ddtCloseDriver() {
  if (!equal(DDT.CurrentDriver, null)) {
    DDT.CloseDriver(DDT.CurrentDriver.Name);
  }
}

function ddtRowCount() {
  var count = DDT.CurrentDriver.ColumnCount;
  for (var i = 0; i < count; i++) {
    var column = DDT.CurrentDriver.ColumnName(i);
  }
  return i;
}

function ddtRefreshDriver(fileName, sheetName) {
  if (!equal(DDT.CurrentDriver, null)) {
    DDT.CloseDriver(DDT.CurrentDriver.Name);
    Log.Message("LOG: closed excel DDT driver from dataExcel event");
  }

  if (
    equal(
      aqFileSystem.Exists(Project.Path + "\\Stores\\Files\\" + fileName),
      true,
    )
  ) {
    aqFileSystem.DeleteFile(Project.Path + "\\Stores\\Files\\" + fileName);
    Log.Message("LOG: file deleted before execution");
  }

  var path = Project.Path + "\\Stores\\Files\\" + fileName;
  aqFile.Copy(path, Project.Path + "\\Stores\\Files\\" + fileName, false);
  var filePath = DDT.ExcelDriver(
    Project.Path + "\\Stores\\Files\\" + fileName,
    sheetName,
  );
}
