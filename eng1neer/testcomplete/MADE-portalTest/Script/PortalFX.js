//USEUNIT BackOfficeADMIN
//USEUNIT BackOfficeSQL
//USEUNIT CommonMAIN
//USEUNIT PortalMAIN

/***************************************************************
Name: PortalFx
Description: Verifying Portal FX Trade Execution Service
Author: Kitt Random
Creation Date: 09/16/2021
***************************************************************/
function fxRequestQuote(condition) {
  // map page
  var page = Sys.Browser("*").Page("*");
  var limit = condition;
  page.WaitElement("//nav/div[@class='sidebar-content']");

  // set menu variables
  var transfersMenu = page.FindElement("//a[@name='sidenav-transfers']");
  var tradeType = ProjectSuite.Variables.TransactionType;

  // open transfers submenu and select fx
  transfersMenu.Click();
  var fxTran = page.FindElement("//button[@name='sidenav-transfers-fx']");
  fxTran.Click();

  // define fx quote elements
  var toPath = "//div[@class='transfer-to']";
  var fromPath = "//div[@class='transfer-from']";
  var xClass = "//div[@class='blazored-typeahead__controls']";

  // get user entitlements
  BackOfficeSQL.sqlGetUserLimit();

  // fx quote information handler
  Log.Message("LOG: trade type - " + tradeType);
  switch (tradeType) {
    case "Disabled":
      page.FindElement(
        "//h6[contains(text(),'The FX Quoting Service is unavailable at this time')]",
      );
      Log.Checkpoint("| Quoting Disabled |");
      CommonMAIN.sgbCloseAction();
      Runner.Stop(true);
      break;

    case "Inbound":
      // select FROM:
      ProjectSuite.Variables.TradeFrom =
        PortalSQL.getRandomTransferAccount(tradeType);
      var sendFrom = page.FindElement(
        fromPath + "//div[text()='Select an account']",
      ); //input[@id=(//label[.='Sending From']/@for)]
      sendFrom.DblClick();
      var fromName = page.FindElement(
        fromPath +
          "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
          ProjectSuite.Variables.TradeFrom +
          "')]",
      );
      fromName.Click();

      // External and EUR handler
      if (
        !equal(ProjectSuite.Variables.TradeFrom, "Send from External Account")
      ) {
        switch (ProjectSuite.Variables.Currency1) {
          case "EUR":
            ProjectSuite.Variables.ProfileAccountAlias =
              PortalSQL.getRandomTransferAccount("Transfer");
            break;
          case "USD":
            PortalSQL.getRandomCurrencyType();
            break;
        }
      }

      // select TO:
      var sendTo = page.FindElement(
        toPath + "//div[text()='Select an account']",
      ); //input[@id=(//label[.='Sending To']/@for)]
      sendTo.DblClick();
      var toName = page.FindElement(
        toPath +
          "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
          ProjectSuite.Variables.ProfileAccountAlias +
          "')]",
      );
      toName.Click();

      // select currency
      var currency = page.FindElement(
        fromPath + xClass + "/div[contains(., 'Select a currency')]",
      );
      currency.DblClick();
      var setCurrency = page.FindElement(
        fromPath +
          "//div[contains(text(), '" +
          ProjectSuite.Variables.Currency2 +
          "')]",
      );
      setCurrency.Click();

      // define amount
      Log.Message("LOG: limit test = " + limit);
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
          Log.Message("LOG: min = " + limitMin + " | max = " + limitMax);
          ProjectSuite.Variables.DynamicVarInt = CommonMAIN.getRandomInteger(
            limitMin,
            limitMax,
          );
          break;
        case "Limit Test":
          ProjectSuite.Variables.DynamicVarInt = CommonMAIN.getRandomInteger();
          break;
      }
      break;

    case "Outbound":
      // select FROM:
      var sendFrom = page.FindElement(
        fromPath + "//div[text()='Select an account']",
      ); //input[@id=(//label[.='Sending From']/@for)]
      sendFrom.DblClick();
      var fromName = page.FindElement(
        fromPath +
          "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
          ProjectSuite.Variables.ProfileAccountAlias +
          "')]",
      );
      fromName.Click();

      // define amount
      Log.Message("LOG: limit test = " + limit);
      switch (limit) {
        // default
        case 1:
          ProjectSuite.Variables.DynamicVarInt = CommonMAIN.getRandomInteger();
          ProjectSuite.Variables.TradeTo =
            PortalSQL.getRandomTransferAccount(tradeType);
          break;
        case "Over Limit":
          var limitMin = Math.max(
            ProjectSuite.Variables.limitDaily,
            ProjectSuite.Variables.limitTransaction,
          );
          var limitMax = Math.abs(limitMin * CommonMAIN.getRandomInteger());
          Log.Message("LOG: min = " + limitMin + " | max = " + limitMax);
          ProjectSuite.Variables.DynamicVarInt = CommonMAIN.getRandomInteger(
            limitMin,
            limitMax,
          );
          ProjectSuite.Variables.TradeTo =
            PortalSQL.getRandomTransferAccount(tradeType);
          break;
        case "Limit Test":
          ProjectSuite.Variables.DynamicVarInt = CommonMAIN.getRandomInteger();
          ProjectSuite.Variables.TradeTo =
            PortalSQL.getRandomTransferAccount(tradeType);
          break;
        case "Owned":
          ProjectSuite.Variables.TradeTo = "Send to Owned Account";
          break;
        case "3rdParty":
          ProjectSuite.Variables.TradeTo = "Send to Third Party";
          break;
        case "Crypto":
          ProjectSuite.Variables.TradeTo =
            "Send to Third Party (Crypto Settlement)";
          ProjectSuite.Variables.TransactionType = "Crypto";
          break;
        case "EUR":
          ProjectSuite.Variables.TradeTo =
            PortalSQL.getRandomTransferAccount(tradeType);
      }

      // select TO:
      var sendTo = page.FindElement(
        toPath + "//div[text()='Select an account']",
      ); //input[@id=(//label[.='Sending To']/@for)]
      sendTo.DblClick();
      var toName = page.FindElement(
        toPath +
          "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
          ProjectSuite.Variables.TradeTo +
          "')]",
      );
      toName.Click();

      // select currency
      PortalSQL.getRandomCurrencyType();
      switch (ProjectSuite.Variables.Currency1) {
        case "EUR":
          ProjectSuite.Variables.Currency2 = "USD";
          break;
      }
      var currency = page.FindElement(
        toPath + xClass + "/div[contains(., 'Select a currency')]",
      );
      currency.DblClick();
      var setCurrency = page.FindElement(
        toPath +
          "//div[contains(text(), '" +
          ProjectSuite.Variables.Currency2 +
          "')]",
      );
      setCurrency.Click();
      break;

    case "EUR>USD":
      // select FROM:
      ProjectSuite.Variables.Currency1 = "EUR";
      ProjectSuite.Variables.TradeFrom =
        PortalSQL.getRandomTransferAccount("Internal");
      var sendFrom = page.FindElement(
        fromPath + "//div[text()='Select an account']",
      ); //input[@id=(//label[.='Sending From']/@for)]
      sendFrom.DblClick();
      var fromName = page.FindElement(
        fromPath +
          "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
          ProjectSuite.Variables.TradeFrom +
          "')]",
      );
      fromName.Click();

      // select TO:
      ProjectSuite.Variables.Currency2 = "USD";
      ProjectSuite.Variables.TradeTo =
        PortalSQL.getRandomTransferAccount("Transfer");
      var sendTo = page.FindElement(
        toPath + "//div[text()='Select an account']",
      ); //input[@id=(//label[.='Sending To']/@for)]
      sendTo.DblClick();
      var toName = page.FindElement(
        toPath +
          "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
          ProjectSuite.Variables.TradeTo +
          "')]",
      );
      toName.Click();
      break;

    case "USD>EUR":
      // select FROM:
      ProjectSuite.Variables.Currency1 = "USD";
      ProjectSuite.Variables.TradeFrom =
        PortalSQL.getRandomTransferAccount("Internal");
      var sendFrom = page.FindElement(
        fromPath + "//div[text()='Select an account']",
      ); //input[@id=(//label[.='Sending From']/@for)]
      sendFrom.DblClick();
      var fromName = page.FindElement(
        fromPath +
          "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
          ProjectSuite.Variables.TradeFrom +
          "')]",
      );
      fromName.Click();

      // select TO:
      ProjectSuite.Variables.Currency2 = "EUR";
      ProjectSuite.Variables.TradeTo =
        PortalSQL.getRandomTransferAccount("Transfer");
      var sendTo = page.FindElement(
        toPath + "//div[text()='Select an account']",
      ); //input[@id=(//label[.='Sending To']/@for)]
      sendTo.DblClick();
      var toName = page.FindElement(
        toPath +
          "//div[@class='blazored-typeahead__results position-relative']/div[contains(., '" +
          ProjectSuite.Variables.TradeTo +
          "')]",
      );
      toName.Click();
      break;
  }

  // set currency amount
  var fromAmount = page.FindElement("//input[@id='amount-from']");
  var toAmount = page.FindElement("//input[@id='amount-to']");
  if (equal(tradeType, "Inbound")) {
    toAmount.SetText(ProjectSuite.Variables.DynamicVarInt);
  }
  if (equal(tradeType, "Outbound")) {
    fromAmount.SetText(ProjectSuite.Variables.DynamicVarInt);
  }
  if (equal(tradeType, "EUR>USD") || equal(limit != "USD>EUR")) {
    toAmount.SetText(ProjectSuite.Variables.DynamicVarInt);
  }

  // log pre-quote request
  Log.Checkpoint(
    "| Quote Info Entered | FROM: " +
      ProjectSuite.Variables.TradeFrom +
      " TO: " +
      ProjectSuite.Variables.TradeTo +
      " AMOUNT: " +
      ProjectSuite.Variables.DynamicVarInt +
      " CURRENCY: " +
      ProjectSuite.Variables.Currency2,
  );
}

