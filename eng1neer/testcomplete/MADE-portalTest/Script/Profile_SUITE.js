//USEUNIT BackOfficeAPI
//USEUNIT BackOfficeADMIN
//USEUNIT BackOfficeMAIN
//USEUNIT BackOfficeSQL
//USEUNIT CommonMAIN
//USEUNIT PortalINT
//USEUNIT PortalMAIN
//USEUNIT PortalSQL

/***************************************************************
Name: Profile_SUITE
Description: Automated test cases - Back Office Admin: Profile
Author: Kitt Random
Creation Date: 04/12/2022
***************************************************************/
function profSuiteLogin() {
  // login to back office as back office admin
  ProjectSuite.Variables.ActiveTestSuite = "Profile";
  BackOfficeMAIN.navigateBackOffice("profiles");
  CommonMAIN.sgbGetCurrentUser();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Super Admin")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }
}

// TC14964 > Profile: Role Permission - Admin User
function testCase_14964() {
  BackOfficeADMIN.verifyUserBtn();
}

// TC14965 > Profile: Role Permission - Admin Password
function testCase_14965() {
  BackOfficeADMIN.adminPortalProfile("Users", "Password Reset");
}

// TC14972 > Profile: Role Permission - User
function testCase_14972() {
  BackOfficeADMIN.adminPortalProfile("Users", "Permissions");
}

// TC14973 > Profile: Role Permission - Add User
function testCase_14973() {
  BackOfficeADMIN.adminPortalProfile("Users", "New");
}

// TC14974 > Profile: Role Permission - Add BO User
function testCase_14974() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Back Office Admin")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // verify new user as BO admin
  BackOfficeADMIN.adminPortalProfile("Users", "New");
}

// TC14975 > Profile: Role Permission - Add Account
function testCase_14975() {
  BackOfficeADMIN.adminPortalProfile("Accounts", "Edit");
}

// TC14976 > Profile: Role Permission - Trader
function testCase_14976() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchToBackOfficeTrader();
  }

  // verify new profile button disabled
  if (
    equal(
      Sys.Browser("*")
        .Page("*")
        .WaitElement("//button[contains(text(),'New Profile')]", 0).Exists,
      false,
    )
  ) {
    Log.Checkpoint(
      "| New Profile Button Disabled | user - " +
        ProjectSuite.Variables.ActiveUserType,
    );
  }
}

// TC14977 > Profile: Role Permission - Super Admin
function testCase_14977() {
  Log.Checkpoint(
    "FYI: This test did not run and requires an update. Please test manually.",
  );
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Super Admin")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  // start profile activation
  BackOfficeADMIN.adminNewProfile("Verify");

  // exit activation
  page.FindElement("//i[contains(text(),'close')]").Click();
  var ruSure = page.FindElement("//div[contains(text(),'Exit Setup')]");
  ruSure.Click();
}

// TC14978 > Profile: Role Permission - BO User
function testCase_14978() {
  Log.Checkpoint(
    "FYI: This test did not run and requires an update. Please test manually.",
  );
  //  // refresh test data
  //  CommonMAIN.sgbRefresh();
  //  if (!equal(ProjectSuite.Variables.ActiveUserType, "Back Office Admin")) {
  //    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  //  }
  //
  //  // start profile activation
  //  BackOfficeADMIN.adminNewProfile("Verify");
  //
  //  // exit activation
  //  page.FindElement("//i[contains(text(),'close')]").Click();
  //  var ruSure = page.FindElement("//div[contains(text(),'Exit Setup')]");
  //  ruSure.Click();
}

// TC14979 > Profile: Role Permission - FO User
function testCase_14979() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  BackOfficeMAIN.navigateBackOffice("profiles");
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Front Office Admin")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeFO();
  }

  // verify new profile button disabled
  if (
    equal(
      Sys.Browser("*")
        .Page("*")
        .WaitElement("//button[contains(text(),'New Profile')]", 0).Exists,
      false,
    )
  ) {
    Log.Checkpoint(
      "| New Profile Button Disabled | user - " +
        ProjectSuite.Variables.ActiveUserType,
    );
  }
}

// TC14992 > Profile: New Profile Button
function testCase_14992() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchToBackOfficeTrader();
  }

  // verify no button as trader
  BackOfficeADMIN.verifyProfileBtn();

  // switch profiles and deny requests
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.verifyProfileBtn();
}

