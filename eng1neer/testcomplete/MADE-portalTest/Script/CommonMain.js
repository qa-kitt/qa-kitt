//USEUNIT PortalMAIN
//USEUNIT PortalSQL

/***************************************************************
Name: Common
Description: General common functions
Author: Kitt Random
Creation Date: 08/24/2021
***************************************************************/
function setEnvironment(envt) {
  ProjectSuite.Variables.ServiceType = null;
  ProjectSuite.Variables.Environment = envt;
  ProjectSuite.Variables.Site = "Portal"; //default
  ProjectSuite.Variables.dboDatabaseServer = aqString.ToLower(
    "sql-silvergate-apis-shared-" + envt,
  );
  ProjectSuite.Variables.TransactionType = "Transfer";
  CommonMAIN.refreshChromeBroswer();
  Log.Checkpoint(
    "| Test Environmnet Set | - " + ProjectSuite.Variables.Environment,
  );
  CommonMAIN.launchChromeBrowser(ProjectSuite.Variables.Site);
  Log.Checkpoint("| Browser Launched | - " + ProjectSuite.Variables.Site);
  PortalMAIN.loginPortalTrader();
  PortalSQL.getRandomAccount();
}

function cleanUpEnvironment() {
  CommonMAIN.sgbDataRefresh();
  CommonMAIN.sgbLogout();
  Sys.Browser("*").Close();
  Log.Checkpoint("| Test Automation Complete | - Enjoy Some TACOS!!!");
}

function killChromeBrowser() {
  while (Sys.WaitBrowser("chrome").Exists) {
    Sys.Browser("chrome").Terminate();
  }
  Log.Checkpoint("| Browser Closed |");
}

function chromeIncognitoBrowser() {
  // launch mock service .bat
  var batch = Sys.OleObject("WScript.Shell");
  var runMockService = batch.Run(
    Project.Path + "\\Stores\\Files\\Run_ChromeIncognito.bat",
  );
  if (
    Sys.Process("cmd", 2).Window(
      "ConsoleWindowClass",
      "Administrator:  CHROME INCOGNITO",
      1,
    ).Exists
  ) {
    Log.Checkpoint("| Chrome Incognito Launched |");
    Sys.Process("cmd", 2).Close();
  }
}

function launchChromeBrowser(envtURL) {
  // launch browser and maximize window
  Sys.Refresh();
  if (equal(Sys.WaitBrowser("chrome").Exists, false)) {
    // environment handler
    switch (ProjectSuite.Variables.Environment) {
      case "QA":
        ProjectSuite.Variables.urlIdentity = "https://identity-dev.rand0m.ai/";
        switch (ProjectSuite.Variables.Site) {
          case "Back Office":
            envtURL = ProjectSuite.Variables.urlBackOfficeQA;
            break;
          case "Portal":
            envtURL = ProjectSuite.Variables.urlPortalQA;
            break;
        }
        break;
      case "STG":
        ProjectSuite.Variables.urlIdentity = "https://identity-stg.rand0m.ai/";
        switch (ProjectSuite.Variables.Site) {
          case "Back Office":
            envtURL = ProjectSuite.Variables.urlBackOfficeSTG;
            break;
          case "Portal":
            envtURL = ProjectSuite.Variables.urlPortalSTG;
            break;
        }
        break;
    }
    Browsers.Item(btChrome).Run(envtURL, 2500);
    Sys.Browser().BrowserWindow(0).Maximize();
  }
}

function refreshChromeBroswer() {
  // specify powershell file
  var psFile = Project.Path + "\\Stores\\Files\\killBrowsers.ps1";

  // run batch script and refresh
  WshShell.Run("powershell -file " + psFile);
  CommonMAIN.wait(2);
  Sys.Refresh();
}

function clearChromeCookies() {
  // specify powershell file
  var psFile = Project.Path + "\\Stores\\Files\\clearInternetData.ps1";

  // Run powershell script and refresh
  WshShell.Run("powershell -file " + psFile);
  Sys.Refresh();
}

function runPoswerShellScript(file) {
  // specify powershell file
  var psFile = Project.Path + "\\Stores\\Files\\" + file;

  // Run powershell script and refresh
  WshShell.Run("powershell -file " + psFile);
  Sys.Refresh();
}