function fxQuoteHandler(action, condition) {
  // map quote elements
  var page = Sys.Browser("*").Page("*");
  var quoteAction = action;
  var quoteCondition = condition;
  page
    .FindElement("//button[contains(text(), 'Request Quote')]")
    .WaitProperty("disabled", false);

  // timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();

  //request quote
  var requestQuote = page.FindElement("//button[.='Request Quote']");
  requestQuote.Click();
  Log.Checkpoint("| Quote Requested |");

  switch (quoteAction) {
    case "Accept":
      switch (quoteCondition) {
        // default
        case 1:
          // find post-quote request elements and save settlement date
          page
            .FindElement("//button[contains(text(), 'Accept Quote')]")
            .WaitProperty("disabled", false);
          var acceptQuote = page.FindElement("//button[.='Accept Quote']");
          var settlementDate = page.FindElement(
            "//input[@id='settlement-date']",
          );
          Project.Variables.fxSettlementDate = settlementDate.Text;

          // accept quote
          acceptQuote.Click();
          Log.Checkpoint("| Trade Quote Accepted |");
          break;

        case "Manual":
          // find post-quote request elements
          page.FindElement("//div[.='Waiting for Quote']");

          // transaction handling
          Log.Message(
            "LOG: trade execution setting - " +
              ProjectSuite.Variables.TradeExecution +
              " | transaction type - " +
              ProjectSuite.Variables.TransactionType,
          );
          if (equal(ProjectSuite.Variables.TradeExecution, 2)) {
            // verify trade disabled, log, and close
            page
              .FindElement("//button[contains(text(), 'Accept Quote')]")
              .WaitProperty("disabled", true);
            page.FindElement(
              "//h6[contains(text(), 'FX Trade Execution Service is unavailable')]",
            );
            Log.Checkpoint("| Negative Test: Trade Execution Disabled |");
            CommonMAIN.sgbCloseAction();
            BackOfficeADMIN.adminVerifyTradingDesk("Manual", "trades");
          } else {
            // verify manually
            BackOfficeADMIN.adminVerifyTradingDesk("Manual", "quotes");
          }
          break;

        case "Service Limit":
          // exceeded limit handling
          if (
            equal(
              page.WaitElement(
                "//h6[contains(text(), '" +
                  ProjectSuite.Variables.ServiceType +
                  " transaction limit for account') " +
                  "and contains(text(), 'has been exceeded')]",
              ).Exists,
              true,
            )
          ) {
            Log.Checkpoint("| Exceeded Limit Validation Successful |");
          } else {
            Log.Warning(
              "WARNING: limit not exceeded or not applied - review log for more info",
            );
          }
          CommonMAIN.sgbCloseAction();
          Runner.Stop(true);
          break;

        case "User Limit":
          // transaction limit handling
          if (
            equal(
              page.WaitElement(
                "//h6[contains(text(), 'transaction limit for account') " +
                  "and contains(text(), 'has been exceeded')]",
              ).Exists,
              true,
            )
          ) {
            Log.Checkpoint("| Negative Test: Transaction Limit Exceeded |");
            CommonMAIN.sgbCloseAction();
            break;
          }
          break;

        case "User Permissions":
          // transaction limit handling
          if (
            equal(
              page.WaitElement(
                "//h6[contains(text(), 'Contact your admin to have') " +
                  "and contains(text(), 'enabled')]",
              ).Exists,
              true,
            )
          ) {
            Log.Checkpoint("| Negative Test: Permissions Disabled |");
            CommonMAIN.sgbCloseAction();
            break;
          }
          break;

        case "Account Permissions":
          // transaction limit handling
          if (
            equal(
              page.WaitElement(
                "//h6[contains(text(),'have fx trading enabled for this account')]",
              ).Exists,
              true,
            )
          ) {
            Log.Checkpoint("| Negative Test: Account Permissions Disabled |");
            CommonMAIN.sgbCloseAction();
            break;
          }
          break;
      }
      break;

    case "Cancel":
      // cancel quote
      var cancelQuote = page.FindElement(
        "//button[contains(text(),'Go Back')]",
      );
      cancelQuote.Click();
      Log.Checkpoint("| Trade Quote Cancelled |");
      CommonMAIN.sgbCloseAction();
      break;

    case "Expire":
      // quote 30s timeout
      CommonMAIN.wait(30);
      page.WaitElement("//h6[@class='text-center error-banner']");
      var expiredQuote = page.FindElement(
        "//h6[contains(text(),'Quote has expired')]",
      ).textContent;
      if (
        equal(aqString.ToUpper(expiredQuote), "QUOTE HAS EXPIRED") &&
        equal(acceptQuote.disabled, true)
      ) {
        Log.Checkpoint("| Trade Quote Cancelled |");
        CommonMAIN.sgbCloseAction();
      }
      CommonMAIN.sgbCloseAction();
      break;
  }
  stopWatch.Stop();
  Log.Checkpoint("| QUOTE VALIDATION SPEED | - " + stopWatch.ToString());
}

