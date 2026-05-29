# Introduction
SEN and internal transfers feature a duplicate payment control in the form of an optional idempotency key that may be sent in the header. Use header key 'Idempotency-Key' with a GUID as a value to utilize this feature.

Additionally, any API-initiated transfer without a passed idempotency key will have one automatically generated and attached to the transfer; it is retreivable in the response header, and will display in your account history as described below.

##Use instructions

The scenarios around idempotent POST transfer/sen and transfer/internal requests are as follows:
1.	**Not Passed** – It is optional, therefore if idempotency key not passed, code will run as normal to attempt POST transfer. No checks to the idempotency database (db) will occur. NOTE: If no user-generated idempotency key is sent in an API-initiated transfer, a system-generated GUID will appear in the idempotency-key field in the response header.  

2.	**Key passed for first time use**
    * If check for key in db returns no records, key will get added to the db; record will initially have a status of New (“1”)
  
    * Initiate transfer is called
      * If transfer returns with success, record updated with status of Success (“2”), and results from core system stored in db record and returned to customer
  
      * If transfer returns with a failure or exception, results are updated with a status of Fail (“3”), record is updated in db and error message returned in response to customer
3.	**Key passed, already exists in db**
    * Check for key in db, key is found
  
    * If status of found record = “2”, result data is deserialized to the Response object and returned to the user (as 201 Created). **Note that a new transfer is not initiated**
      * If other parameters or if body of POST does not match those passed with the idempotency key originally, a 409 will result.
    * If status of found record is not success (“1” or “3”), Made system queries GET history to check for idempotency key in core system history Response. If found, success message (201 Created) is returned to the customer. If fail confirmed, resulting Error returned to the user (5xx server error) with the value stored in the result of the record.





In summary, we ensure exactly once delivery by separating our logic into distinct phases: 
1. All 5xx errors become retryable for client requests. 
2. In most cases, 4xx errors can be repaired such that the same idempotency key could be reused. This is true only if it is viable to repair the request and resend with the original idempotency key. Examples include fixes for invalid requests, bad IP, or bad signature. For any bad request that requires a change to the request body, a new idempotency key will need to be passed with that subsequent request.
3. For Responses of 201 Created, once a record for an idempotency key has been written to the db, the result will always be returned from a POST call with the matching id (future responses will also pass a 201 Created, unless the request body does not match the original POST, in which case a 409 is given) and the code will never call the payment service again when that key exists in “2” status in the db. Database records will be deleted 7 days after initial insert.




##Finding idempotency-key in GET history
For reference, idempotency key passed via POST transfer/sen and transfer/internal (as well as any system-generated GUID from API transfers not passed with a user-generated idempotency key) is returned in all GET history Responses as the value of field “unique-id”. 


<!-- <ul><li></li><li></li><li></li></ul> -->
```json
{
    "more_data": false,
    "count": 1,
    "records": [
        {
            "payment_id": null,
            "transaction_code": "9086",
            "transaction_amount": 0.01,
            "transaction_description": "SEN to 111111111+21/10/29 22:30:28.78",
            "transaction_secondary_description": "MyMemoHere",
            "transaction_description3": null,
            "transaction_description4": null,
            "transaction_description5": null,
            "transaction_description6": null,
            "effective_date": "2021-10-29T00:00:00",
            "running_available_balance": null,
            "memo_post_indicator": "memo post",
            "debit_credit_flag": "debit",
            "unique_id": "00000000-0000-0000-0000-000000000000",
            "sen_transfer_response": {
                "counter_party_account_number": "222222222",
                "timestamp": "21/10/29 22:30:28.78",
                "sender_memo": "MyMemoHere",
                "counter_party_legal_name": null
            }
        }
    ]
}