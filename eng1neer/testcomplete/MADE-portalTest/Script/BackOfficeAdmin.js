//USEUNIT BackOfficeMAIN
//USEUNIT CommonMAIN
//USEUNIT CommonSQL
//USEUNIT PortalMAIN
//USEUNIT PortalSQL

/***************************************************************
Name: BackOfficeAdmin
Description: Back Office Admin Management
Author: Kitt Random
Creation Date: 10/20/2021
***************************************************************/
function adminProfileNavigation(serviceType) {
  // search for default profile - 'TestComplete Automation'
  var page = Sys.Browser("*").Page("*");
  BackOfficeMAIN.navigateBackOffice("profiles");

  // timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();
  page.FindElement("//tbody/tr[1]").WaitProperty("VisibleOnScreen", true);
  stopWatch.Stop();
  Log.Checkpoint("| PROFILES PAGE LOAD SPEED | - " + stopWatch.ToString());

  // wait for profile load
  var currentUser = page.FindElement(
    "//a[@id='user-navbar-dropdown']/div/div",
  ).contentText;
  ProjectSuite.Variables.ProfileUserLast = aqString.Replace(
    currentUser,
    ProjectSuite.Variables.ProfileUserLast + " ",
    "",
  );

  // find profile
  var profile = page.FindElement(
    "//tbody/tr/th[contains(text(), '" +
      ProjectSuite.Variables.ProfileName +
      "')]",
  );
  profile.Click();

  // timer
  stopWatch.Reset();
  stopWatch.Start();
  page.FindElement("//tbody/tr[1]/td[1]").WaitProperty("VisibleOnScreen", true);
  stopWatch.Stop();
  Log.Checkpoint("| PROFILE LOAD SPEED | - " + stopWatch.ToString());

  // find profile admin services
  var profileUsers = page.FindElement("//a[@name='linenav-Users']");
  var profileSubscriptions = page.FindElement(
    "//a[@name='linenav-Subscriptions']",
  );
  var profileAccounts = page.FindElement("//a[@name='linenav-Accounts']");
  var profileServices = page.FindElement("//a[@name='linenav-Services']");
  var profileSettings = page.FindElement("//a[@name='linenav-Settings']");

  // go to service
  switch (serviceType) {
    case "Users":
      profileUsers.Click();
      break;
    case "Subscriptions":
      profileSubscriptions.Click();
      break;
    case "Accounts":
      profileAccounts.Click();
      break;
    case "Services":
      profileServices.Click();
      break;
    case "Settings":
      profileSettings.Click();
      break;
  }
}

