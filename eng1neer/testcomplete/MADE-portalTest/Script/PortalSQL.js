//USEUNIT BackOfficeMAIN
//USEUNIT BackOfficeSQL
//USEUNIT CommonSQL
//USEUNIT PortalMAIN

/***************************************************************
Name: PortalSQL
Description: Backend database calls - SSMS
Author: Kitt Random
Creation Date: 09/16/2021
***************************************************************/

function sqlVerifyProfileServices() {
  // set service type and database source
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );

  // check profile's enabled services
  var count = PortalSQL.sqlGetEnabledServices(
    ProjectSuite.Variables.ServiceType,
  );
  Log.Message("LOG: " + count);
  if (!equal(ProjectSuite.Variables.DynamicVarInt, 1)) {
    PortalSQL.sqlEnableProfileServices();
  } else {
    Log.Checkpoint(
      "| " +
        ProjectSuite.Variables.DynamicVarInt +
        " Service(s) Enabled | - " +
        ProjectSuite.Variables.ServiceType,
    );
    PortalSQL.sqlServiceStatus(ProjectSuite.Variables.ServiceType, "1"); // verify profile's enabled service
  }
}

function sqlGetEnabledServices() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var dataset = CommonSQL.sqlQueryArray(
    "SELECT s.[Name] FROM [Service] s " +
      "INNER JOIN [ProfileService] ps ON ps.[ServiceId] = s.[ServiceId] " +
      "WHERE ps.[ProfileId] = '" +
      ProjectSuite.Variables.ProfileId +
      "' AND s.[Enabled] = 1 AND s.Name = '" +
      ProjectSuite.Variables.ServiceType +
      "'",
  );
  return dataset;
}

function sqlGetTradeExecutionData(column) {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-fx-" + aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var dataset = CommonSQL.sqlQueryOne(
    "SELECT [" +
      column +
      "] FROM [TradeExecution] WHERE [SierraTradeId] = '" +
      Project.Variables.fxTradeNumber +
      "'",
  );
  return dataset;
}

function sqlGetRandomTradeId() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-fx-" + aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var dataset = CommonSQL.sqlQueryOne(
    "SELECT ISNULL((SELECT TOP 1 [SierraTradeId] FROM [TradeExecution] WHERE [ChangedBy] = '" +
      ProjectSuite.Variables.ProfileUserOkta +
      "' AND CAST([DateReceived] AS DATE) >= CAST(GETDATE() - 6 AS DATE) ORDER BY NEWID()), 0)",
  ); // past 7 days
  if (equal(dataset, 0)) {
    dataset = CommonSQL.sqlQueryOne(
      "SELECT ISNULL((SELECT TOP 1 [SierraTradeId] FROM [TradeExecution] " +
        "WHERE CAST([DateReceived] AS DATE) >= CAST(GETDATE() - 6 AS DATE) ORDER BY NEWID()), 0)",
    );
  }
  return dataset;
}

function sqlGetRandomPaymentId() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-payments-" + aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var dataset = CommonSQL.sqlQueryOne(
    "SELECT ISNULL((SELECT TOP 1 [FinastraPaymentId] FROM [Payment] WHERE [SubmittedById] = '" +
      ProjectSuite.Variables.ProfileUserOkta +
      "' AND CAST([SubmittedDate] AS DATE) >= CAST(GETDATE() - 6 AS DATE) " +
      "AND [FinastraPaymentId] IS NOT NULL ORDER BY NEWID()), 0)",
  ); // past 7 days
  if (equal(dataset, 0)) {
    dataset = CommonSQL.sqlQueryOne(
      "SELECT ISNULL((SELECT TOP 1 [FinastraPaymentId] FROM [Payment] " +
        "WHERE CAST([SubmittedDate] AS DATE) >= CAST(GETDATE() - 6 AS DATE) ORDER BY NEWID()), 0)",
    );
  }
  return dataset;
}

function sqlGetProfileAccountInfo() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var acctNames = CommonSQL.sqlQueryArray(
    "SELECT [Alias] FROM [ProfileAccount] WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] " +
      "WHERE [Name] = '" +
      ProjectSuite.Variables.ProfileName +
      "')",
  );
  var acctList = aqString.Trim(acctNames, aqString.stLeading);
  Log.Message("LOG: acctIds - " + acctList);
  return acctList;
}

function sqlSetUserLimit(type, amount) {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileUserEntitlement] SET [" +
      type +
      "Limit] = " +
      amount +
      "000 " +
      "WHERE [ProfileEntitlementId] = " +
      ProjectSuite.Variables.ProfileEntitlementId +
      " " +
      "AND [ProfileAccountUserId] = " +
      ProjectSuite.Variables.ProfileAccountUserId,
  );
  Log.Checkpoint(
    "| Profile User Trade Execution Transaction Limit Updated | - " +
      ProjectSuite.Variables.ActiveUserType +
      ": $" +
      amount +
      " limit",
  );
}

