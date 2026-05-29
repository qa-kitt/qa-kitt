//USEUNIT CommonMAIN

/***************************************************************
Name: Demo
Description: General demonstrations
Author: Kitt Random
Creation Date: 10/02/2022
***************************************************************/

function gppLoginAndVerifyMID() {
  // login
  CommonMAIN.gppLogin();

  // search payment
  CommonMAIN.gppSearchMID(Project.Variables.gppPaymentId); // M098A27047S96VZ2

  // logout
  CommonMAIN.gppLogout();
}
