# Using unique_id During Migration to v3 API

Our v3 Partner API generates a shorter, cleaner unique_id for each transaction in a GET history response when compared to the UniqueId of our API v2. 

That said, we recognize that as our users migrate to the newest Partner API, the difference in unique_id v3 and UniqueId v2 has caused a gap in verifying transaction attribution when comparing a set of transactions from the two versions.

To solve this, we've added a feature to our v3 GET history that makes the unique_id configurable to match the v2 version when needed.

## Using X-UniqueId-Version Header
v3 users can now pass a header key ```X-UniqueId-Version``` with a value "```v2```" to have the GET history response pass a v2 version of the unique_id. (The header defaults to "```v3```".)

### Sample transaction with v3 unique_id  
```json
 {
            "payment_id": "M01I93555QUJATVA",
            "transaction_code": "9095",
            "transaction_amount": 4692.60,
            "transaction_description": "M01I93555QUJATVA",
            "transaction_description2": "BENE:KITT M",
            "transaction_description3": null,
            "transaction_description4": null,
            "transaction_description5": null,
            "transaction_description6": null,
            "effective_date": "2022-05-18T00:00:00",
            "running_available_balance": null,
            "memo_post_indicator": "memo post",
            "debit_credit_flag": "debit",
            "unique_id": "NPQwMDAwOTkwMQkwNS8xOC8yMDIyCTQ2OTIuNjAJOTA5NQlNMDVJOTM1NTVRVUpBVFZBCUJFTkU6TUlDSEFFTCBF",
            "sen_transfer_response": null
        }
```
 
### Sample transaction where header key ```X-UniqueId-Version``` value = "```v2```"  

```json
        {
            "payment_id": "M01I93555QUJATVA",
            "transaction_code": "9095",
            "transaction_amount": 4692.60,
            "transaction_description": "M01I93555QUJATVA",
            "transaction_description2": "BENE:KITT M",
            "transaction_description3": null,
            "transaction_description4": null,
            "transaction_description5": null,
            "transaction_description6": null,
            "effective_date": "2022-05-18T00:00:00",
            "running_available_balance": null,
            "memo_post_indicator": "memo post",
            "debit_credit_flag": "debit",
            "unique_id": "enJBY2NvdW50TnVtYmVyIjoiNDQwMDAwOTkwMSIsIlRyYW5zYWN0aW9uRGF0ZSI6IjIwMjIwNTE4IiwiVHJhbnNhY3Rpb25BbW91bnQiOiI0NjkyLjYwIiwiVHJhbnNhY3Rpb25Db2RlIjoiOTA5NSIsIkRlc2NyaXB0aW9uIjoiTTA1STkzNTU1UVVKQVRWQSIsIkV4dGVuZGVkRGVzY3JpcHRpb25MaW5lMiI6IkJFTkU6TUlDSEFFTCBFIn0=",
            "sen_transfer_response": null
        }
```
### Same sample transaction from v2 GET history  response

```json
          {
            "TRANDATE": "2022-05-18",
            "TRANCD": "9095",
            "TRANAMT": 4692.60,
            "CHECKNBR": "0",
            "IDEMPOTENCYKEY": "",
            "TRANDESC": "M01I93555QUJATVA",
            "TRANDESCS": "BENE:KITT M",
            "TRANDESC3": "",
            "TRANDESC4": "",
            "EFFDATE": "2022-05-18",
            "CURRAVAILBAL": 99870595.09,
            "TRANCDX": "9095",
            "MEMOPSTIND": "M",
            "DRCRFLAG": "D",
            "IMAGEFLAG": "",
            "ORIGPROCDT": "0",
            "ORIGSRC": "",
            "ORIGSUBSRC": "",
            "UniqueId": "enJBY2NvdW50TnVtYmVyIjoiNDQwMDAwOTkwMSIsIlRyYW5zYWN0aW9uRGF0ZSI6IjIwMjIwNTE4IiwiVHJhbnNhY3Rpb25BbW91bnQiOiI0NjkyLjYwIiwiVHJhbnNhY3Rpb25Db2RlIjoiOTA5NSIsIkRlc2NyaXB0aW9uIjoiTTA1STkzNTU1UVVKQVRWQSIsIkV4dGVuZGVkRGVzY3JpcHRpb25MaW5lMiI6IkJFTkU6TUlDSEFFTCBFIn0=",
            "PaymentId": "M01I93555QUJATVA",
            "SenTransferResponse": null
          }
```