function sqlSetUserPermissions(enable) {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileUserEntitlement] SET [Enabled] = " +
      enable +
      " " +
      "WHERE [ProfileAccountUserId] = " +
      ProjectSuite.Variables.ProfileAccountUserId +
      " " +
      "AND [ProfileEntitlementId] = " +
      ProjectSuite.Variables.ProfileEntitlementId,
  );
  Log.Checkpoint(
    "| Profile User Permissions Updated | - " +
      ProjectSuite.Variables.ActiveUserType,
  );
}

function sqlSetUserApprovalPermissions(approval) {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileUserEntitlement] SET [ApprovalsRequired] = " +
      approval +
      " " +
      "WHERE [ProfileAccountUserId] = " +
      ProjectSuite.Variables.ProfileAccountUserId,
  );
  if (equal(approval, 1)) {
    ProjectSuite.Variables.ProfileUserApprovalReq = true;
  }
  Log.Checkpoint(
    "| Profile User Approval Permissions Updated | - " +
      ProjectSuite.Variables.ActiveUserType +
      " Approval = " +
      ProjectSuite.Variables.ProfileUserApprovalReq,
  );
}

function sqlSetProfileLimit(type, amount) {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileEntitlement] SET [" +
      type +
      "Limit] = " +
      amount +
      "000 " +
      "WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId +
      " " +
      "AND [ProfileSubServiceId] = " +
      ProjectSuite.Variables.ProfileSubServiceId,
  );
  Log.Checkpoint(
    "| Profile User Trade Execution Transaction Limit Updated | - " +
      ProjectSuite.Variables.ActiveUserType +
      ": $" +
      amount +
      " limit",
  );
}

function sqlSetProfilePermissions(bool) {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileEntitlement] SET [Enabled] = " +
      bool +
      " " +
      "WHERE [ProfileSubServiceId] = " +
      ProjectSuite.Variables.ProfileSubServiceId,
  );
  Log.Checkpoint(
    "| Profile Account Permissions Updated | - " +
      ProjectSuite.Variables.ProfileName,
  );
}

function sqlServiceStatus(serviceType, bool) {
  // define array variable
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var dataSet = [];
  var compQuery =
    "SELECT s.[Name] FROM [Service] s " +
    "INNER JOIN [ProfileService] ps ON ps.[ServiceId] = s.[ServiceId] " +
    "WHERE ps.[ProfileId] = '" +
    ProjectSuite.Variables.ProfileId +
    "' AND s.[Enabled] = " +
    bool +
    " AND s.[Name] = '" +
    serviceType +
    "'";

  // create a connection object
  AConnection = ADO.CreateConnection();

  // specify the connection string
  AConnection.ConnectionString =
    "Provider=SQLNCLI11;" +
    "Server=tcp:" +
    ProjectSuite.Variables.dboDatabaseServer +
    ".database.windows.net;" +
    "Database=" +
    ProjectSuite.Variables.dboDatabase +
    ";" +
    "Uid=" +
    ProjectSuite.Variables.dboDatabaseUser +
    ";" +
    "Pwd=" +
    ProjectSuite.Variables.dboDatabasePass.DecryptedValue +
    ";";

  // open the connection
  AConnection.Open();

  // execute a simple query
  recSet = AConnection.Execute(compQuery);

  // iterate through query results and insert data into the test log
  for (i = 0; i <= recSet.RecordCount - 1; i++) {
    dataSet.push(recSet.Fields.Item(0).Value);
    Log.Message("LOG: enabled services - " + recSet.Fields.Item(0).Value);
    recSet.MoveNext();
  }
  return dataSet;

  // close the connection
  AConnection.Close();
}

function sqlDisableProfileServices(condition) {
  // define query variable
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var compQuery =
    "UPDATE [ProfileService] SET [Enabled] = 0 WHERE [ProfileId] = '" +
    ProjectSuite.Variable.ProfileId +
    "' " +
    condition;

  // create a connection object
  AConnection = ADO.CreateConnection();

  // specify the connection string
  AConnection.ConnectionString =
    "Provider=SQLNCLI11;" +
    "Server=tcp:" +
    ProjectSuite.Variables.dboDatabaseServer +
    ".database.windows.net;" +
    "Database=" +
    ProjectSuite.Variables.dboDatabase +
    ";" +
    "Uid=" +
    ProjectSuite.Variables.dboDatabaseUser +
    ";" +
    "Pwd=" +
    ProjectSuite.Variables.dboDatabasePass.DecryptedValue +
    ";";

  // open the connection
  AConnection.Open();

  // execute a simple query
  AConnection.Execute(compQuery);

  // close the connection
  AConnection.Close();
}

