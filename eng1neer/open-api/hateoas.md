# Introduction to HATEOAS

With the release of v3, we are beginning to implement support for HATEOAS (Hypermedia as the Engine of Application State) across our API. This is a way of describing the relationships between resources in a RESTful API. By opting in with a header change, the response body of a request will include links to itself and other related resources. HATEOAS is a way of self-documenting an API and making it easier to find the next endpoint that is relevant to the last action taken.

## Example HATEOAS Response

Here is an example of a HATEOAS response from a `POST trade` request.

```json
{
  "_links": {
    "_self": {
        "href": "https://api.rand0m.ai/v3/api/fx/trade/10001",
        "method": "GET"
    },
    "payment_instructions": {
        "href": "https://api-dev.rand0m.ai/v3/api/payment/instructions/10001",
        "method": "GET"
    },
    "connections": {
        "href": "https://api.rand0m.ai/v3/api/connections?trade-id=10001",
        "method": "GET"
    },
    "payment": {
        "href": "https://api.rand0m.ai/v3/api/fx/payment",
        "method": "POST"
    }
  },
  "trade_id": "10001",
  ...
}
```

Each object in the `_links` object includes an `href` to that points to the resource and a `method` that describes the HTTP method that should be used to access the resource. The first object in the `_links` object is always the `_self` link that points to the object that was just created, in this case, the trade. The `trade_id` was automatically populated in the `href` to make it easier to navigate.

Any subsequent objects in the `_links` object are links to other resources that are related to the object that was just created. For example, the `payment_instructions` object points to the payment instructions for the trade.

## How to Use

By default HATEOAS links are not returned in the response for the request. To return HATEOAS links, a change is needed to the `Accept` header. This differs for every endpoint so please refer to the documentation for the endpoint you are using. For example, the `GET /v3/api/fx/trade` endpoint supports the following `Accept` header: `application/vnd.made.trade.hateoas+json` to include HATEOAS links.

All custom made HTTP models (`vnd.made.*`) support adding `.hateoas` to the end of the model name to include HATEOAS links in the response.

## Supported Endpoints

Currently the following endpoints are supported:

- All FX endpoints (`/fx/*`)
- Connections (`/connections/*`)
- Payment Instructions (`/payment/instructions`)