function wait(timeInSeconds) {
  Delay(timeInSeconds * 1000);
}

function getRandomInteger(min, max) {
  var intMin = min;
  var intMax = max;
  if (equal(intMin, null) && equal(intMin, null)) {
    intMin = 1;
    intMax = 10;
  }
  return Math.round(Math.random() * (intMax - intMin) + intMin);
}

function getRandomFloat(max) {
  return Math.round((Math.random() * (max - 0) + 0) * 100) / 100;
}

function getRandomString() {
  return Math.random().toString(16).substr(2, 8);
}

function sgbLogin(envt, site, user, pass) {
  // navigate to specified environment
  CommonMAIN.launchChromeBrowser(site);

  // set page variables
  var page = Sys.Browser("*").Page(ProjectSuite.Variables.urlIdentity);
  page.WaitElement("#okta-signin-submit");
  var email = page.FindElement(
    "//input[@id=(//label[contains(.,'Email')]/@for)]",
  );
  var password = page.FindElement(
    "//input[@id=(//label[contains(.,'Password')]/@for)]",
  );
  var login = page.FindElement("#okta-signin-submit");

  // login with credentials
  email.SetText(user);
  password.SetText(pass);
  login.ClickButton();

  // timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();

  // environment handler
  switch (envt) {
    case "QA":
      switch (site) {
        case "Back Office":
          page = Sys.Browser("*").Page(
            ProjectSuite.Variables.urlBackOfficeQA + "profiles",
          );
          page.WaitElement("//tbody/tr[1]"); // wait for profile load
          break;
        case "Portal":
          page = Sys.Browser("*").Page(
            ProjectSuite.Variables.urlPortalQA + "accounts/wallet",
          );
          page.WaitElement("//div[@class='row normal-row']/div[1]"); // wait for account load
          break;
      }
      break;
    case "STG":
      switch (site) {
        case "Back Office":
          page = Sys.Browser("*").Page(
            ProjectSuite.Variables.urlBackOfficeSTG + "profiles",
          );
          page.WaitElement("//tbody/tr[1]"); // wait for profile load
          break;
        case "Portal":
          page = Sys.Browser("*").Page(
            ProjectSuite.Variables.urlPortalSTG + "accounts/wallet",
          );
          page.WaitElement("//div[@class='row normal-row']/div[1]"); // wait for account load
          break;
      }
      break;
  }
  stopWatch.Stop();
  Log.Checkpoint("| LOGIN SPEED | - " + stopWatch.ToString());
}

function sgbLogout() {
  // find logout
  var page = Sys.Browser("*").Page("*");
  var profile = page.FindElement("//a[@id='user-navbar-dropdown']");
  var logout = page.FindElement("//a[@name='navbar-logout']");

  // logout
  profile.Click();
  logout.Click();

  // timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();

  // wait (if needed)
  var loopTimeout = 0;
  while (
    !equal(page.URL, ProjectSuite.Variables.urlIdentity) ||
    loopTimeout < 15
  ) {
    loopTimeout++;
    Log.Message(
      "LOG: current url = " +
        page.URL +
        " | expected url = " +
        ProjectSuite.Variables.urlIdentity,
    );
    CommonMAIN.wait(1);
    sgbGetCurrentURL();
    if (equal(page.URL, ProjectSuite.Variables.urlIdentity)) {
      Log.Checkpoint(
        "| MATCH | " + page.URL + " = " + ProjectSuite.Variables.urlIdentity,
      );
      break;
    }
  }

  // map login objects
  page = Sys.Browser("*").Page("*");
  var loginPage = page.FindElement("//div[@class='auth-content']");
  var loginEmail = page.FindElement("//input[@id='okta-signin-username']");
  var loginPass = page.FindElement("//input[@id='okta-signin-password']");

  // verify return to login
  if (equal(loginPage.Exists, true)) {
    Log.Checkpoint("| Successful Logout |");
    // clear cached info
    if (!equal(loginEmail.Text, "")) {
      loginEmail.SetText("");
      loginPass.SetText("");
    }
  } else {
    Log.Warning("WARNING: login page not found");
  }
  stopWatch.Stop();
  Log.Checkpoint("| LOGOUT SPEED | - " + stopWatch.ToString());
}