function sqlEnableProfileServices(condition) {
  // define query variable
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var compQuery =
    "IF EXISTS (SELECT s.[ServiceId] FROM [Service] s " +
    "INNER JOIN [ProfileService] ps ON ps.[ServiceId] = s.[ServiceId] " +
    "WHERE ps.[ProfileId] = '" +
    ProjectSuite.Variable.ProfileId +
    "' AND s.[Enabled] = 0) " +
    "BEGIN " +
    "UPDATE [ProfileService] SET [Enabled] = 1 WHERE [ProfileId] = '" +
    ProjectSuite.Variable.ProfileId +
    "' " +
    condition;
  +"END " + "ELSE SELECT 'All Profile Services are Enabled' AS CurrentStatus";

  // create a connection object
  AConnection = ADO.CreateConnection();

  // specify the connection string
  AConnection.ConnectionString =
    "Provider=SQLNCLI11;" +
    "Server=tcp:" +
    ProjectSuite.Variables.dboDatabaseServer +
    ".database.windows.net;" +
    "Database=" +
    ProjectSuite.Variables.dboDatabase +
    ";" +
    "Uid=" +
    ProjectSuite.Variables.dboDatabaseUser +
    ";" +
    "Pwd=" +
    ProjectSuite.Variables.dboDatabasePass.DecryptedValue +
    ";";

  // open the connection
  AConnection.Open();

  // execute a simple query
  AConnection.Execute(compQuery);

  // close the connection
  AConnection.Close();
}

function getProfileInfo() {
  BackOfficeMAIN.sgbGetCurrentUser();
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileId = CommonSQL.sqlQueryOne(
    "SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      ProjectSuite.Variables.ProfileName +
      "'",
  );
  Log.Checkpoint(
    "| Profile = " +
      ProjectSuite.Variables.ProfileName +
      " | Profile Id = " +
      ProjectSuite.Variables.ProfileId +
      " |",
  );
}

function getServiceInfo() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  Log.Message("LOG: service type = " + ProjectSuite.Variables.ServiceType);
  ProjectSuite.Variables.ServiceId = CommonSQL.sqlQueryOne(
    "SELECT [ServiceId] FROM [Service] " +
      "WHERE [Name] = '" +
      ProjectSuite.Variables.ServiceType +
      "'",
  );
  switch (ProjectSuite.Variables.ServiceType) {
    case "Payment":
      ProjectSuite.Variables.ServiceType =
        ProjectSuite.Variables.TransactionType;
      Log.Message(
        "LOG: service type 1.0 = " + ProjectSuite.Variables.ServiceType,
      );
      break;
  }
  ProjectSuite.Variables.SubServiceId = CommonSQL.sqlQueryOne(
    "SELECT [SubServiceId] FROM [SubService] " +
      "WHERE [Name] = '" +
      ProjectSuite.Variables.ServiceType +
      "'",
  );
  Log.Checkpoint(
    "| Service = " +
      ProjectSuite.Variables.ServiceType +
      " | Service Id = " +
      ProjectSuite.Variables.ServiceId +
      " | SubService Id = " +
      ProjectSuite.Variables.SubServiceId +
      " |",
  );
}

function getProfileServiceInfo() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileServiceId = CommonSQL.sqlQueryOne(
    "SELECT [ProfileServiceId] FROM [ProfileService] " +
      "WHERE [ProfileId] = " +
      ProjectSuite.Variables.ProfileId +
      " AND [ServiceID] = " +
      ProjectSuite.Variables.ServiceId +
      " AND [Enabled] = 1",
  );
  ProjectSuite.Variables.ProfileSubServiceId = CommonSQL.sqlQueryOne(
    "SELECT [ProfileSubServiceId] FROM [ProfileSubService] " +
      "WHERE [ProfileServiceId] = " +
      ProjectSuite.Variables.ProfileServiceId,
  );
  ProjectSuite.Variables.ProfileServiceTL = CommonSQL.sqlQueryOne(
    "SELECT CAST([ServiceTransactionLimit] AS DECIMAL(18, 2)) FROM [ProfileService] " +
      "WHERE [ProfileServiceId] = " +
      ProjectSuite.Variables.ProfileServiceId,
  );
  ProjectSuite.Variables.ProfileServiceDL = CommonSQL.sqlQueryOne(
    "SELECT CAST([ServiceDailyLimit] AS DECIMAL(18, 2)) FROM [ProfileService] " +
      "WHERE [ProfileServiceId] = " +
      ProjectSuite.Variables.ProfileServiceId,
  );
  Log.Checkpoint(
    "| Profile Service Id = " +
      ProjectSuite.Variables.ProfileServiceId +
      " | Profile SubService Id = " +
      ProjectSuite.Variables.ProfileSubServiceId +
      " | Profile Account Service Transaction Limit = " +
      ProjectSuite.Variables.ProfileServiceTL +
      " | Profile Account Service Daily Limit = " +
      ProjectSuite.Variables.ProfileServiceDL +
      " |",
  );
}

