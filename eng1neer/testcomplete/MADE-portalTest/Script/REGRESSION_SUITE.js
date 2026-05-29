//USEUNIT BackOfficeMAIN
//USEUNIT BackOfficeSQL
//USEUNIT CommonDDT
//USEUNIT CommonMAIN
//USEUNIT CommonSQL
//USEUNIT PortalFX
//USEUNIT PortalINT
//USEUNIT PortalMAIN
//USEUNIT PortalPAY
//USEUNIT PortalSQL
//USEUNIT PortalSEN

/***************************************************************
Name: RegressionSUITE
Description: Automated test cases - Portal E2E Regression
Author: Kitt Random
Creation Date: 12/09/2021
***************************************************************/

// TC13721 > Regression Test: Verify Portal User
function regressionTest_13721() {
  // login to back office as back office admin
  ProjectSuite.Variables.ActiveTestSuite = "Regression";
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    PortalMAIN.loginPortalTrader();
  }
}

// TC15822 > Regression Test: Verify Portal Logout
function regressionTest_15822() {
  // logout and login
  CommonMAIN.sgbLogout();
  PortalMAIN.loginPortalTrader();
}

// TC13724 > Regression Test: Verify Account Wallets
function regressionTest_13724() {
  // verify account wallets
  PortalMAIN.navigatePortal("Home");
}

// TC13454 > Regression Test: SEN Enabled Connections
function regressionTest_13454() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // open profile admin
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminProfileNavigation("Services");

  // verify sen service
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // request transfer > new limit
  PortalSEN.senRequestTransfer(1);
}

// TC14956 > Regression Test: SEN Transfer Eligibility
function regressionTest_14956() {
  // refresh test data
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // open profile admin
  BackOfficeMAIN.sgbSwitchBackOfficeUser();
  BackOfficeADMIN.adminProfileNavigation("Services");

  // verify sen service
  BackOfficeADMIN.adminVerifyProfileServices("Transaction Limit", 1, "Save");

  // request transfer > new limit
  PortalSEN.senRequestTransfer(1);
}

// TC16214 > Regression Test: INT Transfer USD > USD
function regressionTest_16214() {
  // set internal transaction type
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // request transfer
  PortalMAIN.sgbSwitchToPortalTrader();
  PortalINT.intRequestTransfer(1);
}

// TC16215 > Regression Test: SEN Transfer USD > USD
function regressionTest_16215() {
  // set sen transaction type
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // request transfer
  PortalSEN.senRequestTransfer(1);
}

// TC16216 > Regression Test: SEN Transfer USD > USD w/Approval Limit
function regressionTest_16216() {
  // set sen transaction type
  ProjectSuite.Variables.ServiceType = "SEN Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // request transfer
  PortalSQL.sqlSetUserLimit("Transaction", "0.99");
  PortalSEN.senRequestTransfer("Limit Test");
}

// TC15397 > Regression Test: Search for Trade
function regressionTest_15397() {
  // refresh test data
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // open trade history
  PortalMAIN.navigatePortal("Trades");

  // verify trade history - search
  Project.Variables.fxTradeNumber = PortalSQL.sqlGetRandomTradeId();
  PortalFX.fxReportHistorySearch("Find", Project.Variables.fxTradeNumber);
}

// TC15398 > Regression Test: Add Beneficiary
function regressionTest_15398() {
  // refresh test data and account
  CommonMAIN.sgbRefresh();

  // add post payment beneficiary
  PortalFX.addPostPaymentBeneficiary();
}

// TC6447 > Regression Test: Verify Profile Connections
function regressionTest_6447() {
  // set payment transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // verify profile connection permissions
  PortalMAIN.navigatePortal("Connections");
  PortalMAIN.portalConnections("Verify");
}

// TC6471 > Regression Test: Add New 3rd Party Contact > Not Permissioned
function regressionTest_6471() {
  // set payment transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // update current user's connection permissions
  BackOfficeSQL.sqlSetUserConnectionPermission(2); // 2 = edit existing

  // verify profile connection permissions
  PortalMAIN.navigatePortal("Connections");
  PortalMAIN.portalConnections("Verify");

  // set user connection permission to default
  BackOfficeSQL.sqlSetUserConnectionPermission(3); // 3 = add new and edit existing
}

// TC6476 > Regression Test: Edit Existing 3rd Party Contact > Not Permissioned
function regressionTest_6476() {
  // set payment transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // update current user's connection permissions
  BackOfficeSQL.sqlSetUserConnectionPermission(1); // 1 = add new

  // verify profile connection permissions
  PortalMAIN.navigatePortal("Connections");
  PortalMAIN.portalConnections("Verify");

  // set user connection permission to default
  BackOfficeSQL.sqlSetUserConnectionPermission(3); // 3 = add new and edit existing
}

// TC6477 > Regression Test: Delete Existing 3rd Party Contact > Not Permissioned
function regressionTest_6477() {
  // set payment transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // update current user's connection permissions
  BackOfficeSQL.sqlSetUserConnectionPermission(0); // 0 = none

  // verify profile connection permissions
  PortalMAIN.navigatePortal("Connections");
  PortalMAIN.portalConnections("Verify");

  // set user connection permission to default
  BackOfficeSQL.sqlSetUserConnectionPermission(3); // 3 = add new and edit existing
}

// TC7881 > Regression Test: Verify Service Level Approval Requirements
function regressionTest_7881() {
  // set int transaction type
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // login as admin and refresh test data
  BackOfficeMAIN.sgbSwitchBackOfficeUser("Back Office Admin");
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // verify profile service approval requirements
  BackOfficeADMIN.adminProfileNavigation("Services");
  BackOfficeADMIN.adminVerifyProfileServices("Approval", "", "");
}

// TC11186 > Regression Test: Verify Profile Notational and Wallet Cards
function regressionTest_18692() {
  PortalMAIN.navigatePortal("Home");
  PortalMAIN.portalWallet();
}

// TC18198 > Regression Test: Stage for Clean-up
function regressionTest_18198() {
  // refresh test data for logout
  CommonMAIN.sgbRefresh();
}
