//USEUNIT CommonMAIN

/***************************************************************
Name: CommonDDT
Description: Read Excel files from a shared location for Data Driven Testing (DDT) 
            @sheetName is the Excel sheet name which has to be read from shared location
Author: Kitt Random
Creation Date: 08/24/2021
***************************************************************/

function ddtCloseDriver() {
  if (!equal(DDT.CurrentDriver, null)) {
    DDT.CloseDriver(DDT.CurrentDriver.Name);
  }
}

function ddtSetSpreadsheet(fileName, sheetName) {
  CommonDDT.ddtCloseDriver();
  DDT.ExcelDriver(Project.Path + "Stores\\Files\\" + fileName, sheetName);
  Log.Checkpoint(
    "| File Set | - PATH: " + Project.Path + fileName + " TAB: " + sheetName,
  );
}

function ddtBeneficiaryInfo(selectRec) {
  // define spreadsheet file path/tab/row
  CommonDDT.ddtSetSpreadsheet("PaymentIDs.xlsx", "Finastra");

  // iterates through records
  while (!DDT.CurrentDriver.EOF()) {
    // gets a value from xlsx file and posts it to the log
    if (equal(DDT.CurrentDriver.Value(0), selectRec)) {
      // get and set trade variables
      Project.Variables.fgppPaymentId = DDT.CurrentDriver.Value(1);

      Log.Checkpoint(
        "| Payment Info Retrieved | MID - " +
          ProjectSuite.Variables.fgppPaymentId,
      );

      return Project.Variables.fgppPaymentId;
    }
    DDT.CurrentDriver.Next();
  }
}

function ddtRefreshFileData(fileName, sheetName) {
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
