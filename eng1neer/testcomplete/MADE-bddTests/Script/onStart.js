//UESUNIT Data
//USEUNIT Main
//USEUNIT Sql

/***************************************************************
Name: onLog
Description: General onStart event controls
Author: Kitt Random
Creation Date: 11/20/2022
***************************************************************/

function EventControls_OnStartTest(Sender) {
  //  Sql.sqlRefreshFromFile("entitlements");
  //  refreshTestData_Profile();
  //  refreshTestData_Account();
  //  refreshTestData_User();
  //  refreshTestData_Service();
  //  refreshTestData_SubService();
  //  Main.verifyFiles_MHT();
}

// refreshTestData required parameters (query, sheetName, colName)
function refreshTestData_Profile() {
  Project.Variables.varDbName = "entitlements";
  Data.sqlRefreshTestFileData(
    "SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      Project.Variables.sgbProfile +
      "'",
    "Profile",
    "A",
  );
  Data.sqlRefreshTestFileData(
    "SELECT [Name] FROM [Profile] WHERE [Name] = '" +
      Project.Variables.sgbProfile +
      "'",
    "Profile",
    "B",
  );
  Data.sqlRefreshTestFileData(
    "SELECT [BebId] FROM [Profile] WHERE [Name] = '" +
      Project.Variables.sgbProfile +
      "'",
    "Profile",
    "C",
  );
}

function refreshTestData_SubService() {
  Project.Variables.varDbName = "entitlements";
  Data.sqlRefreshTestFileData(
    "SELECT [SubServiceId] FROM [SubService] WHERE [Enabled] = 1",
    "SubService",
    "A",
  );
  Data.sqlRefreshTestFileData(
    "SELECT [Name] FROM [SubService] WHERE [Enabled] = 1",
    "SubService",
    "B",
  );
  Data.sqlRefreshTestFileData(
    "SELECT [ProfileSubServiceId] FROM [ProfileSubService] WHERE [ProfileServiceId] IN " +
      "(SELECT [ProfileServiceId] FROM [ProfileService] WHERE [ProfileId] IN " +
      "(SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      Project.Variables.sgbProfile +
      "') " +
      "AND [Enabled] = 1)",
    "SubService",
    "C",
  );
}

// refreshTestData_...() required data (db.Column, xlsx.Cell)
function refreshTestData_User() {
  Project.Variables.varDbName = "entitlements";
  let i,
    j = 0;
  let column = [
    "u.[UserId]",
    "u.[OKTAId]",
    "u.[FirstName]",
    "u.[LastName]",
    "pu.[ProfileUserId]",
  ];
  let cell = ["A", "B", "C", "D", "E"];

  for (i = 0; i < column.length; i++) {
    while (i < cell.length) {
      Data.sqlRefreshTestFileData(
        "SELECT " +
          column[j] +
          " FROM [User] u JOIN [ProfileUser] pu ON u.[UserId] = pu.[UserId] " +
          "WHERE pu.[ProfileId] IN (SELECT [ProfileId] From [Profile] WHERE [Name] = '" +
          Project.Variables.sgbProfile +
          "') " +
          "ORDER BY u.[UserId]",
        "User",
        cell[j],
      );
      (i++, j++);
    }
  }
}

function refreshTestData_Account() {
  Project.Variables.varDbName = "entitlements";
  let i,
    j = 0;
  let column = [
    "pa.[AccountId]",
    "pa.[Alias]",
    "pa.[ProfileAccountId]",
    "le.[RmNumber]",
    "a.[AccountNumber]",
    "a.[LegalEntityId]",
    "a.[AccountTypeId]",
    "CAST(a.[Enabled] AS VARCHAR(1))",
    "CAST(a.[SENEnabled] AS VARCHAR(1))",
    "atp.[Name]",
    "atp.[ApplicationCode]",
    "atp.[ProductCode]",
    "atp.[CurrencyEnum]",
  ];
  let cell = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];

  for (i = 0; i < column.length; i++) {
    while (i < cell.length) {
      Data.sqlRefreshTestFileData(
        "SELECT " +
          column[j] +
          " FROM [ProfileAccount] pa JOIN [Account] a ON pa.[AccountId] = a.[AccountId] " +
          "JOIN [AccountType] atp ON a.[AccountTypeId] = atp.[AccountTypeId] JOIN [LegalEntity] le ON a.[LegalEntityId] = le.[LegalEntityId] " +
          "WHERE pa.[ProfileId] IN (SELECT [ProfileId] From [Profile] WHERE [Name] = '" +
          Project.Variables.sgbProfile +
          "') " +
          "ORDER BY pa.[AccountId]",
        "Account",
        cell[j],
      );
      (i++, j++);
    }
  }
}

function refreshTestData_Service() {
  Project.Variables.varDbName = "entitlements";
  let i,
    j = 0;
  let column = [
    "ps.[ProfileServiceId]",
    "ps.[ServiceId]",
    "s.[Name]",
    "ps.[ServiceTransactionLimit]",
    "ps.[ServiceDailyLimit]",
  ];
  let cell = ["A", "B", "C", "D", "E"];

  for (i = 0; i < column.length; i++) {
    while (i < cell.length) {
      Data.sqlRefreshTestFileData(
        "SELECT " +
          column[j] +
          " FROM [ProfileService] ps JOIN [Service] s ON ps.[ServiceId] = s.[ServiceId] " +
          "WHERE ps.ProfileId IN (SELECT [ProfileId] From [Profile] WHERE [Name] = 'TestComplete Automation')",
        "Service",
        cell[j],
      );
      (i++, j++);
    }
  }
}