function fxTradeConfirmation() {
  // verify trade confirmation
  var page = Sys.Browser("*").Page("*");
  var tradeDate = page.FindElement(
    "//h6[contains(text(), 'Trade Date:')]",
  ).textContent;
  var tradeNumber = page.FindElement(
    "//h6[contains(text(), 'Trade ID:')]",
  ).textContent;

  // parse trade confirmation info
  Project.Variables.fxTradeDate = aqString.Replace(
    tradeDate,
    "Trade Date: ",
    "",
  );
  Project.Variables.fxTradeNumber = aqString.Replace(
    tradeNumber,
    "Trade ID: ",
    "",
  );

  Log.Checkpoint(
    "| Trade Info Captured | TRADE_DATE: " +
      Project.Variables.fxTradeDate +
      " TRADE_NUM: " +
      Project.Variables.fxTradeNumber +
      " SETTLEMENT_DATE: " +
      Project.Variables.fxSettlementDate,
  );

  // verify Print option
  var print = page.FindElement("//i[contains(text(),'print')]");
  if (equal(print.Exists, true)) {
    Log.Checkpoint("| Print Option Available |");

    // verify trade confirmation details
    switch (ProjectSuite.Variables.TransactionType) {
      case "Inbound":
        fxTradeConfirmationVerifyBene();
        break;
      case "Outbound":
        fxTradeConfirmationContinue();
        break;
      case "Crypto":
        fxTradeConfirmationContinue();
        break;
      case "EUR>USD":
        fxTradeConfirmationVerifyEU();
        break;
      case "USD>EUR":
        fxTradeConfirmationVerifyEU();
        break;
    }
  }
}

