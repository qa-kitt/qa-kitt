//USEUNIT BackOfficeADMIN
//USEUNIT BackOfficeMAIN
//USEUNIT CommonMAIN
//USEUNIT CommonSQL
//USEUNIT PortalSQL

/***************************************************************
Name: BackOfficeAPI
Description: Verifying Back Office & Portal API Subscriptions
Author: Kitt Random
Creation Date: 08/24/2021
***************************************************************/
function addAPISubscription() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // add new subscription
  var addSub = page.FindElement(
    "//button[contains(text(),'Add Subscription')]",
  );
  addSub.Click();

  // set default test variables
  Project.Variables.sgbNewSubAlias = "Tacobout APIs";
  Project.Variables.sgbNewSubEmail = "master@tacoking.com";

  // enter info
  var alias = page.FindElement("//input[@id='subscription-create-alias']");
  var email = page.FindElement("//input[@id='subscription-create-email']");
  var finishLine = page.FindElement("//button[contains(text(),'Continue')]");
  alias.SetText(Project.Variables.sgbNewSubAlias);
  email.SetText(Project.Variables.sgbNewSubEmail);
  finishLine.Click();

  // but are you sure?
  var ruSure = page.FindElement("//div[contains(text(),'Continue')]");
  ruSure.Click();

  // enable account services
  BackOfficeAPI.cloneAPISubscription();
  Log.Checkpoint("| API Subscription Accounts Enabled |");
}

function defaultAPISubscription() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // change email back to default if needed
  if (
    !strictEqual(ProjectSuite.Variables.SubServiceEmail, "noreply@rand0m.ai")
  ) {
    // revert api email to default
    ProjectSuite.Variables.SubServiceEmail = "noreply@rand0m.ai";
    var currentEmail = page.WaitElement(
      "//input[@id='api-subscription-email']",
    );
    currentEmail.SetText(ProjectSuite.Variables.SubServiceEmail);
    var save = page.WaitElement("//button[contains(text(),'Save Changes')]");
    save.Click();
    PortalMAIN.mainMessageHandler("Success");
    Log.Checkpoint(
      "| Default API Email Updated | - " +
        ProjectSuite.Variables.SubServiceEmail,
    );

    // switch profiles and approve request
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
    BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0.1");
  }

  // change alias back to default if needed
  if (!strictEqual(ProjectSuite.Variables.SubServiceAlias, "QA v3 - TCA")) {
    // edit permissions
    ProjectSuite.Variables.SubServiceAlias = "QA v3 - TCA";
    var sub = page.FindElement(
      "//i[@class='material-icons actions dropdown-toggle']",
    );
    sub.Click();
    var editSub = page.FindElement(
      "//button[contains(text(),'Edit Permissions')]",
    );
    editSub.Click();

    // revert api alias to default
    var submit = page.FindElement("//button[contains(text(),'Submit')]");
    var currentAlias = page.FindElement("//input[@id='subscription-alias']");
    currentAlias.SetText(ProjectSuite.Variables.SubServiceAlias);
    submit.Click();
    PortalMAIN.mainMessageHandler(
      "Permissions for " +
        ProjectSuite.Variables.SubServiceAlias +
        " have been added",
    );
    Log.Checkpoint(
      "| Default API Alias Updated | - " +
        ProjectSuite.Variables.SubServiceAlias,
    );

    // switch profiles and approve request
    BackOfficeMAIN.sgbSwitchBackOfficeUser();
    BackOfficeADMIN.adminApprovalAction("Profiles", "Approve", "0.1");
  }
}

function editAPISubscriptionAlias() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // edit permissions
  var sub = page.FindElement(
    "//i[@class='material-icons actions dropdown-toggle']",
  );
  sub.Click();
  var editSub = page.FindElement(
    "//button[contains(text(),'Edit Permissions')]",
  );
  editSub.Click();

  // get and edit alias
  var submit = page.FindElement("//button[contains(text(),'Submit')]");
  var currentAlias = page.FindElement("//input[@id='subscription-alias']");
  Log.Message(
    "LOG: current api alias = " + ProjectSuite.Variables.SubServiceAlias,
  );
  currentAlias.SetText(Project.Variables.sgbNewSubAlias);
  submit.Click();
  PortalMAIN.mainMessageHandler(
    "Permissions for " + Project.Variables.sgbNewSubAlias + " have been added",
  );
  Log.Message("LOG: new api alias = " + Project.Variables.sgbNewSubAlias);
}

