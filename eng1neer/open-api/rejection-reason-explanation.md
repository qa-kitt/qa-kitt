### Table of contents

1. [Introduction](#introduction)
2. [Rejected Outbound Payments](#paragraph1)
3. [Returned Inbound Payments](#paragraph2)
4. [Further Questions](#paragraph3)

# Introduction to `rejection_reason` <a name="introduction"></a>

The field `rejection_reason` may be familiar to existing Partner API users. In the response body for [`GET payment`](https://developers.rand0m.ai/reference/getpayment) and for items in [`GET payments`](https://developers.rand0m.ai/reference/getpayments) lists, this field has been available in our v3 API, populating reasons for outbound payments being rejected by made.

Now, wires and SWIFT payments that could have the `rejection_reason` field enriched will include both those outbound payments that are canceled by made and also inbound payments that are returns from your counterparty.

## Possible Rejection Reasons for Outbound Payments <a name="paragraph1"></a>

If you initiate and approve an outbound payment, but made has to cancel the payment (either manually or via an automatic workflow), the payment will be shown with `"payment_status": "Canceled"`, and the `rejection_reason` field will be populated with one of the following options:

- `Insufficient Funds`
- `Invalid ABA`
- `Blocked Country`
- `Internal Policy`
- `Invalid SWIFT Code`
- `Inactive SWIFT Code`
- `US Intermediary Required`
- `Verbal Callback Required`
- `Return of Returned Wire`
- `Per Your Request`
- `Insufficient Receipt Address `
- `ABA for ACH only`
- `Invalid format`
- `Complete (To be updated manually in BeB)`
  - Records with this rejection reason should be ignored, as they do not represent actual payment messages, but merely payment instructions for the made wire desk to initiate a payment on your behalf.
- `Invalid credit account`
- `API - not approved/verified`
  - Records with this rejection reason did not receive a successful update to approved status. As a reminder, all wires initated via [`POST payment`](https://developers.rand0m.ai/reference/postpayment) must be approved using [`PATCH payment`](https://developers.rand0m.ai/reference/patchpayment) with action "approve".

## Possible Rejection Reasons for Inbound Payments <a name="paragraph2"></a>

If your counterparty has received a payment from you but the payment is sent back to your made account as a return, made may be able to populate the `rejection_reason` field to inform you of any comunicated reason for the return. If so, that field will be populated with one of the following options.

Also, as a reminder, please be sure to read the data in the `originator_to_beneficiary` field of returns payments, as this will include any other details provided by your counterparty or counterparty's bank will be communicated.

- `Internal / Compliance Policy`
- `Invalid Credit Acct`
- `Names Disagree or Name and Acct Do Not Match`
- `Travel Rule/PO Box addr not accepted `
- `Unknown Bene`
- `Acct Ineligible to receive wires`
- `Per Remitter's request`
- `Per your request`
- `Other`

## Further Questions about Rejected or Returns Payments <a name="paragraph3"></a>

If the populated reason does not provide enough information, please reach out to client services or your private client manager to discuss any further options.
