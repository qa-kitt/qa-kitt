//USEUNIT CommonMAIN
//USEUNIT PortalMAIN

/***************************************************************
Name: PortalSEN
Description: Verifying Portal SEN Transfers Service
Author: Kitt Random
Creation Date: 10/21/2021
***************************************************************/
function senRequestTransfer(condition) {
  // navigate to portal and map page
  var page = Sys.Browser("*").Page("*");
  PortalMAIN.navigatePortal("Home");
  //page.WaitElement("//nav/div[@class='sidebar-content']");

  // set menu variables
  var limit = condition;
  var senMenu = page.FindElement("//a[@name='sidenav-transfers']");
  var transType = ProjectSuite.Variables.TransactionType;

  // open transfers submenu and select sen
  senMenu.Click();
  var intTran = page.FindElement("//button[@name='sidenav-transfers-sen']");
  intTran.Click();

  // define sen transfer elements
  var toPath = "//div[@class='transfer-to']";
  var fromPath = "//div[@class='transfer-from']";
  var xClass = "//div[@class='blazored-typeahead__controls']";

  // send FROM
  Log.Message("FROM: " + ProjectSuite.Variables.ProfileAccountAlias);
  var sendFrom = page.FindElement(
    fromPath + xClass + "/div[contains(., 'Select an account')]",
  );
  sendFrom.DblClick();
  var fromName = page.FindElement(
    fromPath +
      "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
      ProjectSuite.Variables.ProfileAccountAlias +
      "')]",
  );
  fromName.Click();

  // select TO envt handling:
  switch (ProjectSuite.Variables.Environment) {
    case "QA":
      ProjectSuite.Variables.TradeTo = CommonSQL.sqlQueryOne(
        "SELECT TOP 1 [Name] FROM [LegalEntity] WHERE [LegalEntityId] IN (5) ORDER BY NEWID()",
      ); // 16 = Golden Ticket Inc
      break;
    case "STG":
      ProjectSuite.Variables.TradeTo = CommonSQL.sqlQueryOne(
        "SELECT TOP 1 [Name] FROM [LegalEntity] WHERE [LegalEntityId] IN (4, 24) ORDER BY NEWID()",
      );
      break;
  }
  Log.Message("TO: " + ProjectSuite.Variables.TradeTo);
  var sendTo = page.FindElement(
    toPath + xClass + "/div[contains(., 'Select an account')]",
  );
  sendTo.DblClick();
  var toName = page.FindElement(
    toPath +
      "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
      ProjectSuite.Variables.TradeTo +
      "')]",
  );
  toName.Click();

  // get user entitlements
  BackOfficeSQL.sqlGetUserLimit();

  //  // EUR handler
  //  if (equal(ProjectSuite.Variables.Currency1, "EUR")) {
  //    ProjectSuite.Variables.ProfileAccountAlias = PortalSQL.getRandomTransferAccount("Transfer");
  //  }

  // select random amount
  var senAmount = page.FindElement("//input[@id='amount']");
  Log.Message("LOG: " + limit);
  switch (limit) {
    // default
    case 1:
      ProjectSuite.Variables.DynamicVarInt = CommonMAIN.getRandomInteger();
      break;
    case "Over Limit":
      var limitMin = Math.max(
        ProjectSuite.Variables.limitDaily,
        ProjectSuite.Variables.limitTransaction,
      );
      var limitMax = Math.abs(limitMin * CommonMAIN.getRandomInteger());
      Log.Message("LOG: min - " + limitMin + " | max - " + limitMax);
      ProjectSuite.Variables.DynamicVarInt = CommonMAIN.getRandomInteger(
        limitMin,
        limitMax,
      );
      break;
    case "Limit Test":
      ProjectSuite.Variables.DynamicVarInt = CommonMAIN.getRandomInteger();
      break;
  }
  senAmount.SetText(ProjectSuite.Variables.DynamicVarInt);

  // submit sen transfer
  var submit = page.FindElement("//button[contains(text(),'Submit')]");
  submit.Click();
  PortalMAIN.limitHandler(limit);
}