function adminVerifyTraderServices(pageURL, search) {
  // go to trading desk
  var page = Sys.Browser("*").Page("*");
  var serviceType = pageURL;
  BackOfficeMAIN.navigateBackOffice("trader-workspace/quotes");

  // load timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();
  page
    .FindElement("//h6[contains(text(), 'Connection Status:')]")
    .WaitProperty("contentText", "*Connected");
  stopWatch.Stop();
  Log.Checkpoint("| TRADING DESK CONNECTION SPEED | - " + stopWatch.ToString());

  // verify trader desk services
  // enable auto-quoting: 1 = All Quoting On; 2 = All Quoting Off; 3 = Manual Quoting Only; 4 = Auto Quoting Only
  switch (pageURL) {
    case "API":
      switch (ProjectSuite.Variables.AutoQuoting) {
        case 0:
          var tradeDeskApi = page.FindElement(
            "//div[@class='col d-flex']/div[1]",
          ).contentText;
          if (equal(tradeDeskRfq, "API Disabled")) {
            Log.Checkpoint("| API Disabled |");
          }
          break;

        case 1:
          var tradeDeskApi = page.FindElement(
            "//div[@class='col d-flex']/div[1]",
          ).contentText;
          if (equal(tradeDeskApi, "API Enabled")) {
            Log.Checkpoint("| API Enabled |");
          }
          break;
      }
      break;

    case "RFQ":
      switch (ProjectSuite.Variables.AutoQuoting) {
        case 1:
          var tradeDeskRfq = page.FindElement(
            "//div[@class='col d-flex']/div[2]",
          ).contentText;
          if (equal(tradeDeskRfq, "Auto Quoting On")) {
            Log.Checkpoint("| Auto Quoting ON |");
          }
          break;

        case 2:
          var tradeDeskRfq = page.FindElement(
            "//div[@class='col d-flex']/div[2]",
          ).contentText;
          if (equal(tradeDeskRfq, "Auto Quoting Off")) {
            Log.Checkpoint("| Auto Quoting OFF |");
          }
          break;

        case 3:
          var tradeDeskRfq = page.FindElement(
            "//div[@class='col d-flex']/div[2]",
          ).contentText;
          if (equal(tradeDeskRfq, "Manual Quoting Only")) {
            Log.Checkpoint("| Manual Quoting ONLY |");
          }
          break;

        case 4:
          var tradeDeskRfq = page.FindElement(
            "//div[@class='col d-flex']/div[2]",
          ).contentText;
          if (equal(tradeDeskRfq, "Auto Quoting Only")) {
            Log.Checkpoint("| Auto Quoting ONLY |");
          }
          break;
      }
      break;

    case "Trade":
      switch (ProjectSuite.Variables.AutoQuoting) {
        case 0:
          var tradeDeskTrade = page.FindElement(
            "//div[@class='col d-flex']/div[3]",
          ).contentText;
          if (equal(tradeDeskTrade, "Trade Execution Off")) {
            Log.Checkpoint("| Trade Execution OFF |");
          }
          break;

        case 1:
          var tradeDeskTrade = page.FindElement(
            "//div[@class='col d-flex']/div[3]",
          ).contentText;
          if (equal(tradeDeskTrade, "Trade Execution On")) {
            Log.Checkpoint("| Trade Execution ON |");
          }
          break;
      }
      break;

    case "Search":
      var tradeDeskSearch = page.FindElement(
        "//input[@id='trade-desk-search']",
      );
      tradeDeskSearch.SetText(search);
      page.FindElement("//tbody//tr[1]").WaitProperty("VisibleOnScreen", true);
      var searchResult = page.FindElement(
        "//th[contains(text(), '" + searchFor + "')]",
      );
      searchResult.Click();
      Log.Checkpoint("| Search Found | - " + searchFor);
      break;
  }
}

