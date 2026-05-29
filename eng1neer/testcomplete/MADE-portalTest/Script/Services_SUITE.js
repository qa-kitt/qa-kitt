//USEUNIT CommonMAIN

/*************************************************************** 
Name: SEND INFINITE SPAM MAIL
Description: Sends emails to a specified recipient for a 
	specified number of times
Author: Kitt Random
***************************************************************/
function EmailTest() {
  CommonMAIN.runPoswerShellScript("alertEmail.ps1");
}

function SendEmail(mFrom, mTo, mSubject, mBody, mAttach) {
  var schema, mConfig, mMessage;

  try {
    schema = "http://schemas.microsoft.com/cdo/configuration/";
    mConfig = getActiveXObject("CDO.Configuration");
    mConfig.Fields.$set("Item", schema + "sendusing", 2); // cdoSendUsingPort
    mConfig.Fields.$set("Item", schema + "smtpusessl", 1); // Use SSL

    // sgb relay server
    mConfig.Fields.$set(
      "Item",
      schema + "smtpserver",
      "mxa-006af402.gslb.pphosted.com",
    ); // default SMTP server
    mConfig.Fields.$set("Item", schema + "smtpserverport", 25);
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

function MainTest() {
  if (
    SendEmail(
      "noreply@rand0m.ai",
      "SEtestingalerts@rand0m.ai",
      "Email Test",
      "Eat more tacos",
      "",
    )
  ) {
    // Message was sent
  } else {
    // Message was not sent
  }
}
