//USEUNIT CommonMAIN
//USEUNIT CommonSQL
//USEUNIT PortalSQL

/***************************************************************
Name: Portal
Description: General Portal functions
Author: Kitt Random
Creation Date: 09/02/2021
***************************************************************/
function loginPortalTrader() {
  ProjectSuite.Variables.Site = "Portal";
  ProjectSuite.Variables.ActiveUserType = "Trader";
  CommonMAIN.sgbLogin(
    ProjectSuite.Variables.Environment,
    ProjectSuite.Variables.Site,
    ProjectSuite.Variables.TraderUser,
    ProjectSuite.Variables.TraderPass,
  );
  Log.Message("LOG: account type - " + ProjectSuite.Variables.ActiveUserType);
  Log.Checkpoint(
    "| Successful Portal Login | - " +
      ProjectSuite.Variables.Environment +
      " as " +
      ProjectSuite.Variables.TraderUser,
  );
}

function loginPortalBOA() {
  ProjectSuite.Variables.Site = "Portal";
  ProjectSuite.Variables.ActiveUserType = "Back Office Admin";
  CommonMAIN.sgbLogin(
    ProjectSuite.Variables.Environment,
    ProjectSuite.Variables.Site,
    ProjectSuite.Variables.BackOfficeUser,
    ProjectSuite.Variables.BackOfficePass,
  );
  Log.Message("LOG: account type - " + ProjectSuite.Variables.ActiveUserType);
  Log.Checkpoint(
    "| Successful Portal Login | - " +
      ProjectSuite.Variables.Environment +
      " as " +
      ProjectSuite.Variables.BackOfficeUser,
  );
}

function loginPortalFO() {
  ProjectSuite.Variables.Site = "Portal";
  ProjectSuite.Variables.ActiveUserType = "Front Office";
  CommonMAIN.sgbLogin(
    ProjectSuite.Variables.Environment,
    ProjectSuite.Variables.Site,
    ProjectSuite.Variables.FrontOfficeUser,
    ProjectSuite.Variables.FrontOfficePass,
  );
  Log.Message("LOG: account type - " + ProjectSuite.Variables.ActiveUserType);
  Log.Checkpoint(
    "| Successful Portal Login | - " +
      ProjectSuite.Variables.Environment +
      " as " +
      ProjectSuite.Variables.FrontOfficeUser,
  );
}

function loginPortalAdmin(envt) {
  ProjectSuite.Variables.Site = "Portal";
  ProjectSuite.Variables.ActiveUserType = "Super Admin";
  CommonMAIN.sgbLogin(
    ProjectSuite.Variables.Environment,
    ProjectSuite.Variables.Site,
    ProjectSuite.Variables.AdminUser,
    ProjectSuite.Variables.AdminPass,
  );
  Log.Message("LOG: account type - " + ProjectSuite.Variables.ActiveUserType);
  Log.Checkpoint(
    "| Successful Portal Login | - " +
      ProjectSuite.Variables.Environment +
      " as " +
      ProjectSuite.Variables.AdminUser,
  );
}

function navigatePortalAdmin(urlPage) {
  if (equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
  }

  switch (ProjectSuite.Variables.Environment) {
    case "QA":
      var urlDomain = ProjectSuite.Variables.urlPortalQA;
      break;
    case "STG":
      var urlDomain = ProjectSuite.Variables.urlPortalSTG;
      break;
  }
  Sys.Browser("*")
    .Page("*")
    .ToUrl(urlDomain + urlPage);
}

function navigatePortal(urlPage) {
  var i;
  var page = Sys.Browser("*").Page("*");
  switch (ProjectSuite.Variables.Environment) {
    case "QA":
      var urlDomain = ProjectSuite.Variables.urlPortalQA;
      break;
    case "STG":
      var urlDomain = ProjectSuite.Variables.urlPortalSTG;
      break;
  }

  // load timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();

  switch (urlPage) {
    case "Actions":
      page.ToUrl(urlDomain + "actions/approve");
      page.WaitElement(
        "//div[@class='main']/div[@class='content']/div[contains(@class, 'list-table-responsive')]",
      );
      break;

    case "Beneficiaries":
      page.ToUrl(urlDomain + "actions/beneficiary");
      page.WaitElement("//table/tbody");
      break;

    case "Connections":
      page.ToUrl(urlDomain + "connections/payments/contacts");
      page.WaitElement("//div[@class='main']/div[@class='content']");
      break;

    case "Home":
      page.ToUrl(urlDomain + "accounts/wallet");
      page.WaitElement(
        "//div[@class='main']/div[@class='content']/div[contains(@class, 'normal-row')]",
      );
      break;

    case "Payments":
      page.ToUrl(urlDomain + "reporting/payments");
      page.WaitElement("//table[contains(., 'Payment ID')]");
      break;

    case "Trades":
      page.ToUrl(urlDomain + "reporting/trades");
      page.WaitElement("//table[contains(., 'Trade ID')]");
      break;
  }
  PortalMAIN.mainErrorHandler(urlPage);
  stopWatch.Stop();
  Log.Checkpoint("| PAGE LOAD SPEED | - " + stopWatch.ToString());
}