function adminVerifyTradingDesk(action, area) {
  // go to trading desk
  var page = Sys.Browser("*").Page("*");
  var tradeDesk = action;
  BackOfficeMAIN.navigateBackOffice("trader-workspace/" + area);

  // load timer
  var stopWatch = HISUtils.StopWatch;
  var limit = 30000; // 30 seconds
  stopWatch.Start();
  page
    .FindElement("//h6[contains(text(), 'Connection Status:')]")
    .WaitProperty("contentText", "*Connected");
  if (stopWatch.Split() >= limit) {
    Log.Warning(
      "The process has exceeded the " +
        limit / 1000 / 60 +
        " second time limit.",
    );
    stopWatch.Stop();
    Runner.Stop();
  }
  stopWatch.Stop();
  Log.Checkpoint("| TRADING DESK CONNECTION SPEED | - " + stopWatch.ToString());

  switch (tradeDesk) {
    case "Manual":
      if (
        equal(
          page.FindElement(
            "//td[.='" + ProjectSuite.Variables.ProfileName + "']",
          ).Exists,
          true,
        )
      ) {
        var currencyPair = page.FindElement(
          "//tbody[1]/tr[1]/td[5]",
        ).contentText; // caputure currency pair
        Log.Checkpoint(
          "| Manual Quote Sent to Trading Desk | - " +
            ProjectSuite.Variables.ProfileName +
            " " +
            currencyPair,
        );
      }
      break;
    case 1:
      // TO DO
      break;
  }
}
function adminVerifyProfileServices(action, amount, update) {
  // set variables
  var page = Sys.Browser("*").Page("*");
  var serviceSwitch, dailyLimit, transLimit;
  var count, dismiss, apply;

  // map objects based on service type
  serviceSwitch = page.FindElement(
    "//input[@id='" + ProjectSuite.Variables.ServiceId + "-switch']",
  );
  dailyLimit = page.FindElement(
    "#service-limit-dl-" + ProjectSuite.Variables.ServiceId,
  );
  transLimit = page.FindElement(
    "#service-limit-tl-" + ProjectSuite.Variables.ServiceId,
  );
  serviceName = page.FindElement(
    "//label[contains(text(),'" + ProjectSuite.Variables.ServiceType + "')]",
  );

  // capture and convert limit values based on service type
  var dailyLimitAmount = aqConvert.StrToCurrency(dailyLimit.value);
  var transLimitAmount = aqConvert.StrToCurrency(transLimit.value);
  Log.Message("LOG: service - " + ProjectSuite.Variables.ServiceType);
  Log.Message("LOG: service id - " + ProjectSuite.Variables.ServiceId);
  Log.Message("LOG: current daily limit - " + dailyLimit.value);
  Log.Message("LOG: current transaction limit - " + transLimit.value);

  // perform actions on service type
  switch (action) {
    case "Enable":
      // verify disabled service
      if (
        equal(dailyLimit.isContentEditable, false) &&
        equal(transLimit.isContentEditable, false)
      ) {
        Log.Checkpoint(
          "| Profile Service is Disabled | - " +
            ProjectSuite.Variables.ServiceType,
        );
      }

      // re-enable service
      serviceSwitch.Click();
      Log.Checkpoint(
        "| " +
          ProjectSuite.Variables.DynamicVarInt +
          " Service Enabled | - " +
          ProjectSuite.Variables.ServiceType,
      );
      break;

    case "Disable":
      // disable service type
      serviceSwitch.Click();
      Log.Checkpoint(
        "| " +
          ProjectSuite.Variables.DynamicVarInt +
          " Service Disabled | - " +
          ProjectSuite.Variables.ServiceType,
      );
      break;

    case "Approval":
      // capture service aprroval requirement
      var serviceApproval = page.FindElement(
        "//div[input[@id='service-limit-cdst-" +
          ProjectSuite.Variables.ServiceId +
          "']]",
      );
      var serviceApprovalReq = aqString.Replace(
        serviceApproval.contentText,
        "arrow_drop_down",
        "",
      );
      ProjectSuite.Variables.ServiceApprovalType = aqString.Trim(
        serviceApprovalReq,
        aqString.stAll,
      );
      Log.Message(
        "LOG: current service approval - " +
          ProjectSuite.Variables.ServiceApprovalType,
      );
      serviceApproval.Click();
      switch (ProjectSuite.Variables.ServiceApprovalType) {
        case "Straight Through Processing":
          var newApproval = page.WaitElement(
            "//div[contains(@title,'" +
              ProjectSuite.Variables.ServiceType +
              "')]" +
              "//div[contains(@class, 'blazored-typeahead__results')]/div[contains(text(), 'Separate Entry From Approval')]",
          );
          newApproval.Click();
          break;
        case "Separate Entry From Approval":
          var newApproval = page.WaitElement(
            "//div[contains(@title,'" +
              ProjectSuite.Variables.ServiceType +
              "')]" +
              "//div[contains(@class, 'blazored-typeahead__results')]/div[contains(text(), 'Straight Through Processing')]",
          );
          newApproval.Click();
          break;
      }
      break;

    case "Daily Limit":
      // change daily limit
      ProjectSuite.Variables.limitType = action;
      ProjectSuite.Variables.limitDaily = amount;
      dailyLimit.SetText(amount);

      // capture new limits and save
      dailyLimitAmount = aqConvert.StrToFloat(dailyLimit.value);
      transLimitAmount = aqConvert.StrToFloat(transLimit.value);
      Log.Message(
        "LOG: daily - " + dailyLimitAmount + " | trans - " + transLimitAmount,
      );

      // update transaction limit if = daily limit
      switch (aqString.Compare(transLimitAmount, dailyLimitAmount, true)) {
        case -1:
          break;
        case 0:
          var newTransLimit = dailyLimitAmount + 1;
          page
            .WaitElement(
              "#service-limit-tl-" + ProjectSuite.Variables.ServiceId,
            )
            .SetText(newTransLimit);
          break;
        case 1:
          break;
      }

      // log new limits
      Log.Checkpoint("| New Daily Limit | - " + dailyLimit.value);
      Log.Checkpoint("| New Transaction Limit | - " + transLimit.value);

      // limit validator: positive test - trans limit CANNOT be more than daily limit
      if (amount == 1 && dailyLimitAmount > transLimitAmount) {
        Log.Checkpoint("| Limits Verified | - Transaction Limit > Daily Limit");
        Log.Message(
          "LOG: transaction limit cannot be > daily limit...limit is NOT updated",
        );
      }
      break;

    case "Transaction Limit":
      // change transaction limit
      ProjectSuite.Variables.limitType = action;
      ProjectSuite.Variables.limitTransaction = amount;
      Log.Message(
        "LOG: daily - " + dailyLimitAmount + " | trans - " + transLimitAmount,
      );

      // update transaction limit if = daily limit
      switch (aqString.Compare(transLimitAmount, dailyLimitAmount, true)) {
        case -1:
          break;
        case 0:
          var newDailyLimit = aqString.StrToInt(transLimitAmount + 1);
          page
            .WaitElement(
              "#service-limit-tl-" + ProjectSuite.Variables.ServiceId,
            )
            .SetText(newDailyLimit);
          break;
        case 1:
          break;
      }

      transLimit.SetText(amount);

      // capture new limits
      dailyLimitAmount = aqConvert.StrToFloat(dailyLimit.value);
      transLimitAmount = aqConvert.StrToFloat(transLimit.value);

      Log.Checkpoint("| New Daily Limit | - " + dailyLimit.value);
      Log.Checkpoint("| New Transaction Limit | - " + transLimit.value);

      // limit validator: positive test - trans limit can be less than daily limit
      if (equal(amount, -1) && dailyLimitAmount < transLimitAmount) {
        Log.Checkpoint("| Limits Verified | - Transaction Limit < Daily Limit");
        Log.Message(
          "LOG: transaction limit can be < daily limit...limit is updated",
        );
      }

      // limit validator: negative test - trans limit CANNOT be more than daily limit
      if (equal(amount, 1) && dailyLimitAmount == transLimitAmount) {
        Log.Checkpoint("| Limits Verified | - Transaction Limit = Daily Limit");
        Log.Message(
          "LOG: transaction limit cannot be > daily limit...limit is NOT updated",
        );
      }
      break;
  }

  // cancel or save changes
  if (!equal(action, "")) {
    apply = page.WaitElement(
      "//div[@class='row mb-3']/button[contains(text(),'" + update + "')]",
    );
    apply.Click();
  }

  // confirm permissions change success message
  if (equal(update, "Save")) {
    PortalMAIN.mainMessageHandler(
      "Permissions for " +
        ProjectSuite.Variables.ProfileName +
        " have been added",
    );
  }

  // wait for page load
  page.WaitElement("//a[@id='sidebar-link-0']");
}

