//USEUNIT Main
//USEUNIT Sql

/***************************************************************
Name: Data
Description: Stage test data file from database 
Author: Kitt Random
Creation Date: 09/16/2021
***************************************************************/

// SAVE DATA TO EXCEL
// reads data from the recordset and save it to the test log
function sqlRefreshTestFileData(varQuery, varSheet, varCol) {
  // DEBUG: Log.Message("SQL Query: " + varQuery);
  var AConnection, result;
  var excelFile = Excel.Open(
    Project.Path + "Stores\\Files\\testRecordSet.xlsx",
  );
  var excelSheet = excelFile.SheetByTitle(varSheet);

  AConnection = ADO.CreateConnection();
  AConnection.ConnectionString =
    "Provider=SQLNCLI11;" +
    "Server=tcp:" +
    Project.Variables.dboServerURL +
    Project.Variables.sgbEnvironment +
    ".database.windows.net;" +
    "Database=sqldb-" +
    Project.Variables.varDbName +
    "-" +
    Project.Variables.sgbEnvironment +
    ";" +
    "Uid=" +
    Project.Variables.dboUser +
    ";" +
    "Pwd=" +
    Project.Variables.dboPassQA.DecryptedValue +
    ";";
  //Log.Message(AConnection.ConnectionString);
  AConnection.Open();
  var Rs = ADO.CreateRecordset();
  Rs.Open(AConnection.Execute(varQuery));
  // Log.AppendFolder("SQL Record Set");
  Rs.MoveFirst();
  while (!Rs.EOF) {
    for (var row = 1; row <= Rs.RecordCount; row++) {
      Log.Message(varCol + "," + row + " | VALUE: " + Rs.Fields.Item(0).Value);
      excelSheet.Cell(varCol, row + 1).Value = Rs.Fields.Item(0).Value;
      Rs.MoveNext();
    }
  }
  excelFile.Save();
  Rs.Close();
  AConnection.Close();
}

function sqlSetDefaultProfileLimits() {
  // set database source
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.Environment,
  );
  ProjectSuite.Variables.ProfileUserApprovalReq = false;

  // set profile service limits - default = $80,000DL | $8,000TL
  Connections.sqlQueryNone(
    "UPDATE [ProfileService] SET [ServiceTransactionLimit] = 8000.00000, " +
      "[ServiceDailyLimit] = 80000.00000, [Enabled] = 1 WHERE [ProfileId] IN (SELECT [ProfileId] " +
      "FROM [Profile] WHERE [Name] = '" +
      Project.Variables.sgbCurrentProfile +
      "')",
  );

  // set profile account service limits - default = $800DL | $80TL
  Connections.sqlQueryNone(
    "UPDATE [ProfileEntitlement] SET [TransactionLimit] = 80.00000, " +
      "[DailyLimit] = 800.00000, [Enabled] = 1 WHERE [ChangedBy] != 'entitlements_sa' AND [ProfileSubServiceId] " +
      "IN (SELECT [ProfileSubServiceId] FROM [ProfileSubService] WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] " +
      "FROM [ProfileService] WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] " +
      "WHERE [Name] = '" +
      Project.Variables.sgbCurrentProfile +
      "')))",
  );

  // set profile user service limits - default = $800DL | $80TL
  Connections.sqlQueryNone(
    "UPDATE [ProfileUserEntitlement] SET [TransactionLimit] = 80.00000, " +
      "[DailyLimit] = 800.00000, [Enabled] = 1, [ApprovalsRequired] = 0 WHERE [ChangedBy] != 'entitlements_sa' " +
      "AND [ProfileEntitlementId] IN (SELECT [ProfileEntitlementId] FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] " +
      "IN (SELECT [ProfileSubServiceId] FROM [ProfileSubService] WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] " +
      "FROM [ProfileService] WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] " +
      "WHERE [Name] = '" +
      Project.Variables.sgbCurrentProfile +
      "'))))",
  );

  // set profile subscription service limits - default = $800DL | $80TL
  Connections.sqlQueryNone(
    "UPDATE [ProfileSubscriptionEntitlement] SET [TransactionLimit] = 80.00000, " +
      "[DailyLimit] = 800.00000, [Enabled] = 1 WHERE [ProfileEntitlementId] IN (SELECT [ProfileEntitlementId] " +
      "FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] IN (SELECT [ProfileSubServiceId]	FROM [ProfileSubService] " +
      "WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] FROM [ProfileService] WHERE [ProfileId] IN (SELECT " +
      "[ProfileId] FROM [Profile] WHERE [Name] = '" +
      Project.Variables.sgbCurrentProfile +
      "'))))",
  );
}

