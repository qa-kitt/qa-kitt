/***************************************************************
Name: Main
Description: General common functions
Author: Kitt Random
Creation Date: 08/24/2021
***************************************************************/

function killBrowser() {
  while (Aliases.Browser.Exists) {
    Aliases.Browser.Terminate();
  }
  Log.Checkpoint("| Browser Closed |");
}

function incognitoBrowser() {
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
  Main.refreshChromeBroswer();
  Sys.Refresh();
  if (equal(Sys.WaitBrowser("chrome").Exists, false)) {
    // environment handler
    switch (ProjectSuite.Variables.Environment) {
      case "QA":
        switch (Project.Variables.Site) {
          case "Back Office":
            envtURL = ProjectSuite.Variables.urlBackOfficeQA;
            break;
          case "Portal":
            envtURL = ProjectSuite.Variables.urlPortalQA;
            break;
        }
        break;
      case "STG":
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
    Aliases.Browser.BrowserWindow(0).Maximize();
  }
}

function refreshChromeBroswer() {
  // specify powershell file
  var psFile = Project.Path + "\\Stores\\Files\\killBrowsers.ps1";

  // run batch script and refresh
  WshShell.Run("powershell -file " + psFile);
  wait(2);
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
  Main.sgbGetCurrentURL();
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
  BackOfficeSQL.sqlEnableAutoQuoting();
  BackOfficeSQL.sqlEnableTradeExecution();
  PortalSQL.getProfileInfo();
  BackOfficeSQL.sqlEnableConnectionPermissions();
}

function sgbDataRefresh() {
  BackOfficeSQL.sqlClearTestApprovals();
  BackOfficeSQL.sqlSetDefaultProfileLimits();
  BackOfficeSQL.sqlEnableAutoQuoting();
  BackOfficeSQL.sqlEnableTradeExecution();
  BackOfficeSQL.sqlEnableConnectionPermissions();
}

function sgbTestAccount() {
  PortalSQL.getServiceInfo();
  PortalSQL.getProfileServiceInfo();
  PortalSQL.getRandomProfileAccount();
  PortalSQL.getProfileUserInfo();
  PortalSQL.getProfileAccountUserEntitlements();
}

function setEnvironment(envt) {
  ProjectSuite.Variables.ServiceType = null;
  Project.Variables.sgbEnvironment = envt;
  ProjectSuite.Variables.dboDatabaseServer = aqString.ToLower(
    "sql-silvergate-apis-shared-" + envt,
  );
  ProjectSuite.Variables.ProfileName = "TestComplete Automation";
  CommonMAIN.refreshChromeBroswer();
  Log.Checkpoint(
    "| Test Environmnet Set | - " + ProjectSuite.Variables.Environment,
  );
  CommonMAIN.launchChromeBrowser(ProjectSuite.Variables.Site);
  Log.Checkpoint("| Browser Launched | - " + ProjectSuite.Variables.Site);
  PortalMAIN.loginPortalTrader();
}

function cleanEnvironment() {
  sgbDataRefresh();
  sgbLogout();
  Aliases.Browser.Close();
  Log.Checkpoint("| Test Automation Complete | - Enjoy Some TACOS!!!");
}
