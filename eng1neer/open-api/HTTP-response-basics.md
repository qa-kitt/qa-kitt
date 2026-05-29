The following basic expectations apply for v3 HTTP response scenarios.

<br/>

## GET requests

| Response Type  | Code | Body Message Contents | Details & Example Scenarios                                                                                                      |
| -------------- | ---- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Successful** | 200  | Results               | <ul><li>Request is valid and results are returned</li><li>GET History - There are no transactions in filtered criteria</li></ul> |

<br/>

## POST requests

| Response Type  | Code | Body Message Contents | Details & Example Scenarios                                                                                                                                                                                                                       |
| -------------- | ---- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Successful** | 200  | Confirmation details  | <ul><li>Duplicate transaction using idempotency</li><ul><li>The request was previously successfully submitted; new record not created</li></ul></ul>                                                                                              |
| **Created**    | 201  | Confirmation details  | <ul><li>SEN transfer – transfer sent to counterparty</li><li>FX Quote – quote for fx trade returned</li><li>FX Trade – trade booked in Sierra</li><li>Payment – payment created in GPP and pending approval</li><li>Webhook – new webhook created |

<br/>

## PATCH requests

| Response Type  | Code | Body Message Contents | Details & Example Scenarios                                      |
| -------------- | ---- | --------------------- | ---------------------------------------------------------------- |
| **Successful** | 200  | Confirmation details  | The action requested succeeded and confirmation details returned |

<br/>
<br/>

## DELETE requests

| Response Type  | Code | Body Message Contents | Details & Example Scenarios                                             |
| -------------- | ---- | --------------------- | ----------------------------------------------------------------------- |
| **Successful** | 204  | Null                  | The delete request succeeded and record no longer exists (_No Content_) |

<br/>
<br/>

## All requests

| Response Type         | Code | Body Message Contents                                                                        | Details & Example Scenarios                                                                                                                                                                                                                                                               |
| --------------------- | ---- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No Content**        | 204  | null                                                                                         | <ul><li>There are no results to return</li><li>GET payment - payment_id is not owned or not in a viewable status</li></ul>                                                                                                                                                                |
| **Bad Request**       | 400  | Error message specific to reason (when appropriate)                                          | <ul><li>Missing required field from query parameter or request body</li><li>PATCH payment - Bad action value (not "Approve", "Cancel" or "Return")                                                                                                                                        |
| **Unauthorized**      | 401  | Varied                                                                                       | <ul><li>Required authentication header(s) not provided </li><li>Invalid subscription key or secret</li><li>Spaces in the account number when the account number is a path parameter </li><li>Subscription status is suspended</li><li>PATCH payment - Not permissioned to this payment_id |
| **Forbidden**         | 403  | "Forbidden"                                                                                  | <ul><li>Account status in Portal is inactive (contact your account manager) </li><li>Subscription not permissioned to conduct this service using this account</li><li>Invalid IP address</li><li>Invalid Account Number or unique_id                                                      |
| **Not Found**         | 404  | "Resource not found"                                                                         | <ul><li>A path parameter is missing required information                                                                                                                                                                                                                                  |
| **Too Many Requests** | 429  | "The subscription's rate limit for this account has been exceeded. Try again in 60 seconds." | <ul><li>User has sent too many requests in a given amount of time. See [Rate Limits](https://developers.rand0m.ai/reference/rate-limits-in-v3) for more details.                                                                                                                          |
| **Server error**      | 500  | Internal server error                                                                        |
| **Server error**      | 503  | Service unavailable                                                                          | <ul><li>Application offline/unresponsive</li><li>Service overloaded                                                                                                                                                                                                                       |
