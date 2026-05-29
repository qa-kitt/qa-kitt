//USEUNIT CommonDDT
//USEUNIT CommonSQL
//USEUNIT PortalSQL

/***************************************************************
Name: BackOffice
Description: General Back Office functions
Author: Kitt Random
Creation Date: 09/02/2021
***************************************************************/

function loginBackOfficeTrader() {
  ProjectSuite.Variables.Site = "Back Office";
  ProjectSuite.Variables.ActiveUserType = "Trader";
  CommonMAIN.sgbLogin(
    ProjectSuite.Variables.Environment,
    ProjectSuite.Variables.Site,
    ProjectSuite.Variables.TraderUser,
    ProjectSuite.Variables.TraderPass,
  );
  Log.Message("LOG: account type - " + ProjectSuite.Variables.ActiveUserType);
  Log.Checkpoint(
    "| Successful Back Office Login | - " +
      ProjectSuite.Variables.Environment +
      " as " +
      ProjectSuite.Variables.TraderUser,
  );
}

function loginBackOfficeBOA() {
  ProjectSuite.Variables.Site = "Back Office";
  ProjectSuite.Variables.ActiveUserType = "Back Office Admin";
  CommonMAIN.sgbLogin(
    ProjectSuite.Variables.Environment,
    ProjectSuite.Variables.Site,
    ProjectSuite.Variables.BackOfficeUser,
    ProjectSuite.Variables.BackOfficePass,
  );
  Log.Message("LOG: account type - " + ProjectSuite.Variables.ActiveUserType);
  Log.Checkpoint(
    "| Successful Back Office Login | - " +
      ProjectSuite.Variables.Environment +
      " as " +
      ProjectSuite.Variables.BackOfficeUser,
  );
}

function loginBackOfficeFO() {
  ProjectSuite.Variables.Site = "Back Office";
  ProjectSuite.Variables.ActiveUserType = "Front Office Admin";
  CommonMAIN.sgbLogin(
    ProjectSuite.Variables.Environment,
    ProjectSuite.Variables.Site,
    ProjectSuite.Variables.FrontOfficeUser,
    ProjectSuite.Variables.FrontOfficePass,
  );
  Log.Message("LOG: account type - " + ProjectSuite.Variables.ActiveUserType);
  Log.Checkpoint(
    "| Successful Front Office Login | - " +
      ProjectSuite.Variables.Environment +
      " as " +
      ProjectSuite.Variables.FrontOfficeUser,
  );
}

function loginBackOfficeAdmin() {
  ProjectSuite.Variables.Site = "Back Office";
  ProjectSuite.Variables.ActiveUserType = "Super Admin";
  CommonMAIN.sgbLogin(
    ProjectSuite.Variables.Environment,
    ProjectSuite.Variables.Site,
    ProjectSuite.Variables.AdminUser,
    ProjectSuite.Variables.AdminPass,
  );
  Log.Message("LOG: account type - " + ProjectSuite.Variables.ActiveUserType);
  Log.Checkpoint(
    "| Successful Back Office Login | - " +
      ProjectSuite.Variables.Environment +
      " as " +
      ProjectSuite.Variables.AdminUser,
  );
}

function navigateBackOffice(urlPage) {
  switch (ProjectSuite.Variables.Environment) {
    case "QA":
      var urlDomain = ProjectSuite.Variables.urlBackOfficeQA;
      break;
    case "STG":
      var urlDomain = ProjectSuite.Variables.urlBackOfficeSTG;
      break;
  }
  Sys.Browser("*")
    .Page("*")
    .ToUrl(urlDomain + urlPage);
}

function sgbSwitchBackOfficeUser() {
  // get current user
  BackOfficeMAIN.navigateBackOffice("profiles");
  CommonMAIN.sgbGetCurrentUser();

  // log out
  CommonMAIN.sgbLogout();

  // log in with admin user
  switch (ProjectSuite.Variables.ActiveUserType) {
    case "Super Admin":
      BackOfficeMAIN.loginBackOfficeBOA();
      break;
    case "Back Office Admin":
      BackOfficeMAIN.loginBackOfficeAdmin();
      break;
    case "Front Office Admin":
      BackOfficeMAIN.loginBackOfficeAdmin();
      break;
    case "Trader":
      BackOfficeMAIN.loginBackOfficeAdmin();
      break;
  }
}

function sgbSwitchToBackOfficeTrader() {
  CommonMAIN.sgbGetCurrentUser();
  BackOfficeMAIN.navigateBackOffice("profiles");
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    BackOfficeMAIN.loginBackOfficeTrader();
  }
}