function fxTradeConfirmationVerifyBene() {
  // capture supporting trade confirmation info
  var page = Sys.Browser("*").Page("*");
  Log.Checkpoint("| Continue Option Unavailable |");
  var bankInfo = page.FindElement(
    "//table[contains(., 'Beneficiary Bank:')]",
  ).contentText;
  var banInfo = page.FindElement(
    "//table[contains(., 'Beneficiary Account Number:')]",
  ).contentText;
  page.FindElement(
    "//label[contains(.,'" + Project.Variables.fxSettlementDate + "')]",
  );
  Log.Checkpoint(
    "| Bank Info = " +
      aqString.Replace(
        aqString.Replace(bankInfo, ":", ": "),
        "SWIFT",
        " SWIFT",
      ) +
      " | Bank Account Info = " +
      aqString.Replace(
        aqString.Replace(banInfo, ":", ": "),
        "Beneficiary:",
        " Beneficiary:",
      ) +
      " | Settlement Date = " +
      Project.Variables.fxSettlementDate,
  );
  CommonMAIN.sgbCloseAction();
}

function fxTradeConfirmationVerifyEU() {
  // capture supporting trade confirmation info
  var page = Sys.Browser("*").Page("*");
  Log.Checkpoint("| Continue Option Unavailable |");
  var tradeDate = page.FindElement(
    "//h6[contains(., 'Trade Date:')]",
  ).contentText;
  var paymentID = page.FindElement(
    "//h6[contains(., 'Payment ID:')]",
  ).contentText;
  Log.Checkpoint(
    "| Trade Date = " +
      aqString.Replace(
        aqString.Replace(tradeDate, ":", ": "),
        "Trade Date:",
        " Trade Date:",
      ) +
      " | Payment ID = " +
      aqString.Replace(
        aqString.Replace(paymentID, ":", ": "),
        "Payment ID:",
        " Payment ID:",
      ) +
      " | From = " +
      ProjectSuite.Variables.TradeFrom +
      " | To = " +
      ProjectSuite.Variables.TradeTo,
  );
  CommonMAIN.sgbCloseAction();
}