function editAPISubscriptionEmail() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // get current api email
  var currentEmail = page.WaitElement("//input[@id='api-subscription-email']");
  ProjectSuite.Variables.SubServiceEmail = currentEmail.Text;
  Log.Message(
    "LOG: current api email = " + ProjectSuite.Variables.SubServiceEmail,
  );

  // edit api email and save
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Trader") &&
    equal(currentEmail.isContentEditable, false)
  ) {
    Log.Checkpoint(
      "| Editing Disabled Successfully | - " +
        ProjectSuite.Variables.ActiveUserType,
    );
  } else {
    currentEmail.SetText(Project.Variables.sgbNewSubEmail);
    var save = page.WaitElement("//button[contains(text(),'Save Changes')]");
    save.Click();
    PortalMAIN.mainMessageHandler("Success");
    Log.Message(
      "LOG: profile API email = FROM: " +
        ProjectSuite.Variables.SubServiceEmail +
        " TO: " +
        Project.Variables.sgbNewSubAlias,
    );
  }
}

function editAPISubscriptionKeys() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // regenerate primary key
  var sub = page.FindElement(
    "//i[@class='material-icons actions dropdown-toggle']",
  );
  sub.Click();
  var editPrimmary = page.FindElement(
    "//button[contains(text(),'Regenerate Primary Key')]",
  );
  editPrimmary.Click();
  var fullSend = page.FindElement("//div[contains(text(),'CONTINUE')]");
  fullSend.Click();
  PortalMAIN.mainMessageHandler("Success");

  // regenerate secondary key
  sub.Click();
  var editPrimmary = page.FindElement(
    "//button[contains(text(),'Regenerate Secondary Key')]",
  );
  editPrimmary.Click();
  fullSend.Click();
  PortalMAIN.mainMessageHandler("Success");
}

function editAPISubscriptionSecret() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // regenerate client secret (default api subscription table = 3 rows)
  PortalMAIN.navigatePortalAdmin("profileadmin/subscriptions");
  page.WaitElement("//table[1]");
  var editSecret = page.FindElement(
    "//table/tbody/tr//i[@data-toggle='dropdown']",
  );
  editSecret.Click();
  var newSecret = page.FindElement(
    "//table/tbody/tr//button[contains(.,'Regenerate API Secret')]",
  );
  newSecret.Click();

  // verify new client secret
  var fullSend = page.FindElement("//div[contains(text(),'CONTINUE')]");
  fullSend.Click();
  var fullSecret = page.FindElement(
    "//div[contains(@class, 'show-modal')]//div[@class='d-flex']/div",
  );
  var copySecret = page.FindElement(
    "//div[contains(@class, 'show-modal')]//div[@class='d-flex']/i",
  );
  copySecret.Click();
  ProjectSuite.Variables.SubClientSecret = fullSecret.contentText;
  var dismiss = page.FindElement("//div[contains(text(),'Dismiss')]");
  dismiss.Click();
  Log.Checkpoint("| API Client Secret Regenerated |");
}

function suspendAPISubscription() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // suspend subscription (default api subscription table = 3 rows)
  if (page.FindElement("//table[contains(., 'Display Name')]").RowCount > 3) {
    var edit2ndSub = page.FindElement(
      "//table[1]/tbody/tr[2]//i[@data-toggle='dropdown']",
    );
    edit2ndSub.Click();
    var suspend2ndSub = page.FindElement(
      "//table[1]/tbody/tr[2]//button[contains(text(),'Suspend')]",
    );
    suspend2ndSub.Click();
    var fullSend = page.FindElement("//div[contains(text(),'CONTINUE')]");
    fullSend.Click();
    PortalMAIN.mainMessageHandler("Success");
  }
}

