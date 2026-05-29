Given("The {arg} is logged into Portal", function (param1, param2){ 
  ProjectSuite.Variables.ActiveUserType = param1;
  switch (param1) {
    case "Trader":
        PortalMAIN.loginPortalTrader();
      break;
    case "Super Admin":
        PortalMAIN.loginPortalAdmin();
      break;
    case "Front Office":
        PortalMAIN.loginPortalFO();
      break;
    case "Back Office Admin":
        PortalMAIN.loginPortalBOA();
      break;
  }
});

Given("The user requires {arg} approval for {arg} and {arg}", function (param1, param2, param3){
  ProjectSuite.Variables.ServiceType = param2; // service
  ProjectSuite.Variables.TransactionType = param3; // subservice
  PortalSQL.sqlSetUserApprovalPermissions(param1); // permission
});

When("The user submits a valid {arg} transaction", function (param1){
  switch (param1) {
    case "Payment":
      PortalPAY.payRequestTransfer(1);
      break;
    case "FX Trade Execution":
      PortalFX.fxRequestQuote(1);
      PortalFX.fxQuoteHandler("Accept", 1);
      PortalFX.fxTradeConfirmation();
      PortalFX.fxTradeExecutionDB(); 
      break;
    case "SEN Transfer":
      PortalSEN.senRequestTransfer(1);
      break;
    case "Internal Transfer":
      PortalINT.intRequestTransfer(1); 
      break;
  }
});

Then("The user should receive a {arg}", function (param1){
  PortalMAIN.mainMessageHandler(param1);
});

Then("The payment can be verified", function (){
  Project.Variables.fxPaymentID = PortalSQL.sqlGetRandomPaymentId();
  PortalFX.fxReportHistorySearch("Find", Project.Variables.fxPaymentID);
});