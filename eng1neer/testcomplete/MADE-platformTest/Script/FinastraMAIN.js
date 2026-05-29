//USEUNIT CommonMAIN

/***************************************************************
Name: Portal
Description: General Portal functions
Author: Kitt Random
Creation Date: 09/02/2022
***************************************************************/

function gppLoginAndVerifyMID() {
  // login
  CommonMAIN.gppLogin();

  // search payment
  CommonMAIN.gppSearchMID(Project.Variables.gppPaymentId); // M098A27047S96VZ2

  // logout
  CommonMAIN.gppLogout();
}
