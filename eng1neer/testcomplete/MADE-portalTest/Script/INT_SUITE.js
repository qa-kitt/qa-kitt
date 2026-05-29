//USEUNIT BackOfficeMAIN
//USEUNIT BackOfficeSQL
//USEUNIT CommonDDT
//USEUNIT CommonMAIN
//USEUNIT CommonSQL
//USEUNIT PortalMAIN
//USEUNIT PortalINT
//USEUNIT PortalSQL

/***************************************************************
Name: Int_SUITE
Description: Automated test cases - Portal: INT Transfers
Author: Kitt Random
Creation Date: 03/21/2022
***************************************************************/

function intSuiteLogin() {
  // login to portal as trader
  ProjectSuite.Variables.ActiveTestSuite = "INT";
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    PortalMAIN.loginPortalTrader();
  }
}

// TC15268 > Verify INT Transfer USD>USD - STP
function testCase_15268() {
  // set sen transaction type
  ProjectSuite.Variables.ServiceType = "Internal Transfer";
  ProjectSuite.Variables.TransactionType = "Transfer";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // request transfer
  PortalINT.intRequestTransfer("USD");
}

function intSuiteLogout() {
  // refresh test data for logout
  CommonMAIN.sgbRefresh();
}