function fxTradeConfirmationContinue() {
  // verify Continue option for outbound & crypto trades
  var page = Sys.Browser("*").Page("*");
  Log.Checkpoint("| Continue To Beneficiary Info |");
  var contButton = page.FindElement("//button[contains(text(),'Continue')]");
  contButton.Click();
  PortalFX.addBeneficiary();
  page.WaitElement(
    "//div[@class='main']/div[@class='content']/div[contains(@class, 'normal-row')]",
  );
}

function fxTradeExecutionDB() {
  var page = Sys.Browser("*").Page("*");
  var dbTradeNum = PortalSQL.sqlGetTradeExecutionData("SierraTradeId");
  if (equal(dbTradeNum, Project.Variables.fxTradeNumber)) {
    Log.Checkpoint("| Trade ID Found |");
  } else {
    Log.Warning("WARNING: tradeId " + dbTradeNum + " not found");
  }
}

function fxVerifyTradeHistory(verify) {
  // map trade history objects
  var page = Sys.Browser("*").Page("*");
  var tradeHistory = page.FindElement("//a[contains(text(),'Trades')]");
  var tradeHistoryDates = page.FindElement(
    "//i[contains(text(),'date_range')]",
  );
  var tradeHistorySearch = page.FindElement(
    "//div[@class='search-box']/input[1]",
  );
  var tradeHistoryHelp = page.FindElement("//i[contains(text(),'help')]");
  var tradeHistoryDownload = page.FindElement(
    "//i[contains(text(),'get_app')]",
  );
  var tradeHistoryPrint = page.FindElement("//i[contains(text(),'print')]");
  var tradeHistoryQuote = page.FindElement(
    "//button[contains(text(),'FX Quote')]",
  );

  switch (verify) {
    // default
    case 1:
      // verify available options
      if (
        (equal(tradeHistoryDates.Exists),
        true &&
          equal(tradeHistorySearch.Exists, true) &&
          equal(tradeHistoryHelp.Exists),
        true &&
          equal(tradeHistoryDownload.Exists, true) &&
          equal(tradeHistoryPrint.Exists),
        true && equal(tradeHistoryQuote.Exists, true))
      ) {
        Log.Checkpoint("| All Options Available |");
      }

      // verify date and search filters
      PortalFX.fxTradeHistoryDates(1);
      PortalFX.fxReportHistorySearch("Test");
      break;

    case "Quote":
      tradeHistoryQuote.Click();

      // get test data
      CommonSQL.sqlDatabaseHandler("sqldb-entitlements-qa");
      ProjectSuite.Variables.TransactionType = "Outbound";
      CommonMAIN.sgbTestAccount();

      // request and accept quote
      PortalFX.fxRequestQuote(1);
      PortalFX.fxQuoteHandler("Accept", 0);

      // confirm trade
      PortalFX.fxTradeConfirmation();
      PortalFX.fxTradeExecutionDB();

      // verify trade in history
      PortalFX.fxReportHistorySearch("Find", Project.Variables.fxTradeNumber);
      break;
  }
}