function sqlEnableAutoQuoting() {
  Connections.sqlDatabaseHandler(
    "sqldb-fx-" + Project.Variables.sgbEnvironment,
  );
  Connections.sqlQueryNone(
    "UPDATE [FXSetting] SET [PortalQuoteSettingEnum] = 4",
  );
  Log.Checkpoint("| Auto Quoting Enabled |");
}

function sqlEnableTradeExecution() {
  Connections.sqlDatabaseHandler(
    "sqldb-fx-" + Project.Variables.sgbEnvironment,
  );
  Connections.sqlQueryNone(
    "UPDATE [FXSetting] SET [PortalTradeExecutionSettingEnum] = 1",
  );
  Log.Checkpoint("| Trade Execution Enabled |");
}

function sqlEnableConnectionPermissions() {
  // add new and edit existing = 3
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  Connections.sqlQueryNone(
    "UPDATE [ProfileUser] SET [ProfileConnectionPermissionEnum] = 3" +
      " WHERE [ProfileId] = " +
      ProjectSuite.Variables.ProfileId,
  );
  Log.Checkpoint("| Profile Connection Permisssions Enabled |");
}

function sqlSetAutoQuoting(set) {
  Connections.sqlDatabaseHandler(
    "sqldb-fx-" + Project.Variables.sgbEnvironment,
  );
  Connections.sqlQueryNone(
    "UPDATE [FXSetting] SET [PortalQuoteSettingEnum] = " + set,
  );
  Log.Checkpoint("| Auto Quoting Configured | " + set);
}

function sqlSetTradeExecution(set) {
  Connections.sqlDatabaseHandler(
    "sqldb-fx-" + Project.Variables.sgbEnvironment,
  );
  Connections.sqlQueryNone(
    "UPDATE [FXSetting] SET [PortalTradeExecutionSettingEnum] = " + set,
  );
  Log.Checkpoint("| Trade Execution Configured | " + set);
}

function sqlSetUserConnectionPermission(set) {
  // none = 0; add new = 1; edit existing = 2; add new and edit existing = 3
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  Connections.sqlQueryNone(
    "UPDATE [ProfileUser] SET [ProfileConnectionPermissionEnum] = " +
      set +
      " WHERE [ProfileUserId] = " +
      ProjectSuite.Variables.ProfileUserId,
  );
  Log.Checkpoint("| Profile User Connection Permisssion Configured | " + set);
}

function sqlClearTestApprovals() {
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  Connections.sqlQueryNone(
    "DELETE FROM [PortalApprovalQueueItem] WHERE [SubmittedBy] IN (SELECT [OKTAId] FROM [dbo].[User] " +
      "WHERE [FirstName] = '" +
      ProjectSuite.Variables.ProfileUserFirst +
      "' AND [LastName] LIKE 'User %')",
  );
  Connections.sqlQueryNone(
    "DELETE FROM [BackOfficeApprovalQueueItem] WHERE [SubmittedBy] IN (SELECT [OKTAId] FROM [dbo].[User] " +
      "WHERE [FirstName] = '" +
      ProjectSuite.Variables.ProfileUserFirst +
      "' AND [LastName] LIKE 'User %')",
  );
  Log.Checkpoint(
    "| Approval Queues Cleared | Portal & Back Office - TestComplete Users",
  );
}

function sqlGetOktaId() {
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  ProjectSuite.Variables.ProfileUserOkta = Connections.sqlQueryOne(
    "SELECT [OKTAId] FROM [dbo].[User] WHERE [FirstName] = '" +
      ProjectSuite.Variables.ProfileUserFirst +
      "' AND [LastName] = '" +
      ProjectSuite.Variables.ProfileUserLast +
      "'",
  );
  Log.Checkpoint(
    "| Okta Test Ids Obtained | - " + ProjectSuite.Variables.ProfileUserOkta,
  );
}

function sqlGetProfileLimit() {
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  ProjectSuite.Variables.ProfileLimitDaily = Connections.sqlQueryOne(
    "SELECT CAST([DailyLimit] AS DECIMAL(18, 2)) " +
      "FROM [ProfileEntitlement] WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId +
      " " +
      "AND [ProfileSubServiceId] = " +
      ProjectSuite.Variables.ProfileSubServiceId,
  );
  ProjectSuite.Variables.ProfileLimitTrans = Connections.sqlQueryOne(
    "SELECT CAST([DailyLimit] AS DECIMAL(18, 2)) " +
      "FROM [ProfileEntitlement] WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId +
      " " +
      "AND [ProfileSubServiceId] = " +
      ProjectSuite.Variables.ProfileSubServiceId,
  );
  Log.Checkpoint(
    "| Profile User Limit Logged | - " +
      Project.Variables.sgbCurrentProfile +
      " Daily Limit: $" +
      ProjectSuite.Variables.ProfileLimitDaily +
      " Transaction Limit: $" +
      ProjectSuite.Variables.ProfileLimitTrans,
  );
}