function getProfileUserInfo() {
  BackOfficeMAIN.sgbGetCurrentUser();
  BackOfficeSQL.sqlGetOktaId();
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.UserId = CommonSQL.sqlQueryOne(
    "SELECT [UserId] FROM [User] u " +
      "WHERE u.[FirstName] = '" +
      ProjectSuite.Variables.ProfileUserFirst +
      "' " +
      "AND u.[LastName] = '" +
      ProjectSuite.Variables.ProfileUserLast +
      "'",
  );
  ProjectSuite.Variables.ProfileUserId = CommonSQL.sqlQueryOne(
    "SELECT [ProfileUserId] FROM [ProfileUser] pu " +
      "WHERE pu.UserId = " +
      ProjectSuite.Variables.UserId,
  );
  ProjectSuite.Variables.ProfileAccountUserId = CommonSQL.sqlQueryOne(
    "SELECT [ProfileAccountUserId] FROM [ProfileAccountUser] " +
      "WHERE [ProfileUserId] = " +
      ProjectSuite.Variables.ProfileUserId +
      " " +
      "AND [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId,
  );
  Log.Checkpoint(
    "| Profile User Type = " +
      ProjectSuite.Variables.ActiveUserType +
      " | Profile Account User Id = " +
      ProjectSuite.Variables.ProfileAccountUserId +
      " |",
  );
}

function getRandomAccount() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileAccountId = CommonSQL.sqlQueryOne(
    "SELECT TOP 1 [ProfileAccountId] FROM [ProfileAccount] " +
      "WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] WHERE Name = '" +
      ProjectSuite.Variables.ProfileName +
      "') AND [Enabled] = 1  ORDER BY NEWID()",
  );
  ProjectSuite.Variables.ProfileAccountAlias = CommonSQL.sqlQueryOne(
    "SELECT [Alias] FROM [ProfileAccount] " +
      "WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId,
  );
  ProjectSuite.Variables.AccountId = CommonSQL.sqlQueryOne(
    "SELECT [AccountId] FROM [ProfileAccount] " +
      "WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId,
  );
  ProjectSuite.Variables.ProfileBAN = CommonSQL.sqlQueryOne(
    "SELECT [AccountNumber] FROM [Account] " +
      "WHERE [AccountId] = " +
      ProjectSuite.Variables.AccountId,
  );
  ProjectSuite.Variables.AccountTypeId = CommonSQL.sqlQueryOne(
    "SELECT [AccountTypeId] FROM [Account] " +
      "WHERE [AccountId] = " +
      ProjectSuite.Variables.AccountId,
  );
  ProjectSuite.Variables.Currency1 = CommonSQL.sqlQueryOne(
    "SELECT CASE WHEN [CurrencyEnum] = 840 THEN 'USD' " +
      "WHEN [CurrencyEnum] = 978 THEN 'EUR' END AS 'Currency' FROM AccountType WHERE AccountTypeId = " +
      ProjectSuite.Variables.AccountTypeId,
  );
  Log.Checkpoint(
    "| Profile Account Alias = " +
      ProjectSuite.Variables.ProfileAccountAlias +
      " | Profile Account Id = " +
      ProjectSuite.Variables.ProfileAccountId +
      " | Account Id = " +
      ProjectSuite.Variables.AccountId +
      " | Account Number = " +
      ProjectSuite.Variables.ProfileBAN +
      " | Account Type Id = " +
      ProjectSuite.Variables.AccountTypeId +
      " | Account Currency = " +
      ProjectSuite.Variables.Currency1 +
      " |",
  );
}

