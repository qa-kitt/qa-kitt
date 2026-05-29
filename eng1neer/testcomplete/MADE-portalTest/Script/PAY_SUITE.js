//USEUNIT BackOfficeMAIN
//USEUNIT BackOfficeSQL
//USEUNIT CommonDDT
//USEUNIT CommonMAIN
//USEUNIT CommonSQL
//USEUNIT PortalMAIN
//USEUNIT PortalPAY
//USEUNIT PortalSQL

/***************************************************************
Name: Pay_SUITE
Description: Automated test cases - Portal: PAY Transfers
Author: Kitt Random
Creation Date: 03/21/2022
***************************************************************/

function paySuiteLogin() {
  // login to portal as trader
  ProjectSuite.Variables.ActiveTestSuite = "PAY";
  CommonMAIN.sgbRefresh();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    PortalMAIN.loginPortalTrader();
  }
}

// TC15567 > Verify Payments Reporting
function testCase_15564() {
  // refresh test data
  CommonMAIN.sgbRefresh();

  // open payment history
  PortalMAIN.navigatePortal("Payments");

  // verify payment history - search
  Project.Variables.paymentID = PortalSQL.sqlGetRandomPaymentId();
  PortalPAY.payReportHistorySearch("Find", Project.Variables.paymentID);
}

// TC16218 > Verify FC Payment - STP
function testCase_16218() {
  // set fc transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // request foreign currency transfer
  PortalPAY.payRequestTransfer(1);
}

// TC16219 > Verify FC Payment - 1 Approval
function testCase_16219() {
  // set fc transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // change TC4 user's approval permissions to required
  PortalSQL.sqlSetUserApprovalPermissions(1);

  // request foreign currency transfer - approval required
  PortalPAY.payRequestTransfer(1);
}

// TC16219 > Verify FC Payment - 2 Approval
function testCase_16220() {
  // set fc transaction type
  ProjectSuite.Variables.ServiceType = "Payment";
  ProjectSuite.Variables.TransactionType = "Foreign Currency Payment";

  // refresh test data and account
  CommonMAIN.sgbRefresh();
  CommonMAIN.sgbTestAccount();

  // change TC4 user's approval permissions to required
  PortalSQL.sqlSetUserApprovalPermissions(2);

  // request foreign currency transfer - approval required
  PortalPAY.payRequestTransfer(2);
}

function paySuiteLogout() {
  // refresh test data for logout
  CommonMAIN.sgbRefresh();
}
