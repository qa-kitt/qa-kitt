//USEUNIT Main

/***************************************************************
Name: onLog
Description: General onLog event controls
Author: Kitt Random
Creation Date: 11/20/2022
***************************************************************/

// Send Alert Email
function SummaryEmail(mFrom, mTo, mSubject, mBody, mAttach) {
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

// On Error
function EventControls_OnLogError(Sender, LogParams) {
  var page = Sys.Browser("*").Page("*");
  switch (ProjectSuite.Variables.Environment) {
    case "QA":
      var alertRecipient = "noreply@rand0m.ai";
      break;
    case "STG":
      var alertRecipient = "SEtestingalerts@rand0m.ai";
      break;
  }

  // FX failure alert
  if (equal(ProjectSuite.Variables.ServiceType, "FX Trade Execution")) {
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
        "Failure in " +
          ProjectSuite.Variables.Environment +
          " - " +
          aqTestCase.CurrentTestCase.Name +
          " ERROR: " +
          LogParams.MessageText,
        Log.Picture(Sys.Desktop.Picture(), "Image of the error"),
      )
    ) {
      Log.Checkpoint("| Alert Email Sent |");
      page.Refresh();
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
