# Attributing ACH Transactions via API History

It is possible to perform data attribution via the Partner API v3 on ACH debits and credits, including returns, by following the instructions and best practices here.

## Made ACH Transaction Codes: 
Use this `transaction_code` list to identify ACH-related activity.

### Credit transaction codes:
* 21 – credit
* 2100 – return credit
* 7190 – offset for originated credits 
### Debit transaction codes:
* 89 – debit
* 7100 – return debit 
* 2190 – offset for originated debits

## Sample ACH Data via Partner API v3 history response: 
```json
    "records": [
{
            "payment_id": null,
            "transaction_code": "2100",
            "transaction_amount": "[transaction dollar amount here]”,
            "transaction_description": "ACH Return Credit",
            "transaction_description2": "[Individual name here] [Individual ID number here]",
            "transaction_description3": " [Return reason description here]",
            "transaction_description4": "",
            "transaction_description5": "",
            "transaction_description6": "",
            "effective_date": "[YYYY-MM-DD]T[HH:MM:SS]",
            "running_available_balance": "[running available balance dollar amount here]”,
            "memo_post_indicator": "hard post",
            "debit_credit_flag": "credit",
            "unique_id": "ExampleUID333333333",
            "sen_transfer_response": null
        }, 
{
            "payment_id": null,
            "transaction_code": "2190",
            "transaction_amount": "[transaction dollar amount here]”,
            "transaction_description": "ACH Offset for Originated Debits [partial company name may be
              included here]",
            "transaction_description2": "[Remaining characters of ACH company name here]/[company
              entry description here] Batch-[7-digit batch number here]"
            "transaction_description3": "FileID-AHF[6-digit file number] ACH Batch Offset"
            "transaction_description4": "",
            "transaction_description5": "",
            "transaction_description6": "",
            "effective_date": "[YYYY-MM-DD]T[HH:MM:SS]",
            "running_available_balance": "[running available balance dollar amount here]”,
            "memo_post_indicator": "hard post",
            "debit_credit_flag": "credit",
            "unique_id": "ExampleUID333333333",
            "sen_transfer_response": null
        },
{
            "payment_id": null,
            "transaction_code": "7100",
            "transaction_amount": "[transaction dollar amount here]”,
            "transaction_description": "ACH Return Debit",
            "transaction_description2": "[Individual name here] [Individual ID number here]",
            "transaction_description3": " [Return reason description here]",
            "transaction_description4": null,
            "transaction_description5": null,
            "transaction_description6": null,
            "effective_date": "[YYYY-MM-DD]T[HH:MM:SS]",
            "running_available_balance": "[running available balance dollar amount here]”,
            "memo_post_indicator": "memo post",
            "debit_credit_flag": "debit",
            "unique_id": "ExampleUID333333333",
            "sen_transfer_response": null
        },
{
            "payment_id": null,
            "transaction_code": "21",
            "transaction_amount": "[transaction dollar amount here]”,
            "transaction_description": "[company name here]/[company descriptive data here] [individual ID
              here]",
            "transaction_description2": "[individual name here]",
            "transaction_description3": "",
            "transaction_description4": "",
            "transaction_description5": "",
            "transaction_description6": "",
            "effective_date": "[YYYY-MM-DD]T[HH:MM:SS]",
            "running_available_balance": "[running available balance dollar amount here]”,
            "memo_post_indicator": "hard post",
            "debit_credit_flag": "credit",
            "unique_id": "ExampleUID333333333",
            "sen_transfer_response": null
        },
{
            "payment_id": null,
            "transaction_code": "7190",
            "transaction_amount": "[transaction dollar amount here]”,
            "transaction_description": "ACH Offset for Originated Credits [partial company name may be
            included here]",
            "transaction_description2": "[Remaining characters of ACH company name here]/[company
            entry description here] Batch-[7-digit batch number here]"
            "transaction_description3": "FileID-AHF[6-digit file number] ACH Batch Offset"
            "transaction_description5": "",
            "transaction_description6": "",
            "effective_date": "[YYYY-MM-DD]T[HH:MM:SS]",
            "running_available_balance": "[running available balance dollar amount here]”,
            "memo_post_indicator": "hard post",
            "debit_credit_flag": "debit",
            "unique_id": "ExampleUID333333333",
            "sen_transfer_response": null
        },
{
            "payment_id": null,
            "transaction_code": "89",
            "transaction_amount": "[transaction dollar amount here]”,
            "transaction_description": "[merchant/debiting company name here]/[company entry description
            here]”,
            "transaction_description2": "[individual ID number here] [individual name here]",  
            "transaction_description3": "",
            "transaction_description4": "",
            "transaction_description5": "",
            "transaction_description6": "",
            "effective_date": "2023-01-18T00:00:00",
            "running_available_balance": 228612.25,
            "memo_post_indicator": "hard post",
            "debit_credit_flag": "debit",
            "unique_id": "ExampleUID333333333",
            "sen_transfer_response": null
        }
]
```
## Made ACH Timeline Example: 

Due to the nature of ACH, this timeline example may be helpful to understand when to expect transactions and balance changes to be detectable via API.

#### Thursday
* ACH debit requested by user on your platform.

#### Thursday ~4:45pm PT

* ACH file uploaded by client via SFTP to Made. [The approval deadline for next day effective date is 5:00 pm PT in business online banking.]

#### Thursday 5:00pm PT

* ACH file appears in online banking, client approves.
* Balance API response *does not yet* reflect the ACH batch amount (i.e. available_balance in GET balance API response is unchanged).

#### Thursday ~7:00pm PT

* ACH Batch Offset shows up in history API response as pending, no batch details yet via API.
* Balance API response returns available_balance incremented / decremented by the ACH amount.

#### Friday ~7:00pm PT (Effective Date of ACH Transaction)

* ACH Batch Offset shows up in history API response with full batch details. Unique Identifiers can be found in transaction_description2, which will have the NACHA 5 Record, Fields 7 and 13 (Company entry description and Batch Number)   
* Balance API response returns available_balance incremented / decremented by the ACH amount.

#### Monday 5:00am PT (Next Business Day from Effective Date of ACH Transaction)

* Client can download ACH return file via SFTP Monday ~7:00pm PT.
* Individual ACH return debit shows up on API history response [Details included: Date, Name, Amount, Return Reason, Unique ID can be viewed after Friday 7:00 pm PT.] 
  * (transaction_description2 will have the NACHA 6 Record, Field 8 Individual's Name & will have the NACHA 6 Record, Field 7 Individual ID Number if used.)    