function sqlGetUserLimit() {
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  ProjectSuite.Variables.limitDaily = Connections.sqlQueryOne(
    "SELECT CAST([DailyLimit] AS DECIMAL(18, 2)) " +
      "FROM [ProfileUserEntitlement] WHERE [ProfileAccountUserId] = " +
      ProjectSuite.Variables.ProfileAccountUserId +
      " AND [ProfileEntitlementId] = " +
      ProjectSuite.Variables.ProfileEntitlementId,
  );
  ProjectSuite.Variables.limitTransaction = Connections.sqlQueryOne(
    "SELECT CAST([TransactionLimit] AS DECIMAL(18, 2)) " +
      "FROM [ProfileUserEntitlement] WHERE [ProfileAccountUserId] = " +
      ProjectSuite.Variables.ProfileAccountUserId +
      " AND [ProfileEntitlementId] = " +
      ProjectSuite.Variables.ProfileEntitlementId,
  );
  Log.Checkpoint(
    "| Profile User Limit Logged | - " +
      ProjectSuite.Variables.ActiveUserType +
      " Daily Limit: $" +
      ProjectSuite.Variables.limitDaily +
      " Transaction Limit: $" +
      ProjectSuite.Variables.limitTransaction,
  );
}

function sqlGetUserConnectionPermission() {
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  ProjectSuite.Variables.ProfileUserConnectionEnum = Connections.sqlQueryNone(
    "SELECT [ProfileConnectionPermissionEnum] FROM [ProfileUser] " +
      " WHERE [ProfileUserId] = " +
      ProjectSuite.Variables.ProfileUserId,
  );
  Log.Checkpoint(
    "| Profile User Connection Permisssion Configured | - " +
      ProjectSuite.Variables.ProfileUserConnectionEnum,
  );
}

function sqlIfProfileExists(name) {
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  var bool = Connections.sqlQueryBool(
    "SELECT COUNT([Name]) FROM [Profile] WHERE [Name] = '" + name + "'",
  );
  switch (bool) {
    case 0:
      Log.Checkpoint("| Profile Does Not Exist |");
      break;
    case 1:
      Log.Message("| Profile Exists | - Try Again");
      break;
  }
  return bool;
}

function sqlGetProfileAccountInfo() {
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  var acctId = Connections.sqlQueryArray(
    "SELECT [ProfileAccountId] FROM [ProfileAccount] WHERE [ProfileId] IN " +
      "(SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      Project.Variables.sgbCurrentProfile +
      "')",
  );
  var acctIds = aqString.Trim(acctId, aqString.stLeading);
  Log.Message("LOG: acctIds - " + acctIds);
  return acctIds;
}

function sqlGetProfileEntitlementInfo(id) {
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  var subEntitlements = Connections.sqlQueryArray(
    "SELECT [ProfileEntitlementId] FROM [ProfileEntitlement] " +
      "WHERE [ProfileSubServiceId] IN (SELECT [ProfileSubServiceId] FROM [ProfileSubService] " +
      "WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] FROM [ProfileService] " +
      "WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      Project.Variables.sgbCurrentProfile +
      "') " +
      "AND [ServiceId] IN (1, 2, 4)) AND [SubServiceId] IN ('1', '2', '5')) AND [ProfileAccountId] = '" +
      aqString.Replace(id, ", ", "', '") +
      "'",
  );
  return aqString.Trim(subEntitlements, aqString.stLeading);
}

function sqlCleanOrphanedTestProfiles() {
  var x = Project.Variables.sgbNewSubAlias;
  Connections.sqlDatabaseHandler(
    "sqldb-entitlements-" + Project.Variables.sgbEnvironment,
  );
  Connections.sqlQueryNone(
    "BEGIN /*1*/ DELETE FROM [ProfileEntitlement] WHERE [ProfileAccountId] IN (SELECT [ProfileAccountId] FROM [ProfileAccount] " +
      "WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      x +
      "' AND [ActivationDate] IS NULL AND [Enabled] = 0)); " +
      "/*2*/ DELETE FROM [ProfileAccount] WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      x +
      "' AND [ActivationDate] IS NULL AND [Enabled] = 0); " +
      "/*3*/ DELETE FROM [ProfileSubService] WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] FROM [ProfileService] WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] " +
      "WHERE [Name] = '" +
      x +
      "' AND [ActivationDate] IS NULL AND [Enabled] = 0)); /*4*/ DELETE FROM [ProfileService] WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] " +
      "WHERE [Name] = '" +
      x +
      "' AND [ActivationDate] IS NULL AND [Enabled] = 0); /*5*/ DELETE FROM [Profile] WHERE [Name] = '" +
      x +
      "' AND [ActivationDate] IS NULL AND [Enabled] = 0; END",
  );
  Log.Checkpoint("| Unorphaned Profile/Accounts Deleted | ");
}
