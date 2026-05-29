## Overview

For v3 and going forward Made APIs use a combination of Subscription Key and Client Secret as unique material for sending secure requests. Both secrets are available via the Made Portal accessible by a customer Profile Admin. See Intro for getting started with this process. Once Made’s back office completes initial setup, the customer Profile Admin will need to retrieve the Subscription Key and generate the Client Secret, which is only available to be copied one time. Both “secrets” must be used to generate a secure request header, as specified in following sections.

## Client Required Headers

All clients will need to send in the following headers to be validated properly.

- **X-Auth-Signature** - This is the client generated signature based on the data sent to the API and signed in an HMAC512 crypto as a base64 string. See next section “Generating a Signature” for more details.
- **Ocp-Apim-Subscription-Key** – Each Subscription is assigned a unique key for which specific permissions may be applied
- **X-Auth-Nonce** – A unique random number which cannot be reused within 150 seconds. It is required to aid against cases of replay attacks.
- **X-Auth-Timestamp** – The UTC time when the request is generated. It is used to validate the request is not stale when it is received.
- **X-Auth-Version** – The authentication version which should be defaulted to “v1”. It may be used in the future if the authentication is modified.

## Generating a Signature

For the API to validate any calls, the client must generate a signature using the Secret and set the value in the _X-Auth-Signature_ header. The signature is a combination of header values, calling URL, and the body of the request if it exists. The following steps can be used to generate the signature for any of the Made Bank v3+ API endpoints. The examples listed for reference are in C#.

1. Create a string that contains the URL path that is being called, including any query parameters, i.e. <a href="https://example.com/api/account/{accountnumber}/balance" target="_blank">https://example.com/api/account/{accountnumber}/balance</a> . Call this _absoluteUri_.<br/>
   Ex. For a Balance call for account # 1234567890: <br/>

```json
string absoluteUri = "https://example.com/api/account/1234567890/balance";
```

<!-- 1. Create  -->

2. Create another string that combines the above with all the information set in the headers. These are listed in the string as { } and should be replaced with the actual value that is set in the header of the same name. Call this _stringToSign_. <br/> "Made **{Ocp-Apim-Subscription-Key}{absoluteUri}{X-Auth-Nonce}{X-Auth-Timestamp}{X-Auth-Version}{RequestBody}**" <br/> NOTE: If the endpoint being called is a GET http verb or does not contain a request body, then the request body should be omitted. The request body should be in the form of a json string.<br/><br/>
3. Compute the Hash of the above string using an HMAC512 crypto object. This object should be created using your client secret as your key. <br/> NOTE: If your language requires the string to be a byte array to compute the HMAC512 hash, we recommend using UTF8 encoding.<br/><br/>
4. Compute the hash to generate a new base64 encoded string object, which is used as the **X-Auth-Signature** header.

<!-- Sample Python -->

## Sample Code (Python)

```py
import requests
import datetime
import uuid
from datetime import timezone
import hmac
import base64

subscription_key = ""
subscription_secret = ""

url = "https://api-sandbox.rand0m.ai/v3/api/account/list" # url of request
nonce = uuid.uuid4().hex
timestamp = datetime.datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
version = "v1"
body = """""" # body of request

pre_encrypted_signature = f"made {subscription_key}{url}{nonce}{timestamp}{version}{body}".encode()
sha = hmac.new(subscription_secret.encode(), pre_encrypted_signature, "sha512")
signature = base64.b64encode(sha.digest()).decode()

headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Ocp-Apim-Subscription-Key": subscription_key,
    "X-Auth-Nonce": nonce,
    "X-Auth-Timestamp": timestamp,
    "X-Auth-Version": version,
    "X-Auth-Signature": signature
}

response = requests.get(url, headers=headers)
# response = requests.post(url, headers=headers, json=json.loads(body))
print(response)
print(response.content.decode())
```

<!-- Sample Java -->

## Sample Code (Java)

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpResponse.BodyHandlers;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.UUID;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

public class App {
    static String subscription_key = "";
    static String subscription_secret = "";

    static String url = "https://api-sandbox.rand0m.ai/v3/api/account/list";
    static String version = "v1";
    static String body = "";

    public static void main(String[] args) {

        String nonce = UUID.randomUUID().toString().replace("-", "");
        String timestamp = Instant.now().truncatedTo(ChronoUnit.SECONDS).toString();
        String pre_encrypted_signature = String.format("made %s%s%s%s%s%s", subscription_key, url, nonce,
                timestamp, version, body);

        try {
            // create signature
            SecretKeySpec secretKeySpec = new SecretKeySpec(subscription_secret.getBytes(StandardCharsets.UTF_8, "HmacSHA512");
            Mac sha256_HMAC = Mac.getInstance("HmacSHA512");
            sha256_HMAC.init(secretKeySpec);
            String signature = Base64.getEncoder()
                    .encodeToString(sha256_HMAC.doFinal(pre_encrypted_signature.getBytes(StandardCharsets.UTF_8)));

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()  // Create Request
            .uri(URI.create(url))
            .header("Accept", "application/json")
            .header("Content-Type", "application/json")
            .header("Ocp-Apim-Subscription-Key", subscription_key)
            .header("X-Auth-Nonce", nonce)
            .header("X-Auth-Timestamp", timestamp)
            .header("X-Auth-Version", version)
            .header("X-Auth-Signature", signature)
            .GET() // default
            // .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();
            HttpResponse<String> response = client.send(request, BodyHandlers.ofString()); // Send request

            System.out.println("<Response [" + response.statusCode() + "]>");
            System.out.println(response.body());
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
```

<!-- Sample C# -->

## Sample Code (C#)

```csharp
using System.Security.Cryptography;

var subscription_key = "";
var subscription_secret = "";

var url = "https://api-sandbox.rand0m.ai/v3/api/account/list";
var nonce = Guid.NewGuid().ToString().Replace("-", "");
var timestamp = DateTime.Now.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ");
var version = "v1";
var body = "";
var pre_encrypted_signature = $"made {subscription_key}{url}{nonce}{timestamp}{version}{body}";

// generate signature
var hmac_sha512 = new HMACSHA512(System.Text.Encoding.UTF8.GetBytes(subscription_secret));
var hash = hmac_sha512.ComputeHash(System.Text.Encoding.UTF8.GetBytes(pre_encrypted_signature));
var signature = Convert.ToBase64String(hash);

try
{
    var client = new HttpClient();
    var request = new HttpRequestMessage(HttpMethod.Get, url); // HttpMethod.Post
    request.Headers.Add("Accept", "application/json");
    request.Headers.Add("Ocp-Apim-Subscription-Key", subscription_key);
    request.Headers.Add("X-Auth-Nonce", nonce);
    request.Headers.Add("X-Auth-Timestamp", timestamp);
    request.Headers.Add("X-Auth-Version", version);
    request.Headers.Add("X-Auth-Signature", signature);
    request.Content = new StringContent("application/json");

    /** simple example of Setting body for a POST
    * request.Content = new StringContent(""{\"format\":\"body\",\"as\":necessary}",
    *    Encoding.UTF8, "application/json");
    **/

    HttpResponseMessage response = client.Send(request);
    response.EnsureSuccessStatusCode();
    string responseBody = response.Content.ReadAsStringAsync().Result;

    Console.WriteLine($"<Response [{(int)response.StatusCode}]>");
    Console.WriteLine(responseBody);
}
catch (HttpRequestException e)
{
    Console.WriteLine($"Message :{e.Message}");
}
```