// TC14993 > Profile: Verify New Profile
function testCase_14993() {
  Log.Checkpoint(
    "FYI: This test did not run and requires an update. Please test manually.",
  );
  //  // refresh test data
  //  CommonMAIN.sgbRefresh();
  //  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
  //    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  //  }
  //
  //  // start profile activation
  //  BackOfficeADMIN.adminNewProfile("Verify");
  //
  //  // exit activation
  //  page.FindElement("//i[contains(text(),'close')]").Click();
  //  var ruSure = page.FindElement("//div[contains(text(),'Exit Setup')]");
  //  ruSure.Click();
}

// TC14994 > Profile: Pending Profile
function testCase_14994() {
  Log.Checkpoint(
    "FYI: This test did not run and requires an update. Please test manually.",
  );
  //  // refresh test data
  //  CommonMAIN.sgbRefresh();
  //
  //  // start profile activation
  //  BackOfficeADMIN.adminNewProfile("New");
  //  BackOfficeADMIN.adminNewProfileActivation();
  //
  //  // switch profiles and deny request
  //  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  //  BackOfficeADMIN.adminApprovalAction("Profiles", "Pending", 0.1);
  //  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", 0.1);
}

// TC14995 > Profile: Pending Profile Permissions to Services
function testCase_14995() {
  Log.Checkpoint(
    "FYI: This test did not run and requires an update. Please test manually.",
  );
  //  // refresh test data
  //  CommonMAIN.sgbRefresh();
  //
  //  // edit profile services
  //  BackOfficeADMIN.adminNewProfile("New");
  //
  //  // switch profiles and deny request
  //  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  //  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", 0.1);
}

// TC14996 > Profile: Deny Profile Activation
function testCase_14996() {
  Log.Checkpoint(
    "FYI: This test did not run and requires an update. Please test manually.",
  );
  //  // refresh test data
  //  CommonMAIN.sgbRefresh();
  //
  //  // start profile activation
  //  BackOfficeADMIN.adminNewProfile("New");
  //
  //  // switch profiles and deny request
  //  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  //  BackOfficeADMIN.adminApprovalAction("Profiles", "Deny", 0.1);
}

// TC14997 > Profile: Approve Profile Activation
function testCase_14997() {
  Log.Checkpoint(
    "FYI: This test did not run and requires an update. Please test manually.",
  );
  //  // refresh test data
  //  CommonMAIN.sgbRefresh();
  //
  //  // start profile activation
  //  BackOfficeADMIN.adminNewProfile("New");
  //
  //  // switch profiles and deny request
  //  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  //  BackOfficeADMIN.adminApprovalAction("Profiles", "Activate", 0);
  //
  //  // approve activation
  //  BackOfficeADMIN.adminNewProfileActivation();
}

// TC15012 > Profile: Available Services
function testCase_15012() {
  BackOfficeADMIN.adminPortalProfile("Accounts", "Edit");
}

// TC15013 > Profile: Enable Global USD Services - Profile
function testCase_15013() {
  BackOfficeADMIN.adminPortalProfile("Accounts", "Verify");
}

// TC15014 > Profile: Enable Global USD Services - Users
function testCase_15014() {
  BackOfficeADMIN.adminPortalProfile("Accounts", "Verify");
}

// TC15015 > Profile: Enable Global USD Services - Accounts
function testCase_15015() {
  BackOfficeADMIN.adminPortalProfile("Accounts", "Verify");
}

// TC15016 > Profile: Enable Global USD Services - Subscriptions
function testCase_15016() {
  BackOfficeADMIN.adminPortalProfile("Accounts", "Verify");
}

// TC15017 > Profile: Currency Group - View Existing
function testCase_15017() {
  BackOfficeADMIN.adminPortalProfile("Accounts", "Verify");
}

// TC15018 > Profile: Currency Group - Change Existing
function testCase_15018() {
  BackOfficeADMIN.adminPortalProfile("Accounts", "Verify");
}

// TC25288 > Profile: Role Permission - FO User
function testCase_25288() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  BackOfficeMAIN.navigateBackOffice("profiles");
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Front Office Admin")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeFO();
  }

  // verify new profile button disabled
  if (
    equal(
      Sys.Browser("*")
        .Page("*")
        .WaitElement("//button[contains(text(),'New Profile')]", 0).Exists,
      false,
    )
  ) {
    Log.Checkpoint(
      "| New Profile Button Disabled | user - " +
        ProjectSuite.Variables.ActiveUserType,
    );
  }
}

function profSuiteLogout() {
  // refresh test data for logout
  CommonMAIN.sgbRefresh();
}