function limitHandler(limit) {
  var condition = limit;
  var page = Sys.Browser("*").Page("*");
  switch (condition) {
    // default
    case 1:
      break;
    case "Over Limit":
      break;
    case "Limit Test":
      condition = "Over Limit";
      break;
  }

  switch (condition) {
    // default
    case 1:
      page.WaitElement("//div[contains(text(),'Success')]");
      var dismiss = page.FindElement(
        "//div[@class='modal show-modal info-modal']/div/div[contains(text(), 'DISMISS')]",
      );
      dismiss.Click();
      Log.Checkpoint(
        "| " +
          ProjectSuite.Variables.ServiceType +
          " Submitted | FROM: " +
          ProjectSuite.Variables.TradeFrom +
          " TO: " +
          ProjectSuite.Variables.TradeTo +
          " AMOUNT: " +
          ProjectSuite.Variables.DynamicVarInt,
      );
      break;
    case "Over Limit":
      if (
        equal(
          page.FindElement(
            "//div[contains(@class, 'show-modal error-modal') and contains(., 'has been exceeded')]",
          ).Exists,
          true,
        )
      ) {
        var dismiss = page.FindElement(
          "//div[@class='modal show-modal error-modal']/div/div[contains(text(), 'DISMISS')]",
        );
        var log = page.FindElement(
          "//div[@class='modal show-modal error-modal']/div/div[@class='d-inline-block pr-sm-2']",
        ).textContent;
        Log.Message("LOG: " + log);
        dismiss.Click();
        CommonMAIN.sgbCloseAction();
        Log.Checkpoint("| Negative Test Successful |");
      }
      break;
  }
  page.WaitElement("//div[@class='row normal-row']/div[1]");
}

function mainErrorHandler(pageURL) {
  var page = Sys.Browser("*").Page("*");
  var mainURL = pageURL;
  if (
    equal(
      page.FindElement("//div[@class='modal  error-modal']").VisibleOnScreen,
      true,
    )
  ) {
    var dismiss = page.WaitElement(
      "//div[@class='modal show-modal error-modal']/div/div[contains(text(), 'DISMISS')]",
    );
    var message = page.FindElement(
      "//div[@class='modal show-modal error-modal']/div/div[@class='d-inline-block pr-sm-2']",
    ).textContent;
    Log.Warning("WARNING: " + message);
    dismiss.Click();
    page.Refresh();
    navigatePortal(mainURL);
  }
}

function mainMessageHandler(aSubString) {
  // verify messaging
  var page = Sys.Browser("*").Page("*");
  page
    .WaitElement("//div[contains(@class, 'modal show-modal')]")
    .WaitProperty("VisibleOnScreen", true);
  var aString = page.FindElement(
    "//div[contains(@class, 'modal show-modal')]/div[contains(@class, 'modal-content d-block')]",
  ).contentText;
  var dismiss = page.FindElement(
    "//div[contains(@class, 'show-modal')]//div[contains(@class, 'dismiss')]",
  );
  var Res = aqString.Find(
    aqString.ToLower(aString),
    aqString.ToLower(aSubString),
  );
  Log.Message("LOG: event messaging - " + aString + " | " + aSubString);
  Log.Message("LOG: find --> " + aSubString);
  if (!equal(Res, -1)) {
    Log.Checkpoint("| Successful Messaging Received |");
    dismiss.Click();
  } else {
    Log.Warning("WARNING: " + aString);
    dismiss.Click();
    page.FindElement("//i[.='close']");
  }
}

function portalWallet() {
  // set loop variables and log balance
  var i, j, wndChild;
  var page = Sys.Browser("*").Page("*");
  var balance = page.FindElement("//div[@class='notional-balance']");
  var accts = page.FindElement("//div[@class='row normal-row']").ChildCount;
  Log.Checkpoint("| Profile Account Balance | - " + balance.contentText);

  // list seperator variables
  var prevSep = aqString.ListSeparator;
  aqString.ListSeparator = ", ";
  var x = PortalSQL.sqlGetProfileAccountInfo();

  // loop and log
  Log.Message(
    "There are " + aqString.GetListLength(x) + " accounts in the array",
  );
  for (i = 0; i < aqString.GetListLength(x); i++) {
    Log.Message(
      "LOG: account " + (i + 1) + " is: " + aqString.GetListItem(x, i),
    );
  }

  // restore previous separator
  aqString.ListSeparator = prevSep;
}

