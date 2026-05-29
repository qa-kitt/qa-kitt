//USEUNIT CommonMAIN
//USEUNIT PortalFX
//USEUNIT PortalMAIN

/***************************************************************
Name: PortalPAY
Description: Verifying Portal USD/Foreign Currency Payments Service
Author: Kitt Random
Creation Date: 10/21/2021
***************************************************************/
function payRequestTransfer(condition) {
  var page = Sys.Browser("*").Page("*");
  // navigate to portal and map page
  PortalMAIN.navigatePortal("Home");
  page.WaitElement("//nav/div[@class='sidebar-content']");

  // set menu variables
  var limit = condition;
  var paymentsMenu = page.FindElement("//a[@name='sidenav-transfers']");
  var servType = ProjectSuite.Variables.ServiceType;

  // open transfers submenu and select payment
  paymentsMenu.Click();
  var intTran = page.FindElement("//button[@name='sidenav-transfers-payment']");
  intTran.Click();

  // define payment transfer elements
  var toPath = "//div[@class='transfer-to']";
  var fromPath = "//div[@class='transfer-from']";
  var xClass = "//div[@class='blazored-typeahead__controls']";

  // acct type handler
  PortalSQL.getRandomTransferAccount("USD");
  Log.Message("LOG: account currency = USD");

  // send FROM
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

  // select TO:
  if (equal(ProjectSuite.Variables.TradeTo, ProjectSuite.Variables.TradeFrom)) {
    ProjectSuite.Variables.TradeTo =
      PortalSQL.getRandomTransferAccount(servType);
  }
  ProjectSuite.Variables.TradeTo = PortalSQL.getRandomTransferAccount(servType);
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

  // select random amount
  var senAmount = page.FindElement("//input[@id='amount']");
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

  // continue payment
  var cont = page.FindElement("//button[contains(text(),'Continue')]");
  cont.Click();
  PortalFX.addBeneficiary(limit);
}

function payReportHistorySearch(search, find) {
  // map search object
  var page = Sys.Browser("*").Page("*");
  var reportHistorySearch = page.WaitElement(
    "//div[@class='search-box']/input[1]",
  );

  // set default date range to 7 days
  var reportHistoryDates = page.WaitElement(
    "//i[contains(text(),'date_range')]",
  );
  reportHistoryDates.Click();
  var dateRange7 = page.WaitElement("//button[.='Last 7 Days']");
  dateRange7.Click();
  page.WaitElement("//table[1]");

  // verify search
  switch (search) {
    // default
    case 1:
      Log.Checkpoint("| Search Option Available |");
      break;

    case "Test":
      reportHistorySearch.SetText("taco tuesday");
      page.WaitElement("//div[contains(text(),'No trades to show.')]");
      Log.Checkpoint("| Negative Test | - Search Filter Tested");
      reportHistorySearch.SetText("");
      break;

    case "Find":
      reportHistorySearch.SetText(find);
      page.WaitElement("//td[contains(text(),'" + find + "')]");
      Log.Checkpoint("| Transaction Found | - " + find);
      reportHistorySearch.SetText("");
      break;
  }
}