function sgbCloseAction() {
  // perform close action
  var page = Sys.Browser("*").Page("*");
  var closeBtn = page.WaitElement("//i[contains(text(),'close')]");
  closeBtn.Click();
}

function sgbSearchPage(searchFor) {
  // set page variables
  var page = Sys.Browser("*").Page("*");
  var search = page.FindElement("//div[contains(@class, 'search-box')]");
  var searchBy = search.FindChildByXPath("//input");

  // perform search action
  searchBy.SetText(searchFor);

  // select result
  page.FindElement("//tbody//tr[1]").WaitProperty("VisibleOnScreen", true);
  var searchResult = page.FindElement(
    "//th[contains(text(), '" + searchFor + "')]",
  );
  searchResult.Click();
  Log.Checkpoint("| Search Found | - " + searchFor);
}

function sgbGetCurrentURL() {
  // capture current url and set global variable
  var page = Sys.Browser("*").Page("*");
  var backofficeURL = "backoffice";
  var portalURL = "portal";
  var identityURL = "identity";
  var backofficeSite = aqString.Find(page.URL, backofficeURL);
  var portalSite = aqString.Find(page.URL, portalURL);
  var identitySite = aqString.Find(page.URL, identityURL);
  if (!equal(backofficeSite, -1)) {
    Project.Variables.sgbCurrentSite = backofficeURL;
  }
  if (!equal(portalSite, -1)) {
    Project.Variables.sgbCurrentSite = portalURL;
  }
  if (!equal(identitySite, -1)) {
    Project.Variables.sgbCurrentSite = identityURL;
  }
  // Project.Variables.sgbCurrentURL = page.URL;
  Log.Message(
    "LOG: current " +
      Project.Variables.sgbCurrentSite +
      " url = " +
      Project.Variables.sgbCurrentURL,
  );
}

function sgbGetCurrentUser() {
  // refresh page
  var page = Sys.Browser("*").Page("*");
  page.FindElement("#navbar-content").WaitProperty("VisibleOnScreen", true);

  // get current user
  var currentUser = page.FindElement(
    "//a[@id='user-navbar-dropdown']/div/div",
  ).contentText;
  ProjectSuite.Variables.ProfileUserFirst = aqString.Trim(
    aqString.Remove(currentUser, 14, 7),
    aqString.stAll,
  );
  ProjectSuite.Variables.ProfileUserLast = aqString.Trim(
    aqString.Remove(currentUser, 0, 14),
    aqString.stAll,
  );
  Project.Variables.sgbCurrentUser =
    ProjectSuite.Variables.ProfileUserFirst +
    " " +
    ProjectSuite.Variables.ProfileUserLast;
  Log.Checkpoint(
    "| Current Active User = " +
      ProjectSuite.Variables.ProfileUserFirst +
      " " +
      ProjectSuite.Variables.ProfileUserLast +
      " |",
  );

  // update active user type
  switch (ProjectSuite.Variables.ProfileUserLast) {
    case "User 1":
      ProjectSuite.Variables.ActiveUserType = "Super Admin";
      break;
    case "User 2":
      ProjectSuite.Variables.ActiveUserType = "Back Office Admin";
      break;
    case "User 3":
      ProjectSuite.Variables.ActiveUserType = "Front Office Admin";
      break;
    case "User 4":
      ProjectSuite.Variables.ActiveUserType = "Trader";
      break;
  }
}

function utcDate() {
  var date = aqDateTime.Today();
  var time = aqDateTime.Time();
  var gmtTime =
    aqString.Replace(
      aqConvert.DateTimeToFormatStr(date, "%Y/%m/%d"),
      "/",
      "-",
    ) +
    " " +
    aqConvert.DateTimeToFormatStr(time, "%H:%M:%S");

  Log.Checkpoint("| GMT/UTC DateTime | - " + gmtTime);
  return gmtTime;
}

function getCurrentDate() {
  var currentDate = aqDateTime.Today();
  var today = aqConvert.DateTimeToFormatStr(currentDate, "%m/%d/%y");
  ProjectSuite.Variables.Date1 = today;
  return today;
}

