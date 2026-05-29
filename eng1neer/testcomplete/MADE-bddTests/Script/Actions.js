/***************************************************************
Name: Actions
Description: General common actions functions
Author: Kitt Random
Creation Date: 11/24/2021
***************************************************************/
var page = Sys.Browser("*").Page("*");

function sgbCloseAction() {
  // perform close action
  var closeBtn = page.WaitElement("//i[contains(text(),'close')]");
  closeBtn.Click();
}

function sgbSearchPage(searchFor) {
  // set page variables
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
  Aliases.Browser.sgbP_Main.Menu;
  page
    .FindElement("#user-navbar-dropdown")
    .WaitProperty("VisibleOnScreen", true);

  // get current user
  var currentUser = page.FindElement(
    "//div[@class='my-auto']/div[1]",
  ).contentText;
  Project.Variables.ProfileUserFirst = aqString.Trim(
    aqString.Remove(currentUser, 14, 7),
    aqString.stAll,
  );
  Project.Variables.ProfileUserLast = aqString.Trim(
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
      ProjectSuite.Variables.ActiveUserType = "Front Office";
      break;
    case "User 4":
      ProjectSuite.Variables.ActiveUserType = "Trader";
      break;
  }
}