function fxTradeHistoryDates(range, fromDate, toDate) {
  // open date filter
  var page = Sys.Browser("*").Page("*");
  var tradeHistoryDates = page.WaitElement(
    "//i[contains(text(),'date_range')]",
  );
  tradeHistoryDates.Click();

  // map date objects
  var modal = page.WaitElement("//div[contains(@class, 'modal-content')]");
  var dateRangeToday = page.WaitElement("//button[.='Today']");
  var dateRange7 = page.WaitElement("//button[.='Last 7 Days']");
  var dateRange30 = page.WaitElement("//button[.='Last 30 Days']");
  var dateRangeClose = page.WaitElement("//i[contains(text(),'close')]");
  var dateRangeFrom = page.WaitElement("//input[@id='date-from']");
  var dateRangeTo = page.WaitElement("//input[@id='date-to']");
  var dateRangeApply = page.WaitElement("//button[.='Apply']");

  switch (range) {
    // default
    case 1:
      Log.Checkpoint("| Date Range Options Available |");
      dateRangeClose.Click();
      break;

    case "Today":
      dateRangeToday.Click();
      Log.Checkpoint("| Date Range Set to Today |");
      break;

    case "7":
      dateRange7.Click();
      Log.Checkpoint("| Date Range Set to 7 Days |");
      break;

    case "30":
      dateRange30.Click();
      Log.Checkpoint("| Date Range Set to 30 Days |");
      break;

    case "Range":
      dateRangeFrom.Keys(fromDate);
      dateRangeTo.Keys(toDate);
      dateRangeApply.Click();
      Log.Checkpoint("| Date Range Set | - " + fromDate + " thru " + toDate);
      break;
  }

  // speed handling
  page.WaitElement("//table[1]");
}