function getPastDate(days) {
  var currentDate = aqDateTime.Today();
  var today = aqConvert.DateTimeToStr(aqDateTime.AddHours(currentDate, -3)); // PST
  var pastDate = aqDateTime.AddDays(currentDate, days); // how many days in the past
  var pastDateX = aqConvert.DateTimeToFormatStr(pastDate, "%m/%d/%y");
  ProjectSuite.Variables.Date2 = pastDateX;
  return pastDateX;
}

function sgbRefresh() {
  // refresh to home page (if needed)
  var envt = aqString.ToLower(ProjectSuite.Variables.Environment);
  CommonMAIN.sgbGetCurrentURL();
  if (
    equal(Project.Variables.sgbCurrentSite, "portal") &&
    !equal(
      Project.Variables.sgbCurrentURL,
      "https://portal-" + envt + ".rand0m.ai/accounts/wallet",
    )
  ) {
    PortalMAIN.navigatePortal("Home");
  }
  if (
    equal(Project.Variables.sgbCurrentSite, "backoffice") &&
    !equal(
      Project.Variables.sgbCurrentURL,
      "https://backoffice-" + envt + ".rand0m.ai/profiles",
    )
  ) {
    BackOfficeMAIN.navigateBackOffice("profiles");
  }
  if (
    equal(Project.Variables.sgbCurrentSite, "identity") &&
    equal(Project.Variables.sgbCurrentURL, "https://identity-dev.rand0m.ai/")
  ) {
    PortalMAIN.loginPortalTrader();
  }

  // clean-up/re-stage test data
  BackOfficeSQL.sqlClearTestApprovals();
  BackOfficeSQL.sqlSetDefaultProfileLimits();
  PortalSQL.getProfileInfo();
  BackOfficeSQL.sqlEnableConnectionPermissions();
}

function sgbDataRefresh() {
  BackOfficeSQL.sqlClearTestApprovals();
  BackOfficeSQL.sqlSetDefaultProfileLimits();
  BackOfficeSQL.sqlEnableConnectionPermissions();
}

function sgbTestAccount() {
  PortalSQL.getServiceInfo();
  PortalSQL.getProfileServiceInfo();
  PortalSQL.getRandomProfileAccount();
  PortalSQL.getProfileUserInfo();
  PortalSQL.getProfileAccountUserEntitlements();
}

function SendEmail(mFrom, mTo, mSubject, mBody, mAttach) {
  var schema, mConfig, mMessage;

  try {
    schema = "http://schemas.microsoft.com/cdo/configuration/";
    mConfig = getActiveXObject("CDO.Configuration");
    mConfig.Fields.$set("Item", schema + "sendusing", 2); // cdoSendUsingPort
    mConfig.Fields.$set("Item", schema + "smtpusessl", 1); // Use SSL
    // mConfig.Fields.$set("Item", schema + "sendtls", 1);

    // sgb relay server
    mConfig.Fields.$set(
      "Item",
      schema + "smtpserver",
      "mxa-006af402.gslb.pphosted.com",
    ); // default SMTP server
    mConfig.Fields.$set("Item", schema + "smtpserverport", 25);

    // If you use Gmail --
    // Enable the Allow less secure apps option for your account
    // mConfig.Fields.$set("Item", schema + "smtpserver", "smtp.gmail.com");
    // mConfig.Fields.$set("Item", schema + "smtpserverport", 465);

    // If you use Outlook --
    // mConfig.Fields.$set("Item", schema + "smtpserver", "smtp-mail.outlook.com");
    // mConfig.Fields.$set("Item", schema + "smtpserverport", 587);

    // If you use Office365 --
    // mConfig.Fields.$set("Item", schema + "smtpserver", "smtp.office365.com");
    // mConfig.Fields.$set("Item", schema + "smtpserverport", 587);

    mConfig.Fields.$set("Item", schema + "smtpauthenticate", 1); // Authentication mechanism

    // credentials
    mConfig.Fields.$set("Item", schema + "sendusername", "noreply@rand0m.ai");
    mConfig.Fields.$set(
      "Item",
      schema + "sendpassword",
      ProjectSuite.Variables.EmailPass.DecryptedValue,
    );

    mConfig.Fields.Update();

    mMessage = getActiveXObject("CDO.Message");
    mMessage.Configuration = mConfig;
    mMessage.From = mFrom;
    mMessage.To = mTo;
    mMessage.Subject = mSubject;
    mMessage.HTMLBody = mBody;

    aqString.ListSeparator = ",";
    for (let i = 0; i < aqString.GetListLength(mAttach); i++)
      mMessage.AddAttachment(aqString.GetListItem(mAttach, i));
    mMessage.Send();
  } catch (exception) {
    Log.Error("Email cannot be sent", exception.message);
    return false;
  }
  Log.Message("Message to <" + mTo + "> was successfully sent");
  return true;
}