function adminApprovalAction(approvalType, action, profileType) {
  // open approvals admin
  var page = Sys.Browser("*").Page("*");
  BackOfficeMAIN.navigateBackOffice(
    "approvals/" + aqString.ToLower(approvalType),
  );

  // map approval area
  page.WaitElement("//table[1]/tbody[1]");
  var approvalArea = page.FindElement(
    "//a[@name='linenav-" + aqString.ToLower(approvalType) + "']",
  );
  approvalArea.Click();

  // get approval count and current date
  var firstCount = approvalArea.FindChildByXPath(
    "/div[contains(@class, 'badge-pill badge-primary')]",
  ).contentText;
  Log.Message("LOG: first count - " + firstCount);
  ProjectSuite.Variables.Counter = aqConvert.StrToInt(firstCount);
  Log.Checkpoint(
    "| " +
      ProjectSuite.Variables.Counter +
      " Pending " +
      aqString.SubString(approvalType, 0, approvalType.length - 1) +
      " Approvals |",
  );
  CommonMAIN.getCurrentDate();

  // select top row
  var change, profile;
  switch (profileType) {
    // 0 = default profile | 2 = AdHoc Profile
    case "0":
      change = "Permission";
      profile = ProjectSuite.Variables.ProfileName;
      break;
    case "0.1":
      approvalType = "Subscriptions";
      change = "Change";
      profile = ProjectSuite.Variables.ProfileName;
      break;
    case "0.2":
      approvalType = "Subscriptions";
      change = "Permission";
      profile = ProjectSuite.Variables.ProfileName;
      break;
    case "1":
      change = "Activation";
      profile = ProjectSuite.Variables.ProfileName;
      break;
    case "1.1":
      approvalType = "Subscriptions";
      change = "Change";
      profile = ProjectSuite.Variables.ProfileName;
      break;
    case "1.2":
      approvalType = "Subscriptions";
      change = "Permission";
      profile = ProjectSuite.Variables.ProfileName;
      break;
  }
  var firstRow = page.FindElement(
    "//tbody//tr[contains(.,'" +
      aqString.SubString(approvalType, 0, approvalType.length - 1) +
      " " +
      change +
      "')" +
      " and contains(., '" +
      profile +
      "') and contains(., '" +
      ProjectSuite.Variables.Date1 +
      "')]",
  );
  firstRow.Click();

  // perform action
  var actionObj = page.FindElement(
    "//button[contains(text(),'" + action + "')]",
  );
  actionObj.Click();

  // verify success
  PortalMAIN.mainMessageHandler("Success");

  // wait for page load
  page.WaitElement("//a[@id='sidebar-link-0']");
}

