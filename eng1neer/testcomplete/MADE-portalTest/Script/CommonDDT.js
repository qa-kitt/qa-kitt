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
  CommonDDT.ddtSetSpreadsheet("SGB_Beneficiaries.xlsx", "Beneficiaries");

  // iterates through records
  while (!DDT.CurrentDriver.EOF()) {
    // gets a value from xlsx file and posts it to the log
    if (equal(DDT.CurrentDriver.Value(0), selectRec)) {
      // get and set trade variables
      ProjectSuite.Variables.BeneficiaryAlias = DDT.CurrentDriver.Value(1);
      ProjectSuite.Variables.BeneficiaryBank = DDT.CurrentDriver.Value(2);
      ProjectSuite.Variables.BeneficiaryRN = DDT.CurrentDriver.Value(3);
      ProjectSuite.Variables.BeneficiaryBAN = DDT.CurrentDriver.Value(4);
      ProjectSuite.Variables.BeneficiaryBIC = DDT.CurrentDriver.Value(5);
      ProjectSuite.Variables.BeneficiaryAddress = DDT.CurrentDriver.Value(6);
      ProjectSuite.Variables.BeneficiaryCity = DDT.CurrentDriver.Value(7);
      ProjectSuite.Variables.BeneficiaryState = DDT.CurrentDriver.Value(8);
      ProjectSuite.Variables.BeneficiaryZip = DDT.CurrentDriver.Value(9);
      ProjectSuite.Variables.BeneficiaryCountry = DDT.CurrentDriver.Value(10);

      Log.Checkpoint(
        "| Beneficiary Info Retrieved | - " +
          ProjectSuite.Variables.ServiceType +
          " " +
          ProjectSuite.Variables.TransactionType,
      );

      return (
        ProjectSuite.Variables.BeneficiaryAlias,
        ProjectSuite.Variables.BeneficiaryBank,
        ProjectSuite.Variables.BeneficiaryRN,
        ProjectSuite.Variables.BeneficiaryBAN,
        ProjectSuite.Variables.BeneficiaryBIC,
        ProjectSuite.Variables.BeneficiaryAddress,
        ProjectSuite.Variables.BeneficiaryCity,
        ProjectSuite.Variables.BeneficiaryState,
        ProjectSuite.Variables.BeneficiaryZip,
        ProjectSuite.Variables.BeneficiaryCountry
      );
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
