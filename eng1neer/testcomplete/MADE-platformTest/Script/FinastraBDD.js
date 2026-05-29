//USEUNIT CommonMAIN

Given("The test data has been refreshed and Browser is open", function (){
  CommonMAIN.refreshChromeBroswer(); 
  Log.Checkpoint("| Test Environmnet Set | - " + Project.Variables.gppEnvironment);
  
});

Given("A user has navigated to the Finastra Login page", function (){
  CommonMAIN.launchChromeBrowser(Project.Variables.gppURL);
  Log.Checkpoint("| Webpage Launched | - " + Project.Variables.gppURL);
});

When("The user logs in", function (){
  CommonMAIN.gppLogin();
});

Then("The user is redirected to the Finastra Message Center page", function (){
  aqObject.CheckProperty(Aliases.Browser.gppFinastra_Main.Nav, "VisibleOnScreen", cmpEqual, true);
});

Given("The user is logged into Finastra ", function() {
  aqObject.CheckProperty(Aliases.Browser.gppFinastra_Main.Nav, "contentTest", cmpContains, Project.Variables.gppUsername);  
});

When("The user logs out", function (){ 
  CommonMAIN.gppLogout();  
});