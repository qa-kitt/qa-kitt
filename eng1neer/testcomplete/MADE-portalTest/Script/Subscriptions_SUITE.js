//USEUNIT BackOfficeAPI
//USEUNIT BackOfficeADMIN
//USEUNIT BackOfficeMAIN
//USEUNIT BackOfficeSQL
//USEUNIT CommonMAIN
//USEUNIT PortalINT
//USEUNIT PortalMAIN
//USEUNIT PortalSQL

/***************************************************************
Name: Subscriptions_SUITE
Description: Automated test cases - Back Office Admin: Profile Subscriptions
Author: Kitt Random
Creation Date: 03/28/2022
***************************************************************/

function subsSuiteLogin() {
  // login to back office as back office admin
  ProjectSuite.Variables.ActiveTestSuite = "Subscriptions";
  BackOfficeMAIN.navigateBackOffice("profiles");
  CommonMAIN.sgbGetCurrentUser();
  _subsDefaultSetup();
}

// TC14931 > Profile API Subscription: Edit Alias - Admin
function testCase_14931() {
  // refresh test data
  _subsDefaultSetup();

  // edit profile api subscription alias
  BackOfficeAPI.editAPISubscriptionAlias();

  // switch profiles and deny request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.1");
}

// TC14932 > Profile API Subscription: Edit Email - Admin
function testCase_14932() {
  // refresh test data
  _subsDefaultSetup();

  // edit profile api subscription email
  BackOfficeAPI.editAPISubscriptionEmail();

  // switch profiles and deny request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.1");
}

// TC14933 > Profile API Subscription: Verify Keys - Admin
function testCase_14933() {
  _subsDefaultSetup();
  BackOfficeAPI.verifyAPISubscriptionKeys();
}

// TC14934 > Profile API Subscription: Edit Keys - Admin
function testCase_14934() {
  // refresh test data
  _subsDefaultSetup();

  // verify current profile api subscription keys
  BackOfficeAPI.verifyAPISubscriptionKeys();

  // save old keys
  var oldPrimary = ProjectSuite.Variables.SubPrimaryKey.DecryptedValue;
  var oldSecondary = ProjectSuite.Variables.SubSecondaryKey.DecryptedValue;

  // edit profile api subscription keys
  BackOfficeAPI.editAPISubscriptionKeys();

  // verify new profile api subscription keys
  BackOfficeAPI.verifyAPISubscriptionKeys();

  // save new keys
  var newPrimary = ProjectSuite.Variables.SubPrimaryKey.DecryptedValue;
  var newSecondary = ProjectSuite.Variables.SubSecondaryKey.DecryptedValue;

  // verify old and new do NOT match
  if (
    strictEqual(oldPrimary, newPrimary) ||
    strictEqual(oldSecondary, newSecondary)
  ) {
    Log.Warning("WARNING: old keys may match new keys, review logs below...");
  }
  Log.Checkpoint(
    "| Old API Keys | oldPrimary = " +
      oldPrimary +
      " & oldSecondary = " +
      oldSecondary,
  );
  Log.Checkpoint(
    "| New API Keys | newPrimary = " +
      newPrimary +
      " & newSecondary = " +
      newSecondary,
  );
}

// TC14936 > Profile API Subscription: Create New API Secret - Admin
function testCase_14936() {
  _subsDefaultSetup();
  BackOfficeAPI.editAPISubscriptionSecret();
}

// TC14938 > Profile API Subscription: Change Permissions - Admin
function testCase_14938() {
  // refresh test data
  _subsDefaultSetup();

  // new profile api subscription
  BackOfficeAPI.addAPISubscription();

  // switch profiles and deny requests
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.1");
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.2");

  // suspend new profile api subscription
  BackOfficeAPI.suspendAPISubscription();
}

// TC14939 > Profile API Subscription: Change Services - Admin
function testCase_14939() {
  // refresh test data
  _subsDefaultSetup();

  // new profile api subscription
  BackOfficeAPI.addAPISubscription();

  // switch profiles and deny requests
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.1");
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.2");

  // suspend new profile api subscription
  BackOfficeAPI.suspendAPISubscription();
}

// TC14940 > Profile API Subscription: Suspend Subscription - Admin
function testCase_14940() {
  // refresh test data
  _subsDefaultSetup();

  // new profile api subscription
  BackOfficeAPI.addAPISubscription();

  // switch profiles and deny requests
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.1");
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.2");

  // suspend profile api subscription
  BackOfficeAPI.suspendAPISubscription();
}