function adminClearApprovals(approvalType, action) {
  // open approvals admin
  var page = Sys.Browser("*").Page("*");
  BackOfficeMAIN.navigateBackOffice("approvals/" + approvalType);

  // open approval area
  var i;
  var approvalArea = page.WaitElement(
    "//a[@name='linenav-" + approvalType + "']",
  );
  approvalArea.Click();

  // get first count
  var firstCount = aqString.Replace(approvalArea.ObjectLabel, approvalType, "");
  ProjectSuite.Variables.Counter = aqConvert.StrToInt(firstCount);
  Log.Checkpoint(
    "| " +
      ProjectSuite.Variables.Counter +
      " Pending " +
      approvalType +
      " Approvals |",
  );

  // define loop
  for (i = 1; i <= ProjectSuite.Variables.Counter; i++) {
    // perform action
    BackOfficeADMIN.adminApprovalAction(action);

    // get last count
    var lastCount = aqString.Replace(
      approvalArea.ObjectLabel,
      approvalType,
      "",
    );
    ProjectSuite.Variables.Counter = aqConvert.StrToInt(lastCount);
    Log.Checkpoint(
      "| " +
        ProjectSuite.Variables.Counter +
        " Pending " +
        approvalType +
        " Approvals Remaining |",
    );
  }

  // wait for page load
  page.WaitElement("//a[@id='sidebar-link-0']");
}

function verifyProfileBtn() {
  // open new profile
  var page = Sys.Browser("*").Page("*");
  CommonMAIN.sgbGetCurrentUser();

  // permission handling
  var profileBtn;
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Trader") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Front Office")
  ) {
    profileBtn = page.WaitNamedChild(
      "//button[contains(text(),'New Profile')]",
      0,
    );
    if (equal(profileBtn.Exists, false)) {
      Log.Checkpoint(
        "| New Profile Button Disabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
    }
  }

  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Super Admin") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Back Office Admin")
  ) {
    var profileBtn = page.FindElement(
      "//button[contains(text(),'New Profile')]",
    );
    if (equal(profileBtn.Exists, true)) {
      Log.Checkpoint(
        "| New Profile Button Enabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
      profileBtn.Click();
      page.FindElement("//i[contains(text(),'close')]").Click();
    }
  }
}