function portalConnections(condition) {
  var page = Sys.Browser("*").Page("*");
  BackOfficeSQL.sqlGetUserConnectionPermission();
  switch (condition) {
    case "Verify":
      // go to contact page and map objects
      var contact = page.FindElement("//div[contains(@class,'card-body')]");
      contact.Click();
      var editBtn = contact.WaitChild("//button[contains(text(),'Edit')]");
      var contactBank = page.FindElement(
        "//div[contains(h2, 'TestComplete Bank ABA')]//button[contains(text(), 'Details')]",
      );

      // none = 0; add new = 1; edit existing = 2; add new and edit existing = 3
      switch (ProjectSuite.Variables.ProfileUserConnectionEnum) {
        case 0:
          // verify edit option unavailalbe
          if (equal(editBtn.Exists, false)) {
            Log.Checkpoint(
              "| Connection Permissions Verified | - Edit Option Unavailable",
            );
            contactBank.Click();
          }

          // map contact bank objects
          var form = page.FindElement("//form");
          var saveBtn = form.WaitChild("//button[contains(text(),'Save')]");
          var deleteBtn = form.WaitChild(
            "//div[contains(text(),'Delete Account')]",
          );
          var closeBtn = page.FindElement("//i[contains(text(),'close')]");

          // verify save/delete options unavailable
          if (equal(saveBtn.Exists, false) && equal(deleteBtn.Exists, false)) {
            Log.Checkpoint(
              "| Connection Permissions Verified | - Save/Delete Options Unavailable",
            );
            closeBtn.Click();
          }
          break;
        case 1:
          // verify edit option unavailalbe
          if (equal(editBtn.Exists, false)) {
            Log.Checkpoint(
              "| Connection Permissions Verified | - Edit Option Unavailable",
            );
            contactBank.Click();
          }

          // map contact bank objects
          var form = page.FindElement("//form");
          var saveBtn = form.WaitChild("//button[contains(text(),'Save')]");
          var deleteBtn = form.WaitChild(
            "//div[contains(text(),'Delete Account')]",
          );
          var closeBtn = page.FindElement("//i[contains(text(),'close')]");

          // verify save/delete options available
          if (equal(saveBtn.Exists, true) && equal(deleteBtn.Exists, true)) {
            Log.Checkpoint(
              "| Connection Permissions Verified | - Save/Delete Options Available",
            );
            closeBtn.Click();
          }
          break;
        case 2:
          // verify edit option availalbe
          if (equal(editBtn.Exists, true)) {
            Log.Checkpoint(
              "| Connection Permissions Verified | - Edit Option Available",
            );
            contactBank.Click();
          }

          // map contact bank objects
          var form = page.FindElement("//form");
          var saveBtn = form.WaitChild("//button[contains(text(),'Save')]");
          var deleteBtn = form.WaitChild(
            "//div[contains(text(),'Delete Account')]",
          );
          var closeBtn = page.FindElement("//i[contains(text(),'close')]");

          // verify save/delete options available
          if (equal(saveBtn.Exists, true) && equal(deleteBtn.Exists, false)) {
            Log.Checkpoint(
              "| Connection Permissions Verified | - Save Option Available; Delete Option Unavailable",
            );
            closeBtn.Click();
          }
          break;
        case 3:
          // verify edit option availalbe
          if (equal(editBtn.Exists, true)) {
            Log.Checkpoint(
              "| Connection Permissions Verified | - Edit Option Available",
            );
            contactBank.Click();
          }

          // map contact bank objects
          var form = page.FindElement("//form");
          var saveBtn = form.WaitChild("//button[contains(text(),'Save')]");
          var deleteBtn = form.WaitChild(
            "//div[contains(text(),'Delete Account')]",
          );
          var closeBtn = page.FindElement("//i[contains(text(),'close')]");

          // verify save/delete options available
          if (equal(saveBtn.Exists, true) && equal(deleteBtn.Exists, true)) {
            Log.Checkpoint(
              "| Connection Permissions Verified | - Save/Delete Options Available",
            );
            closeBtn.Click();
          }
          break;
      }
      break;
    case "Add New":
      // COMING SOON
      break;
    case "Edit Existing":
      // COMING SOON
      break;
  }
}

function sgbSwitchPortalUser() {
  // get current user
  CommonMAIN.sgbGetCurrentUser();

  // log out
  CommonMAIN.sgbLogout();

  // log in with admin user
  switch (ProjectSuite.Variables.ActiveUserType) {
    case "Super Admin":
      PortalMAIN.loginPortalBOA();
      break;
    case "Back Office Admin":
      PortalMAIN.loginPortalAdmin();
      break;
    case "Front Office":
      PortalMAIN.loginPortalFO();
      break;
    case "Trader":
      PortalMAIN.loginPortalAdmin();
      break;
  }
}

function sgbSwitchToPortalTrader() {
  CommonMAIN.sgbGetCurrentUser();
  if (!equal(ProjectSuite.Variables.ActiveUserType, "Trader")) {
    CommonMAIN.sgbLogout();
    PortalMAIN.loginPortalTrader();
  }
}