function getRandomProfileAccount() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  if (equal(ProjectSuite.Variables.ServiceType, "SEN Transfer")) {
    ProjectSuite.Variables.ProfileAccountId = CommonSQL.sqlQueryOne(
      "SELECT TOP 1 [ProfileAccountId] FROM [ProfileEntitlement] " +
        "WHERE [ProfileSubServiceId] = " +
        ProjectSuite.Variables.ProfileSubServiceId +
        " AND [Enabled] = 1 " +
        "AND [ProfileAccountId] IN (SELECT [ProfileAccountId] FROM [ProfileAccount] WHERE [Enabled] = 1 " +
        "AND [AccountId] IN (SELECT [AccountId] From [Account] WHERE [SENEnabled] = 1)) ORDER BY NEWID()",
    );
  } else {
    ProjectSuite.Variables.ProfileAccountId = CommonSQL.sqlQueryOne(
      "SELECT TOP 1 [ProfileAccountId] FROM [ProfileEntitlement] " +
        "WHERE [ProfileSubServiceId] = " +
        ProjectSuite.Variables.ProfileSubServiceId +
        " AND [Enabled] = 1 " +
        "AND [ProfileAccountId] IN (SELECT [ProfileAccountId] FROM [ProfileAccount] WHERE [Enabled] = 1) ORDER BY NEWID()",
    );
  }
  ProjectSuite.Variables.ProfileAccountAlias = CommonSQL.sqlQueryOne(
    "SELECT [Alias] FROM [ProfileAccount] " +
      "WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId,
  );
  ProjectSuite.Variables.AccountId = CommonSQL.sqlQueryOne(
    "SELECT [AccountId] FROM [ProfileAccount] " +
      "WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId,
  );
  ProjectSuite.Variables.ProfileBAN = CommonSQL.sqlQueryOne(
    "SELECT [AccountNumber] FROM [Account] " +
      "WHERE [AccountId] = " +
      ProjectSuite.Variables.AccountId,
  );
  ProjectSuite.Variables.AccountTypeId = CommonSQL.sqlQueryOne(
    "SELECT [AccountTypeId] FROM [Account] " +
      "WHERE [AccountId] = " +
      ProjectSuite.Variables.AccountId,
  );
  ProjectSuite.Variables.Currency1 = CommonSQL.sqlQueryOne(
    "SELECT CASE WHEN [CurrencyEnum] = 840 THEN 'USD' " +
      "WHEN [CurrencyEnum] = 978 THEN 'EUR' END AS 'Currency' FROM AccountType WHERE AccountTypeId = " +
      ProjectSuite.Variables.AccountTypeId,
  );
  Log.Checkpoint(
    "| Profile Account Alias = " +
      ProjectSuite.Variables.ProfileAccountAlias +
      " | Profile Account Id = " +
      ProjectSuite.Variables.ProfileAccountId +
      " | Account Id = " +
      ProjectSuite.Variables.AccountId +
      " | Account Number = " +
      ProjectSuite.Variables.ProfileBAN +
      " | Account Type Id = " +
      ProjectSuite.Variables.AccountTypeId +
      " | Account Currency = " +
      ProjectSuite.Variables.Currency1 +
      " |",
  );
}

function getRandomTransferAccount(condition) {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  Log.Message("LOG: condition = " + condition);
  switch (condition) {
    case "Outbound":
      var transferType = CommonSQL.sqlQueryOne(
        "WITH cte_Outbound (AccountType) AS ( " +
          "SELECT 'Send to Owned Account' UNION SELECT 'Send to Third Party' ) " +
          "SELECT TOP 1 AccountType FROM cte_Outbound ORDER BY NEWID()",
      );
      break;
    case "Inbound":
      var transferType = "Send from External Account";
      ProjectSuite.Variables.ProfileAccountAlias = CommonSQL.sqlQueryOne(
        "SELECT TOP 1 [Alias] FROM [ProfileAccount] WHERE [ProfileAccountId] IN " +
          "(SELECT [ProfileAccountId] FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] = " +
          ProjectSuite.Variables.ProfileSubServiceId +
          " AND [Enabled] = 1) " +
          "AND [Enabled] = 1 AND [Alias] NOT LIKE '%EUR%' ORDER BY NEWID()",
      );
      PortalSQL.getRandomCurrencyType();
      break;
    case "Transfer":
      switch (ProjectSuite.Variables.Currency1) {
        case "USD":
          var transferType = CommonSQL.sqlQueryOne(
            "SELECT TOP 1 [Alias] FROM [ProfileAccount] WHERE [ProfileAccountId] IN " +
              "(SELECT [ProfileAccountId] FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] = " +
              ProjectSuite.Variables.ProfileSubServiceId +
              " AND [Enabled] = 1) " +
              "AND [Enabled] = 1 AND [Alias] LIKE '%EUR%' ORDER BY NEWID()",
          );
          break;
        case "EUR":
          var transferType = CommonSQL.sqlQueryOne(
            "SELECT TOP 1 [Alias] FROM [ProfileAccount] WHERE [ProfileAccountId] IN " +
              "(SELECT [ProfileAccountId] FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] = " +
              ProjectSuite.Variables.ProfileSubServiceId +
              " AND [Enabled] = 1) " +
              "AND [Enabled] = 1 AND [Alias] NOT LIKE '%EUR%' ORDER BY NEWID()",
          );
          break;
      }
      break;
    case "Internal":
      switch (ProjectSuite.Variables.Currency1) {
        case "USD":
          var transferType = CommonSQL.sqlQueryOne(
            "SELECT TOP 1 [Alias] FROM [ProfileAccount] WHERE [ProfileAccountId] IN " +
              "(SELECT [ProfileAccountId] FROM [ProfileEntitlement] WHERE [Enabled] = 1) AND [Enabled] = 1 AND [Alias] NOT LIKE '%EUR%' " +
              " AND ProfileId = " +
              ProjectSuite.Variables.ProfileId +
              " AND ProfileAccountId != " +
              ProjectSuite.Variables.ProfileAccountId +
              " ORDER BY NEWID()",
          );
          break;
        case "EUR":
          var transferType = CommonSQL.sqlQueryOne(
            "SELECT TOP 1 [Alias] FROM [ProfileAccount] WHERE [ProfileAccountId] IN " +
              "(SELECT [ProfileAccountId] FROM [ProfileEntitlement] WHERE [Enabled] = 1) AND [Enabled] = 1 AND [Alias] LIKE '%EUR%' " +
              " AND ProfileId = " +
              ProjectSuite.Variables.ProfileId +
              " AND ProfileAccountId != " +
              ProjectSuite.Variables.ProfileAccountId +
              " ORDER BY NEWID()",
          );
          break;
      }
      break;
    case "Payment":
      var transferType = CommonSQL.sqlQueryOne(
        "WITH cte_Outbound (AccountType) AS ( " +
          "SELECT 'Send to Owned Account' UNION SELECT 'Send to Third Party' ) " +
          "SELECT TOP 1 AccountType FROM cte_Outbound ORDER BY NEWID()",
      );
      break;
    case "USD":
      var transferType = "Send from External Account";
      ProjectSuite.Variables.ProfileAccountAlias = CommonSQL.sqlQueryOne(
        "SELECT TOP 1 [Alias] FROM [ProfileAccount] WHERE [ProfileAccountId] IN " +
          "(SELECT [ProfileAccountId] FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] = " +
          ProjectSuite.Variables.ProfileSubServiceId +
          " AND [Enabled] = 1) " +
          "AND [Enabled] = 1 AND [Alias] NOT LIKE '%EUR%' ORDER BY NEWID()",
      );
      break;
    case "EUR":
      var transferType = "Send from External Account";
      ProjectSuite.Variables.ProfileAccountAlias = CommonSQL.sqlQueryOne(
        "SELECT TOP 1 [Alias] FROM [ProfileAccount] WHERE [ProfileAccountId] IN " +
          "(SELECT [ProfileAccountId] FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] = " +
          ProjectSuite.Variables.ProfileSubServiceId +
          " AND [Enabled] = 1) " +
          "AND [Enabled] = 1 AND [Alias] LIKE '%EUR%' ORDER BY NEWID()",
      );
      break;
  }
  Log.Checkpoint("| Transfer Type = " + transferType + " |");
  return transferType;
}