function adminNewProfile(action) {
  // open new profile
  var page = Sys.Browser("*").Page("*");
  CommonMAIN.sgbGetCurrentUser();
  var condition = action;
  var newProfile = page.FindElement("//button[contains(text(),'New Profile')]");
  Log.Checkpoint(
    "| New Profile Button Enabled | user - " +
      ProjectSuite.Variables.ActiveUserType,
  );
  newProfile.Click();

  // map profile objects
  page.WaitElement(
    "//div[contains(., 'Available Accounts')]/div/div[@class='connection-select-list']",
  );
  var profileName = page.FindElement("//input[@id='profile-name']");
  var profileId = page.FindElement("//input[@id='profile-id']");
  var continueBtn = page.FindElement("//button[contains(text(),'Continue')]");

  // set default test profile variables
  ProjectSuite.Variables.adHocProfile = "Tacobout TestComplete";
  ProjectSuite.Variables.adHocBAN1 = PortalSQL.getRandomProfileAccount();
  ProjectSuite.Variables.adHocBAN2 = PortalSQL.getRandomProfileAccount();

  // enter new profile info
  Log.Message("LOG: variable passed = " + condition);
  switch (condition) {
    case "Existing":
      var profileNameStr = ProjectSuite.Variables.ProfileName;
      profileName.SetText(profileNameStr);
      break;
    case "New":
      var profileNameStr = ProjectSuite.Variables.adHocProfile;
      profileName.SetText(profileNameStr);
      break;
      break;
    case "Verify":
      var profileNameStr = ProjectSuite.Variables.adHocProfile;
      profileName.SetText(profileNameStr);
      if (
        equal(
          ProjectSuite.Variables.adHocBAN1,
          ProjectSuite.Variables.adHocBAN2,
        )
      ) {
        ProjectSuite.Variables.adHocBAN2 = PortalSQL.getRandomProfileAccount();
      }
      break;
  }

  // add newly created accounts
  var add = page.FindElement("//button[contains(text(),'Add Selected')]");
  var availAcct = page.FindElement("//input[@placeholder='Search Available']");
  availAcct.SetText(ProjectSuite.Variables.adHocBAN1);
  page
    .FindElement(
      "//div[contains(text(), '" + ProjectSuite.Variables.adHocBAN1 + "')]",
    )
    .Click();
  add.Click();
  availAcct.SetText(ProjectSuite.Variables.adHocBAN2);
  page
    .FindElement(
      "//div[contains(text(), '" + ProjectSuite.Variables.adHocBAN2 + "')]",
    )
    .Click();
  add.Click();

  // log new profile info and continue
  Log.Checkpoint(
    "| Profile Added | - Name: " + profileNameStr + "; ID: " + profileId.Text,
  );
  continueBtn.Click();
}

function adminNewProfileActivation() {
  // map new profile activation objects;
  var page = Sys.Browser("*").Page("*");
  var serviceBase = "10,000.00";
  var intService = page.FindElement(
    "//label[contains(text(),'Internal Transfer')]",
  );
  var senService = page.FindElement("//label[contains(text(),'SEN Transfer')]");
  var payService = page.FindElement("//label[contains(text(),'Payment')]");

  // enable services
  intService.Click();
  senService.Click();
  payService.Click();
  Log.Checkpoint("| All Services Enabled |");

  // set default service limits
  var j = 0;
  for (j = 1; j <= 4; j++) {
    Log.Message("LOG: j = " + j);
    var serviceDL = page.FindElement(
      "//input[@id='service-limit-dl-" + j + "']",
    );
    var serviceTL = page.FindElement(
      "//input[@id='service-limit-tl-" + j + "']",
    );
    serviceDL.SetText(serviceBase);
    serviceTL.SetText(serviceBase);
  }

  // enable account services
  var k = 0;
  for (k = 1; k <= 6; k++) {
    if (k === 3 || k === 4) continue;
    Log.Message("LOG: k = " + k);
    var acct1Services = page.FindElement(
      "//input[@id='entitlement-" +
        ProjectSuite.Variables.adHocBAN1 +
        "-switch-" +
        k +
        "']",
    );
    var acct2Services = page.FindElement(
      "//input[@id='entitlement-" +
        ProjectSuite.Variables.adHocBAN2 +
        "-switch-" +
        k +
        "']",
    );
    var acct1ServicesDL = page.FindElement(
      "//input[@name='entitlement-" +
        ProjectSuite.Variables.adHocBAN1 +
        "-limit-dl-" +
        k +
        "']",
    );
    var acct2ServicesDL = page.FindElement(
      "//input[@name='entitlement-" +
        ProjectSuite.Variables.adHocBAN2 +
        "-limit-dl-" +
        k +
        "']",
    );
    var acct1ServicesTL = page.FindElement(
      "//input[@name='entitlement-" +
        ProjectSuite.Variables.adHocBAN1 +
        "-limit-tl-" +
        k +
        "']",
    );
    var acct2ServicesTL = page.FindElement(
      "//input[@name='entitlement-" +
        ProjectSuite.Variables.adHocBAN2 +
        "-limit-tl-" +
        k +
        "']",
    );
    acct1Services.Click();
    acct2Services.Click();
    acct1ServicesDL.SetText(serviceBase);
    acct1ServicesTL.SetText(serviceBase);
    acct2ServicesDL.SetText(serviceBase);
    acct2ServicesTL.SetText(serviceBase);
  }

  // submit
  var submit = page.FindElement("//button[contains(text(),'Submit')]");
  submit.Click();

  // verify success
  PortalMAIN.mainMessageHandler(
    "Permissions for " +
      ProjectSuite.Variables.adHocProfile +
      " have been added",
  );
}