// TC14998 > Profile API Subscription: View Current Permissions - Admin
function testCase_14998() {
  _subsDefaultSetup();
  BackOfficeAPI.verifyAPISubscription();
}

// TC14999 > Profile API Subscription: Password Permissions - Admin
function testCase_14999() {
  // refresh test data and login as admin
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeTrader();
  }

  // verify profile api subscription permissions
  BackOfficeAPI.verifyAPISubscription();
}

// TC15000 > Profile API Subscription: Change Owner Email Permissions - Admin
function testCase_15000() {
  // refresh test data and login as admin
  _subsDefaultSetup();

  // edit profile api subscription email
  BackOfficeAPI.editAPISubscriptionEmail();

  // switch admin profiles and deny request
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.1");

  // edit profile api subscription email as second admin and deny
  BackOfficeAPI.editAPISubscriptionEmail();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.1");

  // switch to trader
  BackOfficeMAIN.sgbSwitchToBackOfficeTrader();

  // attempt to edit profile api subscription email as trader
  BackOfficeAPI.editAPISubscriptionEmail();
}

// TC15001 > Profile API Subscription: View/Copy Keys Permissions - Admin
function testCase_15001() {
  _subsDefaultSetup();
  BackOfficeAPI.verifyAPISubscriptionKeys();
}

// TC15002 > Profile API Subscription: Regenerate Keys Permissions - Trader
function testCase_15002() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchToBackOfficeTrader();
  }

  // verify current profile api subscription keys
  BackOfficeAPI.verifyAPISubscriptionSecret();
}

// TC15003 > Profile API Subscription: Permissions - Trader
function testCase_15003() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeTrader();
  }

  // verify profile api subscription permissions
  BackOfficeAPI.verifyAPISubscription();
}

// TC15004 > Profile API Subscription: Change Permissions - Trader
function testCase_15004() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeTrader();
  }

  // verify profile api subscription permissions
  BackOfficeAPI.verifyAPISubscription();
}

// TC15005 > Profile API Subscription: Disable Permissions - BOA
function testCase_15005() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Back Office Admin")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeBOA();
  }

  // new profile api subscription
  BackOfficeAPI.addAPISubscription();

  // switch profiles and deny requests
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.1");
  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", "0.2");

  // suspend new profile api subscription
  BackOfficeAPI.suspendAPISubscription();
}

// TC15006 > Profile API Subscription:  ReEnable Permissions - Admin
function testCase_15006() {
  _subsDefaultSetup();
  BackOfficeAPI.defaultAPISubscription();
}

// TC15007 > Profile API Subscription: Client Secret Permissions - BOA
function testCase_15007() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Back Office Admin")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeBOA();
  }

  // verify profile api subscription keys
  BackOfficeAPI.verifyAPISubscriptionKeys();
}

// TC15008 > Profile API Subscription: Regenerage Keys Permissions - BOA
function testCase_15008() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Back Office Admin")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeBOA();
  }

  // verify profile api subscription keys
  BackOfficeAPI.verifyAPISubscriptionKeys();
}

// TC15009 > Profile API Subscription: Regenerate Client Secret Permissions - Front Office
function testCase_15009() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Front Office Admin")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeFO();
  }

  // verify profile api subscription keys
  BackOfficeAPI.verifyAPISubscriptionKeys();
}

// TC15010 > Profile API Subscription: Add Button Permissions - Trader
function testCase_15010() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeTrader();
  }

  // verify profile api subscription permissions
  BackOfficeAPI.verifyAPISubscription();
}

// TC15011 > Profile API Subscription: Add Permissions - Trader
function testCase_15011() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeTrader();
  }

  // verify profile api subscription permissions
  BackOfficeAPI.verifyAPISubscription();
}

// TC15000 > Profile Subscription: Logout & Refresh
function subsSuiteLogout() {
  // refresh test data for logout
  CommonMAIN.sgbRefresh();

  // cleanup and refresh api info (if needed)
  BackOfficeAPI.defaultAPISubscription();
  BackOfficeSQL.sqlCleanOrphanedTestProfiles();
}

function _subsDefaultSetup() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Trader") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Front Office Admin")
  ) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }
}