function getRandomEURAccount() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileAccountId = CommonSQL.sqlQueryOne(
    "SELECT TOP 1 [ProfileAccountId] FROM [ProfileEntitlement] " +
      "WHERE [ProfileSubServiceId] = " +
      ProjectSuite.Variables.ProfileSubServiceId +
      " AND [Enabled] = 1 " +
      "AND [ProfileAccountId] IN (SELECT [ProfileAccountId] FROM [ProfileAccount] WHERE [Enabled] = 1 AND [Alias] LIKE '%EUR%') ORDER BY NEWID()",
  );
  ProjectSuite.Variables.ProfileAccountAlias = CommonSQL.sqlQueryOne(
    "SELECT [Alias] FROM [ProfileAccount] " +
      "WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId,
  );
  ProjectSuite.Variables.AccountId = CommonSQL.sqlQueryOne(
    "SELECT [AccountId] FROM [ProfileAccount] " +
      "WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId,
  );
  ProjectSuite.Variables.ProfileBAN = CommonSQL.sqlQueryOne(
    "SELECT [AccountNumber] FROM [Account] " +
      "WHERE [AccountId] = " +
      ProjectSuite.Variables.AccountId,
  );
  ProjectSuite.Variables.AccountTypeId = CommonSQL.sqlQueryOne(
    "SELECT [AccountTypeId] FROM [Account] " +
      "WHERE [AccountId] = " +
      ProjectSuite.Variables.AccountId,
  );
  ProjectSuite.Variables.Currency1 = CommonSQL.sqlQueryOne(
    "SELECT CASE WHEN [CurrencyEnum] = 840 THEN 'USD' " +
      "WHEN [CurrencyEnum] = 978 THEN 'EUR' END AS 'Currency' FROM AccountType WHERE AccountTypeId = " +
      ProjectSuite.Variables.AccountTypeId,
  );
  Log.Checkpoint(
    "| Profile Account Alias = " +
      ProjectSuite.Variables.ProfileAccountAlias +
      " | Profile Account Id = " +
      ProjectSuite.Variables.ProfileAccountId +
      " | Account Id = " +
      ProjectSuite.Variables.AccountId +
      " | Account Number = " +
      ProjectSuite.Variables.ProfileBAN +
      " | Account Type Id = " +
      ProjectSuite.Variables.AccountTypeId +
      " | Account Currency = " +
      ProjectSuite.Variables.Currency1 +
      " |",
  );
}

