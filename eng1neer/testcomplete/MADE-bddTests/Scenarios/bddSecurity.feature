Feature: bddSecurity

  @secPortal
  Scenario Outline: Portal tests for weak input validation
    Given the <user> is logged into Portal a permissioned account 
    And has navigated to the appropriate <page>
    When the <user> enters <input> into a text field
    And the <input> is validated
    Then submission is forwarded to approval queue
    
  @secBackOffice
  Scenario Outline: Back Office tests for weak input validation
    Given the <user> is logged into BOA a permissioned account 
    And has navigated to the appropriate <page>
    When the <user> enters <input> into a text field
    And the <input> is validated
    Then submission is forwarded to approval queue
    
    
  @secUser
  Examples:
   | user |
   | "System Admin" |
   | "Back office Admin" |
   
  @secInput
  Examples:
   | input |
   | "<image src/onerror=prompt(8)>" |
   | "<iframe onLoad iframe onLoad="javascript:javascript:alert(1)"></iframe onLoad>" |
   | "<script\x20type="text/javascript">javascript:alert(1);</script>" |
   
   @secBackOfficeVerify
  Examples:
   | page |
   | "Accounts /Add Account" |
   | "Profiles / Add Profile" |
   | "Customer Comms / New Communication" |
   
  @secPortalVerify
  Examples:
   | page |
   | "Admin / Accounts / Edit Alias" |
   | "Admin / Settings / Upload image" |
   | "Admin / Subscriptions / Actions / Edit permissions / Alias" |
   | "Transfers / Payment / Send to owned account / Payment memo" |
   | "Transfers / Internal / Memo" |