function addBeneficiary(limit) {
  // map beneficiary objects
  var page = Sys.Browser("*").Page("*");
  var action = limit;
  page.WaitElement("//h1[contains(., 'Payment')]");
  var memo = page.FindElement("//input[@id='payment-memo']");
  var beneType = page.FindElement(
    "//div[@class='mx-auto mx-md-0']/label[2]",
  ).contentText;

  // select a purpose
  var purpose = page.FindElement(
    "//div[contains(label,'Payment Purpose*')]/div/div",
  );
  var subString1 = "Select a Purpose";
  var Res1 = aqString.Find(purpose.textContent, subString1);
  if (Res1 != -1) {
    Log.Message(
      "Substring '" +
        subString1 +
        "' was found in string '" +
        purpose.textContent +
        "' at position " +
        Res1,
    );
    PortalSQL.getPurpose();
    purpose.Click();
    var purposeSelection = page.FindElement(
      "//div[contains(text(),'" +
        ProjectSuite.Variables.TransactionPurpose +
        "')]",
    );
    purposeSelection.scrollIntoViewIfNeeded();
    purposeSelection.Click();
    memo.SetText(ProjectSuite.Variables.BeneficiaryAlias);
  }

  // crypto settlement
  var subString2 = "Crypto Settlement";
  var Res2 = aqString.Find(purpose.textContent, subString2);
  if (Res2 != -1) {
    Log.Message(
      "Substring '" +
        subString2 +
        "' was found in string '" +
        purpose.textContent +
        "' at position " +
        Res2,
    );
    ProjectSuite.Variables.TransactionPurpose = "Crypto Settlement";
    Log.Message(
      "What is my purpose? " + ProjectSuite.Variables.TransactionPurpose,
    );
  }

  // get purpose and bene
  PortalSQL.getBeneficiary();

  // select existing beneficiary
  var beneficiary = page.FindElement(
    "//div[contains(text(),'Select a Beneficiary')]",
  );
  var beneBank = ProjectSuite.Variables.BeneficiaryBank;
  beneficiary.Click();
  switch (beneType) {
    case "Send to Third Party":
      beneBank = "Add a new Beneficiary";
      Log.Message(
        "LOG: BeneBank - " +
          beneType +
          " | " +
          ProjectSuite.Variables.BeneficiaryBank,
      );
      break;
    case "Send to Owned Account":
      beneBank = ProjectSuite.Variables.BeneficiaryBank;
      Log.Message(
        "LOG: BeneBank - " +
          beneType +
          " | " +
          ProjectSuite.Variables.BeneficiaryBank,
      );
      break;
  }
  var beneficiarySelection = page.FindElement(
    "//div[@class='blazored-typeahead__results position-relative']/div[contains(text(), '" +
      beneBank +
      "')]",
  );
  beneficiarySelection.Click();

  // select bank type
  var bankAccount = page.FindElement(
    "//div[contains(text(),'Select an Account')]",
  );
  bankAccount.Click();
  var bankTypeSelection = page.FindElement(
    "//div[@class='blazored-typeahead__results position-relative']/div[contains(text(), '" +
      ProjectSuite.Variables.BeneficiaryBankType +
      "')]",
  );
  bankTypeSelection.Click();

  // add routing number based on bank type
  var condition = ProjectSuite.Variables.BeneficiaryBankType;
  var routingNumber = page.FindElement("//input[@id='routing-number']");
  switch (condition) {
    case "ABA/Routing":
      routingNumber.SetText(ProjectSuite.Variables.BeneficiaryRN);
      break;
    case "SWIFT/BIC":
      routingNumber.SetText(ProjectSuite.Variables.BeneficiaryBIC);
      break;
  }

  // add bank account number
  var accountNumber = page.FindElement("//input[@id='account-number']");
  var saveAccount = page.FindElement("//div[contains(text(),'No')]");
  accountNumber.scrollIntoViewIfNeeded();
  accountNumber.SetText(ProjectSuite.Variables.BeneficiaryBAN);
  saveAccount.Click();

  // add address if sending to existing third party
  var address = page.FindElement(
    "//input[@id=(//label[.='Beneficiary Street Address*']/@for)]",
  );
  if (address.Text == "") {
    var city = page.FindElement("//input[@id='beneficiary-city']");
    var state = page.FindElement("//input[@id='beneficiary-region']");
    var zip = page.FindElement("//input[@id='beneficiary-postal']");
    var country = page.FindElement(
      "//div[contains(text(),'Select an Option')]",
    );
    address.SetText(ProjectSuite.Variables.BeneficiaryAddress);
    city.SetText(ProjectSuite.Variables.BeneficiaryCity);
    state.SetText(ProjectSuite.Variables.BeneficiaryState);
    zip.SetText(ProjectSuite.Variables.BeneficiaryZip);
    country.Click();
    var countrySelection = page.FindElement(
      "//div[contains(text(),'" +
        ProjectSuite.Variables.BeneficiaryCountry +
        "')]",
    );
    countrySelection.Click();

    // if new
    switch (beneBank) {
      case "Add a new Beneficiary":
        ProjectSuite.Variables.BeneficiaryBank =
          ProjectSuite.Variables.BeneficiaryBank +
          " " +
          ProjectSuite.Variables.Currency2;
        var beneName = page.FindElement("//input[@id='beneficiary-name']");
        beneName.SetText(ProjectSuite.Variables.BeneficiaryBank);
        break;
      case ProjectSuite.Variables.BeneficiaryBank:
        break;
    }
  }

  // send payment
  switch (ProjectSuite.Variables.ProfileUserApprovalReq) {
    case true:
      var sendPayment = page.FindElement(
        "//button[contains(text(),'Submit for Approval')]",
      );
      var aSubString =
        "The payment has been added to the transfer approval queue";
      break;
    case false:
      var sendPayment = page.FindElement(
        "//button[contains(text(),'Send Payment')]",
      );
      var aSubString = "Payment has been sent successfully";
      break;
  }
  sendPayment.scrollIntoViewIfNeeded();
  sendPayment.Click();

  // confirm payment success message
  if (equal(action, "Over Limit")) {
    aSubString = "has been exceeded";
  }
  PortalMAIN.mainMessageHandler(aSubString);
}