function verifyAPISubscription() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // get current alias
  var currentAlias = page.FindElement("//tbody/tr/td[1]"); // first row
  ProjectSuite.Variables.SubServiceAlias = currentAlias.contentText;
  Log.Checkpoint(
    "| Enabled API Alias Verified | - " +
      ProjectSuite.Variables.SubServiceAlias,
  );

  // get current api email
  var currentEmail = page.WaitElement("//input[@id='api-subscription-email']");
  ProjectSuite.Variables.SubServiceEmail = currentEmail.Text;
  Log.Checkpoint(
    "| Enabled API Email Verified | - " +
      ProjectSuite.Variables.SubServiceEmail,
  );

  // get current api keys
  BackOfficeAPI.verifyAPISubscriptionKeys();

  // verify view/edit permissions
  var sub, editSub, alias;
  sub = page.FindElement(
    "//i[@class='material-icons actions dropdown-toggle']",
  );
  sub.Click();
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Trader") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Front Office")
  ) {
    editSub = page.FindElement("//button[contains(text(),'View Permissions')]");
    editSub.Click();
    alias = page.FindElement("//input[@id='subscription-alias']");
    if (equal(alias.isContentEditable, false)) {
      Log.Checkpoint(
        "| Profile Permissions Editing Disabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
    }
  }
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Super Admin") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Back Office Admin")
  ) {
    editSub = page.FindElement("//button[contains(text(),'Edit Permissions')]");
    editSub.Click();
    alias = page.FindElement("//input[@id='subscription-alias']");
    if (equal(alias.isContentEditable, true)) {
      Log.Checkpoint(
        "| Profile Permissions Editing Enabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
    }
  }
  page.FindElement("//i[contains(text(),'close')]").Click();
}

function verifyAPISubscriptionAlias() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // verify changed alias
  var currentAlias = page.FindElement("//tbody/tr/td[1]"); // first row
  if (
    equal(currentAlias.contentText, ProjectSuite.Variables.DynamicVarStr) &&
    !equal(currentAlias.contentText, ProjectSuite.Variables.SubServiceAlias)
  ) {
    Log.Checkpoint(
      "| API Alias Updated Successfully | - " + currentAlias.contentText,
    );
  } else {
    Log.Warning(
      "WARNING: no match found - new alias = " +
        currentAlias.contentText +
        " | old alias = " +
        ProjectSuite.Variables.SubServiceAlias,
    );
  }
}

function verifyAPISubscriptionEmail() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // get current api email
  var currentEmail = page.WaitElement("//input[@id='api-subscription-email']");
  if (
    equal(currentEmail.Text, ProjectSuite.Variables.SubServiceEmail) ||
    equal(currentEmail.Text, ProjectSuite.Variables.DynamicVarStr)
  ) {
    Log.Checkpoint("| Profile API Email Verified | - " + currentEmail.Text);
  }

  // permission handling
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Trader") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Front Office Admin")
  ) {
    if (equal(currentEmail.isContentEditable, false)) {
      Log.Checkpoint(
        "| Email Editing Disabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
    }
  }
}