function getRandomCurrencyType() {
  var condition;
  var envt = aqString.ToLower(ProjectSuite.Variables.Environment);
  CommonSQL.sqlDatabaseHandler("sqldb-fx-" + envt);

  switch (ProjectSuite.Variables.TransactionType) {
    case "Inbound":
      condition =
        "WHERE cpgs.[InboundAllowed] = 1 AND cpgs.[CurrencyPairGroupId] = 1";
      break;
    case "Outbound":
      if (equal(ProjectSuite.Variables.TradeTo, "Send to Owned Account")) {
        condition = "WHERE cpgs.[SendToOwnedAccountEnabled] = 1";
      }
      if (equal(ProjectSuite.Variables.TradeTo, "Send to Third Party")) {
        condition = "WHERE cpgs.[SendToThirdPartyEnabled] = 1";
      }
      if (equal(ProjectSuite.Variables.TradeTo, "Send to Third Party")) break;
    case "Crypto":
      condition = "WHERE cpgs.[CryptoSupport] = 1";
      break;
  }
  Log.Message(
    "LOG: transType - " +
      ProjectSuite.Variables.TransactionType +
      " | currency condition - " +
      condition,
  );

  CommonSQL.sqlQueryNone(
    "DROP TABLE IF EXISTS dbo.CurrencyTemp CREATE TABLE CurrencyTemp ([Currency] VARCHAR(3));",
  );

  CommonSQL.sqlQueryNone(
    "INSERT INTO CurrencyTemp SELECT DISTINCT CASE " +
      "WHEN [DealtCurrency] = 36 THEN 'AUD' " +
      "WHEN [DealtCurrency] = 554 THEN 'NZD' " +
      "WHEN [DealtCurrency] = 826 THEN 'GBP' " +
      "WHEN [DealtCurrency] = 840 THEN 'USD' " +
      "WHEN [DealtCurrency] = 978 THEN 'EUR' " +
      "END AS [Currency] FROM [CurrencyPairSetting] cps " +
      "INNER JOIN [CurrencyPairGroupSetting] cpgs " +
      "ON cpgs.[CurrencyPairSettingId] = cps.[CurrencyPairSettingId] " +
      condition,
  );

  CommonSQL.sqlQueryNone(
    "INSERT INTO CurrencyTemp " +
      "SELECT DISTINCT CASE " +
      "WHEN [CounterCurrency] = 36 THEN 'AUD' " +
      "WHEN [CounterCurrency] = 48 THEN 'BHD' " +
      "WHEN [CounterCurrency] = 52 THEN 'BBD' " +
      "WHEN [CounterCurrency] = 124 THEN 'CAD' " +
      "WHEN [CounterCurrency] = 156 THEN 'CNY' " +
      "WHEN [CounterCurrency] = 191 THEN 'HRK' " +
      "WHEN [CounterCurrency] = 203 THEN 'CZK' " +
      "WHEN [CounterCurrency] = 208 THEN 'DKK' " +
      "WHEN [CounterCurrency] = 344 THEN 'HKD' " +
      "WHEN [CounterCurrency] = 348 THEN 'HUF' " +
      "WHEN [CounterCurrency] = 352 THEN 'ISK' " +
      "WHEN [CounterCurrency] = 376 THEN 'ILS' " +
      "WHEN [CounterCurrency] = 392 THEN 'JPY' " +
      "WHEN [CounterCurrency] = 410 THEN 'KRW' " +
      "WHEN [CounterCurrency] = 414 THEN 'KWD' " +
      "WHEN [CounterCurrency] = 484 THEN 'MXN' " +
      "WHEN [CounterCurrency] = 512 THEN 'OMR' " +
      "WHEN [CounterCurrency] = 554 THEN 'NZD' " +
      "WHEN [CounterCurrency] = 578 THEN 'NOK' " +
      "WHEN [CounterCurrency] = 608 THEN 'PHP' " +
      "WHEN [CounterCurrency] = 634 THEN 'QAR' " +
      "WHEN [CounterCurrency] = 682 THEN 'SAR' " +
      "WHEN [CounterCurrency] = 702 THEN 'SGD' " +
      "WHEN [CounterCurrency] = 710 THEN 'ZAR' " +
      "WHEN [CounterCurrency] = 752 THEN 'SEK' " +
      "WHEN [CounterCurrency] = 756 THEN 'CHF' " +
      "WHEN [CounterCurrency] = 764 THEN 'THB' " +
      "WHEN [CounterCurrency] = 784 THEN 'AED' " +
      "WHEN [CounterCurrency] = 826 THEN 'GBP' " +
      "WHEN [CounterCurrency] = 840 THEN 'USD' " +
      "WHEN [CounterCurrency] = 949 THEN 'TRY' " +
      "WHEN [CounterCurrency] = 978 THEN 'EUR' " +
      "WHEN [CounterCurrency] = 985 THEN 'PLN' " +
      "END AS [Currency] FROM [CurrencyPairSetting] cps " +
      "INNER JOIN [CurrencyPairGroupSetting] cpgs " +
      "ON cpgs.[CurrencyPairSettingId] = cps.[CurrencyPairSettingId] " +
      condition,
  );

  if (equal(ProjectSuite.Variables.TransactionType, "Crypto")) {
    ProjectSuite.Variables.Currency2 = CommonSQL.sqlQueryOne(
      "SELECT TOP 1 [Currency] FROM CurrencyTemp " +
        "WHERE [Currency] IN ('CHF', 'EUR', 'HKD', 'SGD') ORDER BY NEWID()",
    ); // crypto support currencies
  } else {
    ProjectSuite.Variables.Currency2 = CommonSQL.sqlQueryOne(
      "SELECT TOP 1 [Currency] FROM CurrencyTemp " +
        "WHERE [Currency] IN ('AUD', 'CAD', 'CHF', 'EUR', 'GBP', 'HKD', 'JPY', 'SGD') ORDER BY NEWID()",
    ); // top 8 currencies
  }

  Log.Checkpoint("| Random Currency | - " + ProjectSuite.Variables.Currency2);
}