function clearBeneficiaryBacklog() {
  // go to beneficiary actions
  var page = Sys.Browser("*").Page("*");
  var i = 0;
  PortalMAIN.navigatePortal("Beneficiaries");

  // get first count
  var addBene = page.WaitElement("//a[@name='linenav-actions-beneficiary']");
  var firstCount = aqString.Replace(addBene.ObjectLabel, "add beneficiary", "");
  ProjectSuite.Variables.Counter = aqConvert.StrToInt(firstCount);
  Log.Checkpoint(
    "| " + ProjectSuite.Variables.Counter + " Pending Beneficiaries |",
  );

  // define loop
  for (i = 1; i <= firstCount; i++) {
    // select top row
    var firstRow = page.WaitElement(
      "//tbody/tr[1]//button[contains(text(), 'Add Beneficiary')]",
    );
    firstRow.Click();

    // define beneficiary type
    var tradeToType = page.WaitElement(
      "//div[@class='mx-auto mx-md-0']/label[@class='form']",
    );
    ProjectSuite.Variables.TradeTo = tradeToType.ObjectLabel;

    // add beneficiary
    PortalFX.addBeneficiary();

    // get last count
    var lastCount = aqString.Replace(
      addBene.ObjectLabel,
      "add beneficiary",
      "",
    );
    ProjectSuite.Variables.Counter = aqConvert.StrToInt(lastCount);
    Log.Message(
      "LOG: pending beneficiaries remaining - " +
        ProjectSuite.Variables.Counter,
    );
  }
  Log.Checkpoint("| All Beneficiaries Added |");
}

function addPostPaymentBeneficiary() {
  // go to beneficiary actions
  var page = Sys.Browser("*").Page("*");
  var i = 0;
  PortalMAIN.navigatePortal("Beneficiaries");

  // get first count
  var addBene = page.WaitElement("//a[@name='linenav-actions-beneficiary']");
  var firstCount = aqString.Replace(addBene.ObjectLabel, "add beneficiary", "");
  ProjectSuite.Variables.Counter = aqConvert.StrToInt(firstCount);
  Log.Checkpoint(
    "| " + ProjectSuite.Variables.Counter + " Pending Beneficiaries |",
  );

  // define loop
  if (ProjectSuite.Variables.Counter >= 1) {
    Log.Message("LOG: i = " + i);
    for (i = 0; i < 1; i++) {
      // select top row
      var firstRow = page.WaitElement(
        "//tbody/tr[1]//button[contains(text(), 'Add Beneficiary')]",
      );
      firstRow.Click();

      // define beneficiary type
      var tradeToType = page.WaitElement(
        "//div[@class='mx-auto mx-md-0']/label[@class='form']",
      );
      ProjectSuite.Variables.TradeTo = tradeToType.ObjectLabel;

      // add beneficiary
      PortalFX.addBeneficiary();

      // get last count
      page.WaitElement(
        "//a[@name='linenav-actions-beneficiary']/div[contains(@class, 'badge-pill')]",
      );
      var lastCount = aqString.Replace(
        addBene.ObjectLabel,
        "add beneficiary",
        "",
      );
      ProjectSuite.Variables.Counter = aqConvert.StrToInt(lastCount);
      Log.Message(
        "LOG: pending beneficiaries remaining - " +
          ProjectSuite.Variables.Counter,
      );
    }
    Log.Checkpoint("| Beneficiary Added |");
  }
}

function verifyDisabledBeneficiary() {
  var page = Sys.Browser("*").Page("*");
  var actionsMenu = page.WaitElement("//a[@name='sidenav-actions']");
  actionsMenu.Click();

  // open add beneficiary tab
  var addBene = page.WaitElement("//a[@name='linenav-actions-beneficiary']");
  addBene.Click();

  // get count
  var firstCount = page.WaitElement("//table[contains(., 'Type')]");
  ProjectSuite.Variables.Counter = firstCount.RowCount - 2; // subtract headers and save/discard rows
  Log.Checkpoint(
    "| " + ProjectSuite.Variables.Counter + " Pending Beneficiaries |",
  );

  // verify add beneficiary is disabled
  var firstRow = page.WaitElement(
    "//tbody/tr[1]//button[contains(text(), 'Add Beneficiary')]",
  );
  if (equal(firstRow.isContentEditable, false)) {
    Log.Checkpoint("| Add Beneficiary Option is Disabled |");
  }
}