function EventControls_OnLogError(Sender, LogParams) {
  // envt handler
  switch (ProjectSuite.Variables.Environment) {
    case "QA":
      var alertRecipient = "noreply@rand0m.ai";
      break;
    case "STG":
      var alertRecipient = "SEtestingalerts@rand0m.ai";
      break;
  }

  // regression failure alert
  if (equal(ProjectSuite.Variables.ActiveTestSuite, "Regression")) {
    LogParams.Locked = false;
    LogParams.Priority = pmHighest;
    LogParams.FontStyle.Bold = true;
    LogParams.FontColor = clSilver;
    LogParams.Color = clRed;

    // send alert email w/screenshot
    if (
      CommonMAIN.SendEmail(
        "noreply@rand0m.ai",
        alertRecipient,
        "PartnerPortal Automation Failure",
        "Regression Failure in " +
          ProjectSuite.Variables.Environment +
          " - " +
          aqTestCase.CurrentTestCase.Name +
          " ERROR: " +
          LogParams.MessageText,
        Log.Picture(Sys.Desktop.Picture(), "Image of the error"),
      )
    ) {
      Log.Checkpoint("| Alert Email Sent |");
      Sys.Browser("*").Page("*").Refresh();
    } else {
      Log.Warning("WARNING: alert email unsuccessful");
    }
  }
}

function EventControls_OnLogWarning(Sender, LogParams) {
  // Check if the message includes the desired substring
  var locked = aqString.Find(LogParams.Str, "Improve your test performance");
  if (locked != -1) {
    // If found, block the message
    LogParams.Locked = true;
  } else {
    // Else, post the message
    LogParams.Locked = false;
  }
}

function EventControls_OnStopTest(Sender) {
  var foundFiles, aFile;
  var DateTime = aqConvert.DateTimeToFormatStr(
    aqDateTime.Today(),
    aqString.Replace("%m/%d/%y", "/", "-"),
  );
  var fName = Project.Path + "MHT_Files\\Summary-" + DateTime + ".mht";
  foundFiles = aqFileSystem.FindFiles(Project.Path + "MHT_Files\\", "*.mht");
  Log.SaveResultsAs(fName, lsMHT, true, 0);

  if (foundFiles != null) {
    Log.Checkpoint("Summary Report Saved - " + Project.Path + "MHT_Files\\");
  } else {
    Log.Message("No files were found.");
  }
}

// Verify MHT Files
function verifyFiles_MHT() {
  var foundFiles, aFile;
  foundFiles = aqFileSystem.FindFiles(Project.Path + "MHT_Files\\", "*.mht");
  if (foundFiles != null) {
    while (foundFiles.HasNext()) {
      aFile = foundFiles.Next();
      deleteFiles_MHT(aFile);
    }
  } else {
    Log.Message("No files were found.");
  }
}

// Delete MHT Files Older Than 5 Minutes
function deleteFiles_MHT(aFile) {
  var DateTime = aqDateTime.Now();
  var DateTimeMinusXMinutes = aqDateTime.AddMinutes(DateTime, -5);
  Log.Message("NOW: " + DateTime + " | THEN: " + DateTimeMinusXMinutes);

  if (aFile.DateLastModified < DateTimeMinusXMinutes) {
    FilePathString = aqConvert.VarToStr(aFile.Path);
    aqFileSystem.DeleteFile(FilePathString);
    Log.Message(FilePathString + " deleted");
  } else {
    Log.Message("No files were deleted");
  }
}