function verifyAPISubscriptionKeys() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // permission handling
  var seeOn;
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Trader") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Front Office Admin")
  ) {
    seeOn = page.WaitNamedChild(
      "//tr[1]/td[3]//i[contains(., 'visibility')]",
      0,
    );
    if (equal(seeOn.Exists, false)) {
      Log.Checkpoint(
        "| Show Secret Disabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
    }
  } else {
    seeOn = page.FindElement("//tr[1]/td[3]//i[contains(., 'visibility')]");
    // get current api primary key (row 1 col 3)
    var copyPrimary = page.FindElement(
      "//tr[1]/td[3]//i[contains(., 'content_copy')]",
    );
    seeOn.Click();
    copyPrimary.Click();
    var seeOff = page.FindElement(
      "//tr[1]/td[3]//i[contains(., 'visibility_off')]",
    );
    var primaryKey = page.FindElement("//tr[1]/td[3]//div[@class='subkey']");
    ProjectSuite.Variables.SubPrimaryKey = primaryKey.contentText;
    Log.Checkpoint(
      "| Primary Key Obtained | - " +
        ProjectSuite.Variables.SubPrimaryKey.DecryptedValue,
    );
    seeOff.Click();

    // get current api secondary key (row 1 col 4)
    var seeOn = page.FindElement("//tr[1]/td[4]//i[contains(., 'visibility')]");
    var copySecondary = page.FindElement(
      "//tr[1]/td[4]//i[contains(., 'content_copy')]",
    );
    seeOn.Click();
    copySecondary.Click();
    var seeOff = page.FindElement(
      "//tr[1]/td[4]//i[contains(., 'visibility_off')]",
    );
    var secondaryKey = page.FindElement("//tr[1]/td[4]//div[@class='subkey']");
    ProjectSuite.Variables.SubSecondaryKey = secondaryKey.contentText;
    Log.Checkpoint(
      "| Secondary Key Obtained | - " +
        ProjectSuite.Variables.SubSecondaryKey.DecryptedValue,
    );
    seeOff.Click();

    // log and stop runner
    Log.Checkpoint(
      "| Profile API Subscription Keys Encrypted/Decrypted & Copied |",
    );
  }
}

function verifyAPISubscriptionSecret() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeAPI.goToAPISubscriptions();

  // regenerate client secret permissions
  var editSecret = page.FindElement(
    "//table/tbody/tr//i[@data-toggle='dropdown']",
  );
  editSecret.Click();
  var newSecret;
  if (
    equal(ProjectSuite.Variables.ActiveUserType, "Trader") ||
    equal(ProjectSuite.Variables.ActiveUserType, "Front Office Admin")
  ) {
    newSecret = page.WaitNamedChild(
      "//table/tbody/tr//button[contains(.,'Regenerate API Secret')]",
      0,
    );
    if (equal(newSecret.Exists, false)) {
      Log.Checkpoint(
        "| Regenerate API Secret Disabled | user - " +
          ProjectSuite.Variables.ActiveUserType,
      );
    }
  } else {
    newSecret = page.FindElement(
      "//table/tbody/tr//button[contains(.,'Regenerate API Secret')]",
    );
    Log.Checkpoint(
      "| Regenerate API Secret Enabled | user - " +
        ProjectSuite.Variables.ActiveUserType,
    );
  }
}

function goToAPISubscriptions() {
  // open profile subscriptions
  var page = Sys.Browser("*").Page("*");
  BackOfficeADMIN.adminProfileNavigation("Subscriptions");
  page.FindElement("//table/tbody/tr").WaitProperty("VisibleOnScreen", true);
  ProjectSuite.Variables.SubServiceAlias = page.FindElement(
    "//table[1]/tbody/tr[1]/td[1]",
  ).contentText;
}

function cloneAPISubscription() {
  // clone existing portal api subscription settings
  var page = Sys.Browser("*").Page("*");
  page.WaitElement("//div[contains(text(),'Select a Subscription')]");
  var submit = page.FindElement("//button[contains(text(),'Submit')]");
  var selectSub = page.FindElement("//i[contains(text(),'arrow_drop_down')]");
  selectSub.Click();
  var sub = page.FindElement(
    "//div[contains(text(),'" + ProjectSuite.Variables.SubServiceAlias + "')]",
  );
  sub.Click();
  var cloneSub = page.FindElement("//button[contains(text(),'Clone')]");
  cloneSub.Click();
  page
    .FindElement("//table[contains(@class, 'no-more-tables')]")
    .WaitProperty("VisibleOnScreen", true);
  submit.Click();
  PortalMAIN.mainMessageHandler(
    "Permissions for " + Project.Variables.sgbNewSubAlias + " have been added",
  );
}

function apiPoweshell_POSTinternal() {
  // specify powershell file
  var psFile = Project.Path + "\\Stores\\Files\\apiPowershell_POSTinternal.ps1";

  // Run powershell script to invoke api rest method
  //api/transfer/internal
  WshShell.Run("powershell -file " + psFile);
  Sys.Refresh();
}