function adminUsers(action) {
  // open new profile
  var page = Sys.Browser("*").Page("*");
  CommonMAIN.sgbGetCurrentUser();
  var condition = action;

  // go to profile users
  BackOfficeADMIN.adminProfileNavigation("Users");
  page.FindElement("//table/tbody/tr").WaitProperty("VisibleOnScreen", true);

  var activeUser = page.FindElement(
    "//tr[contains(., '" +
      ProjectSuite.Variables.ProfileUserFirst +
      " " +
      ProjectSuite.Variables.ProfileUserLast +
      "')]/td/button[contains(text(), 'View Permissions')]",
  );
  Log.Checkpoint(
    "| New Profile Button Enabled | user - " +
      ProjectSuite.Variables.ActiveUserType,
  );
  activeUser.Click();

  // map profile objects
  page.WaitElement(
    "//div[contains(., 'Available Accounts')]/div/div[@class='connection-select-list']",
  );
  var profileName = page.FindElement("//input[@id='profile-name']");
  var profileId = page.FindElement("//input[@id='profile-id']");
  var continueBtn = page.FindElement("//button[contains(text(),'Continue')]");

  // set default test profile variables
  ProjectSuite.Variables.adHocProfile = "Tacobout TestComplete";
  ProjectSuite.Variables.adHocBAN1 = PortalSQL.getRandomProfileAccount();
  ProjectSuite.Variables.adHocBAN2 = PortalSQL.getRandomProfileAccount();

  // enter new profile info
  Log.Message("LOG: variable passed = " + condition);
  switch (condition) {
    case "Existing":
      var profileNameStr = ProjectSuite.Variables.ProfileName;
      profileName.SetText(profileNameStr);
      break;
    case "New":
      var profileNameStr = ProjectSuite.Variables.adHocProfile;
      profileName.SetText(profileNameStr);
      break;
      break;
    case "Verify":
      var profileNameStr = ProjectSuite.Variables.adHocProfile;
      profileName.SetText(profileNameStr);
      if (
        equal(
          ProjectSuite.Variables.adHocBAN1,
          ProjectSuite.Variables.adHocBAN2,
        )
      ) {
        ProjectSuite.Variables.adHocBAN2 = PortalSQL.getRandomProfileAccount();
      }
      break;
  }

  // add newly created accounts
  var add = page.FindElement("//button[contains(text(),'Add Selected')]");
  var availAcct = page.FindElement("//input[@placeholder='Search Available']");
  availAcct.SetText(ProjectSuite.Variables.adHocBAN1);
  page
    .FindElement(
      "//div[contains(text(), '" + ProjectSuite.Variables.adHocBAN1 + "')]",
    )
    .Click();
  add.Click();
  availAcct.SetText(ProjectSuite.Variables.adHocBAN2);
  page
    .FindElement(
      "//div[contains(text(), '" + ProjectSuite.Variables.adHocBAN2 + "')]",
    )
    .Click();
  add.Click();

  // log new profile info and continue
  Log.Checkpoint(
    "| Profile Added | - Name: " + profileNameStr + "; ID: " + profileId.Text,
  );
  continueBtn.Click();
}