function getProfileAccountUserEntitlements() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileEntitlementId = CommonSQL.sqlQueryOne(
    "SELECT [ProfileEntitlementId] FROM [ProfileEntitlement] " +
      "WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId +
      " AND [ProfileSubServiceId] = " +
      ProjectSuite.Variables.ProfileSubServiceId,
  );
  ProjectSuite.Variables.ProfileAccountServiceTL = CommonSQL.sqlQueryOne(
    "SELECT CAST([TransactionLimit] AS DECIMAL(18, 2)) FROM [ProfileEntitlement] " +
      "WHERE [ProfileEntitlementId] = " +
      ProjectSuite.Variables.ProfileEntitlementId,
  );
  ProjectSuite.Variables.ProfileAccountServiceDL = CommonSQL.sqlQueryOne(
    "SELECT CAST([DailyLimit] AS DECIMAL(18, 2)) FROM [ProfileEntitlement] " +
      "WHERE [ProfileEntitlementId] = " +
      ProjectSuite.Variables.ProfileEntitlementId,
  );
  Log.Checkpoint(
    "| Profile Account Entitlement Id = " +
      ProjectSuite.Variables.ProfileEntitlementId +
      " | Profile Account Service Transaction Limit = " +
      ProjectSuite.Variables.ProfileAccountServiceTL +
      " | Profile Account Service Daily Limit = " +
      ProjectSuite.Variables.ProfileAccountServiceDL +
      " |",
  );
}

function getPurpose() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var attr = Log.CreateNewAttributes();
  attr.Italic = true;
  Log.Checkpoint("BUTTER ROBOT: What is my purpose?", "", pmNormal, attr);
  ProjectSuite.Variables.TransactionPurpose = CommonSQL.sqlQueryOne(
    "WITH cte_Purpose (Purpose) AS ( " +
      "SELECT 'Claim Payment' UNION SELECT 'Customer Account' UNION SELECT 'Employee or Consultant Payroll' " +
      "UNION SELECT 'Expense Reimbursement' UNION SELECT 'Government Registration' UNION SELECT 'Investments' " +
      "UNION SELECT 'Non Dividends Distribution' UNION SELECT 'Purchase of Real Estate' UNION SELECT 'Rent or Utilities' " +
      "UNION SELECT 'Tax Payment' UNION SELECT 'Transfer between Own Accounts' UNION SELECT 'Vendor Consulting Company' " +
      "UNION SELECT 'Vendor for Legal Services' UNION SELECT 'Vendor for Software or Hardware' " +
      "UNION SELECT 'Vendor Other' UNION SELECT 'Other') " +
      "SELECT TOP 1 Purpose FROM cte_Purpose ORDER BY NEWID()",
  );
  Log.Checkpoint(
    "RICK: You serve butter... burp... AND " +
      ProjectSuite.Variables.TransactionPurpose,
    "",
    pmNormal,
    attr,
  );
  Log.Checkpoint("BUTTER ROBOT: OH MY GOD!", "", pmNormal, attr);
  attr.Italic = false;
}

function getBeneficiary() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.BeneficiaryBankType = CommonSQL.sqlQueryOne(
    "WITH cte_Bene (AccountType) AS ( " +
      "SELECT 'SWIFT/BIC' UNION SELECT 'ABA/Routing') SELECT TOP 1 AccountType FROM cte_Bene ORDER BY NEWID()",
  );
  if (
    equal(ProjectSuite.Variables.TransactionType, "Foreign Currency Payment")
  ) {
    ProjectSuite.Variables.BeneficiaryBankType = "ABA/Routing";
  }
  switch (ProjectSuite.Variables.BeneficiaryBankType) {
    case "ABA/Routing":
      CommonDDT.ddtBeneficiaryInfo(1);
      break;
    case "SWIFT/BIC":
      if (
        equal(ProjectSuite.Variables.Currency1, "USD") &&
        equal(ProjectSuite.Variables.TransactionType, "Global USD Payment")
      ) {
        CommonDDT.ddtBeneficiaryInfo(1);
      } else {
        CommonDDT.ddtBeneficiaryInfo(2);
      }
      break;
  }
  Log.Checkpoint(
    "| Bene Bank Type | - " + ProjectSuite.Variables.BeneficiaryBankType,
  );
}
