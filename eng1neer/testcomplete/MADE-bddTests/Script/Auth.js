//UESUNIT Main

/***************************************************************
Name: Auth
Description: General login/logout functions
Author: Kitt Random
Creation Date: 11/24/2021
***************************************************************/

function sgbLogin(envt, site, user, pass) {
  // navigate to specified environment
  Main.launchChromeBrowser(site);

  // set page variables
  var page = Aliases.Browser.sgbID;
  page.WaitElement("#okta-signin-submit");
  Aliases.Browser.sgbID.Auth.Email.SetText(user);
  Aliases.Browser.sgbID.Auth.Password.SetText(pass);
  Aliases.Browser.sgbID.Auth.Login.ClickButton();

  // timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();

  // environment handler
  switch (envt) {
    case "QA":
      switch (site) {
        case "Back Office":
          Aliases.Browser.sgbBO_Main.WaitAliasChild("Nav"); //.WaitElement("//tbody/tr[1]"); // wait for profile load
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
    Main.wait(1);
    Main.sgbGetCurrentURL();
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

function fgppLogin() {
  // timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();

  // login
  var fgpp = Aliases.Browser.pageFinastra;
  if (equal(fgpp.login_Form.VisibleOnScreen, true)) {
    fgpp.login_Form.UserId.SetText(Project.Variables.fgppUsername);
    fgpp.login_Form.Password.SetText(
      Project.Variables.fgppPassword.DecryptedValue,
    );
    fgpp.login_Form.SigninBtn.Click();
    Log.Message(
      "LOG: user = " +
        Project.Variables.fgppUsername +
        " | envt = " +
        Project.Variables.fgppEnvironment,
    );
  }

  // stop timer
  stopWatch.Stop();
  Log.Checkpoint("| LOGIN SPEED | - " + stopWatch.ToString());
}

function fgppLogout() {
  // timer
  var stopWatch = HISUtils.StopWatch;
  stopWatch.Start();

  // logout
  var fgpp = Aliases.Browser.pageFinastra;
  fgpp.Nav.Click();
  fgpp.Nav.Dropdown.Logout.Click();

  // verify
  aqObject.CheckProperty();

  // stop timer
  stopWatch.Stop();
  Log.Checkpoint("| LOGOUT SPEED | - " + stopWatch.ToString());
}