function verifyUserBtn() {
  // go to profile users
  var page = Sys.Browser("*").Page("*");
  CommonMAIN.sgbGetCurrentUser();
  BackOfficeADMIN.adminProfileNavigation("Users");
  page.FindElement("//table/tbody/tr").WaitProperty("VisibleOnScreen", true);

  // permission handling
  var userBtn;
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Trader") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Front Office")
  ) {
    userBtn = page.WaitNamedChild("//button[contains(text(),'Add User')]", 0);
    if (equal(profileBtn.Exists, false)) {
      Log.Checkpoint(
        "| New User Button Disabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
    }
  }

  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Super Admin") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Back Office Admin")
  ) {
    var userBtn = page.FindElement("//button[contains(text(),'Add User')]");
    if (equal(userBtn.Exists, true)) {
      Log.Checkpoint(
        "| New User Button Enabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
      userBtn.Click();
      page.FindElement("//i[contains(text(),'close')]").Click();
    }
  }
}

function adminPortalProfile(area, action) {
  // get current user info
  var page = Sys.Browser("*").Page("*");
  PortalSQL.getProfileUserInfo();

  // area handler
  switch (area) {
    case "Users":
      // user actions handler
      PortalMAIN.navigatePortalAdmin("profileadmin/users");
      page.FindElement("//table//tbody").WaitProperty("VisibleOnScreen", true);
      switch (action) {
        case "Password Reset":
          page
            .FindElement(
              "//i[@id='user-action-" +
                ProjectSuite.Variables.ProfileUserOkta +
                "-dropdown']",
            )
            .Click();
          page
            .FindElement(
              "//div[@aria-labelledby='user-action-" +
                ProjectSuite.Variables.ProfileUserOkta +
                "-dropdown']/button[contains(text(), 'Reset Password')]",
            )
            .Click();
          page
            .FindElement(
              "//div[contains(@class, 'd-flex')]/div[contains(text(), 'CANCEL')]",
            )
            .Click();
          break;
        case "New":
          page.FindElement("//button[contains(text(),'Add User')]").Click();
          page.FindElement("//i[contains(text(),'close')]").Click();
          break;
        case "Permissions":
          page
            .FindElement(
              "//i[@id='user-action-" +
                ProjectSuite.Variables.ProfileUserOkta +
                "-dropdown']",
            )
            .Click();
          page.FindElement(
            "//div[@aria-labelledby='user-action-" +
              ProjectSuite.Variables.ProfileUserOkta +
              "-dropdown']",
          );
          break;
      }
      break;
    case "Accounts":
      // accounts actions handler
      PortalMAIN.navigatePortalAdmin("profileadmin/accounts");
      page.FindElement("//table//tbody").WaitProperty("VisibleOnScreen", true);
      switch (action) {
        case "Edit":
          page
            .FindElement(
              "//tr[contains(., '" +
                ProjectSuite.Variables.ProfileBAN +
                "')]/td[contains(., 'Edit Alias')]",
            )
            .Click();
          page.FindElement("//button[contains(text(),'Submit')]").Click();
          PortalMAIN.mainMessageHandler("Successfully renamed account");
          break;
        case "Verify":
          page
            .FindElement(
              "//tr[contains(., '" +
                ProjectSuite.Variables.ProfileBAN +
                "')]/td[contains(., 'Edit Alias')]",
            )
            .Click();
          page.FindElement("//i[contains(text(),'close')]").Click();
          break;
      }
      break;
  }
  page
    .FindElement("//div[@class='content']")
    .WaitProperty("VisibleOnScreen", true);
  Log.Checkpoint("| " + area + " (" + action + ") Verified |");
}
