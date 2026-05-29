//USEUNIT BackOfficeMAIN
//USEUNIT CommonSQL

/***************************************************************
Name: BackOfficeSQL
Description: Backend database calls - SSMS
Author: Kitt Random
Creation Date: 09/16/2021
***************************************************************/

function sqlSetDefaultProfileLimits() {
  // set database source
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileUserApprovalReq = false;

  // set profile service limits - default = $80,000DL | $8,000TL
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileService] SET [ServiceTransactionLimit] = 8000.00000, " +
      "[ServiceDailyLimit] = 80000.00000, [Enabled] = 1 WHERE [ProfileId] IN (SELECT [ProfileId] " +
      "FROM [Profile] WHERE [Name] = '" +
      ProjectSuite.Variables.ProfileName +
      "')",
  );

  // set profile account service limits - default = $800DL | $80TL
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileEntitlement] SET [TransactionLimit] = 80.00000, " +
      "[DailyLimit] = 800.00000, [Enabled] = 1 WHERE [ChangedBy] != 'entitlements_sa' AND [ProfileSubServiceId] " +
      "IN (SELECT [ProfileSubServiceId] FROM [ProfileSubService] WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] " +
      "FROM [ProfileService] WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] " +
      "WHERE [Name] = '" +
      ProjectSuite.Variables.ProfileName +
      "')))",
  );

  // set profile user service limits - default = $800DL | $80TL
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileUserEntitlement] SET [TransactionLimit] = 80.00000, " +
      "[DailyLimit] = 800.00000, [Enabled] = 1, [ApprovalsRequired] = 0 WHERE [ChangedBy] != 'entitlements_sa' " +
      "AND [ProfileEntitlementId] IN (SELECT [ProfileEntitlementId] FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] " +
      "IN (SELECT [ProfileSubServiceId] FROM [ProfileSubService] WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] " +
      "FROM [ProfileService] WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] " +
      "WHERE [Name] = '" +
      ProjectSuite.Variables.ProfileName +
      "'))))",
  );

  // set profile subscription service limits - default = $800DL | $80TL
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileSubscriptionEntitlement] SET [TransactionLimit] = 80.00000, " +
      "[DailyLimit] = 800.00000, [Enabled] = 1 WHERE [ProfileEntitlementId] IN (SELECT [ProfileEntitlementId] " +
      "FROM [ProfileEntitlement] WHERE [ProfileSubServiceId] IN (SELECT [ProfileSubServiceId]	FROM [ProfileSubService] " +
      "WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] FROM [ProfileService] WHERE [ProfileId] IN (SELECT " +
      "[ProfileId] FROM [Profile] WHERE [Name] = '" +
      ProjectSuite.Variables.ProfileName +
      "'))))",
  );
}

function sqlEnableConnectionPermissions() {
  // add new and edit existing = 3
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileUser] SET [ProfileConnectionPermissionEnum] = 3" +
      " WHERE [ProfileId] = " +
      ProjectSuite.Variables.ProfileId,
  );
  Log.Checkpoint("| Profile Connection Permisssions Configured |");
}

function sqlSetUserConnectionPermission(set) {
  // none = 0; add new = 1; edit existing = 2; add new and edit existing = 3
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
    "UPDATE [ProfileUser] SET [ProfileConnectionPermissionEnum] = " +
      set +
      " WHERE [ProfileUserId] = " +
      ProjectSuite.Variables.ProfileUserId,
  );
  Log.Checkpoint("| Profile User Connection Permisssion Configured |");
}

function sqlClearTestApprovals() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
    "DELETE FROM [PortalApprovalQueueItem] WHERE [SubmittedBy] IN (SELECT [OKTAId] FROM [dbo].[User] " +
      "WHERE [FirstName] = '" +
      ProjectSuite.Variables.ProfileUserFirst +
      "' AND [LastName] LIKE 'User %')",
  );
  CommonSQL.sqlQueryNone(
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
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileUserOkta = CommonSQL.sqlQueryOne(
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
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileLimitDaily = CommonSQL.sqlQueryOne(
    "SELECT CAST([DailyLimit] AS DECIMAL(18, 2)) " +
      "FROM [ProfileEntitlement] WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId +
      " " +
      "AND [ProfileSubServiceId] = " +
      ProjectSuite.Variables.ProfileSubServiceId,
  );
  ProjectSuite.Variables.ProfileLimitTrans = CommonSQL.sqlQueryOne(
    "SELECT CAST([DailyLimit] AS DECIMAL(18, 2)) " +
      "FROM [ProfileEntitlement] WHERE [ProfileAccountId] = " +
      ProjectSuite.Variables.ProfileAccountId +
      " " +
      "AND [ProfileSubServiceId] = " +
      ProjectSuite.Variables.ProfileSubServiceId,
  );
  Log.Checkpoint(
    "| Profile User Limit Logged | - " +
      ProjectSuite.Variables.ProfileName +
      " Daily Limit: $" +
      ProjectSuite.Variables.ProfileLimitDaily +
      " Transaction Limit: $" +
      ProjectSuite.Variables.ProfileLimitTrans,
  );
}

function sqlGetUserLimit() {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.limitDaily = CommonSQL.sqlQueryOne(
    "SELECT CAST([DailyLimit] AS DECIMAL(18, 2)) " +
      "FROM [ProfileUserEntitlement] WHERE [ProfileAccountUserId] = " +
      ProjectSuite.Variables.ProfileAccountUserId +
      " AND [ProfileEntitlementId] = " +
      ProjectSuite.Variables.ProfileEntitlementId,
  );
  ProjectSuite.Variables.limitTransaction = CommonSQL.sqlQueryOne(
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
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  ProjectSuite.Variables.ProfileUserConnectionEnum = CommonSQL.sqlQueryNone(
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
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var bool = CommonSQL.sqlQueryBool(
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
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var acctId = CommonSQL.sqlQueryArray(
    "SELECT [ProfileAccountId] FROM [ProfileAccount] WHERE [ProfileId] IN " +
      "(SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      ProjectSuite.Variables.ProfileName +
      "')",
  );
  var acctIds = aqString.Trim(acctId, aqString.stLeading);
  Log.Message("LOG: acctIds - " + acctIds);
  return acctIds;
}

function sqlGetProfileEntitlementInfo(id) {
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  var subEntitlements = CommonSQL.sqlQueryArray(
    "SELECT [ProfileEntitlementId] FROM [ProfileEntitlement] " +
      "WHERE [ProfileSubServiceId] IN (SELECT [ProfileSubServiceId] FROM [ProfileSubService] " +
      "WHERE [ProfileServiceId] IN (SELECT [ProfileServiceId] FROM [ProfileService] " +
      "WHERE [ProfileId] IN (SELECT [ProfileId] FROM [Profile] WHERE [Name] = '" +
      ProjectSuite.Variables.ProfileName +
      "') " +
      "AND [ServiceId] IN (1, 2, 4)) AND [SubServiceId] IN ('1', '2', '5')) AND [ProfileAccountId] = '" +
      aqString.Replace(id, ", ", "', '") +
      "'",
  );
  return aqString.Trim(subEntitlements, aqString.stLeading);
}

function sqlCleanOrphanedTestProfiles() {
  var x = Project.Variables.sgbNewSubAlias;
  CommonSQL.sqlDatabaseHandler(
    "sqldb-entitlements-" +
      aqString.ToLower(ProjectSuite.Variables.Environment),
  );
  CommonSQL.sqlQueryNone(
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
