The following rate limits must be observed for subscriptions in v3.


* Requests to a given endpoint where ```account-number``` is a path or query parameter are rate limited at a maximum of 20 requests *to that endpoint per account number per 60 seconds* (applies to most GET methods)
  
* Requests to endpoints where ```account-number``` is **not** a path or query parameter are rate limited at a maximum of 200 requests *per subscription per 60 seconds* (applies to all POST, all PATCH, and some GET methods, such as GET account/list and GET connections)