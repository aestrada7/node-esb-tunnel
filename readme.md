## Node ESB Tunneling

Allows calls to be done to ESB services through a tunnel created by a NodeJS server. The CloudFoundry application requires configuration of environment variables in order to work. Also exposes the `APP_URL` environment variable if `environment.js` is called.

#### Configuring

* `PROXY`

  Needs to include the proxy address that will be used to send calls from within the AZ network. Example: `http://10.16.190.240:20118`. _Setting a proxy is independent from each CloudFoundry space, make sure Allianz is notified of this prior so they can enable the proxy for that particular space_.

* `BASE_URL`

  The URL where all services will be located. For ESB, this should be `https://ehbus-ditr.services.ehgroup/ESB/services/rest/`.

* `APP_URL`

  Optional. A variable that will be exposed on the `environment.js` file if called. It describes an object with the different base URLs for services.

  ```
  {"myeh": {"usePreloadedStaticData": "1", "REST_BASE": "oneweb/ajax/aspro/esb-rest-service", "REST_BAS_BASE": "oneweb/ajax/aspro/broker", "STATIC_DATA_BASE": "app/staticData/", "PROFILE_ENDPOINT": "oneweb/idm/v1/profile", "REST_BASE_MENU": "oneweb/ajax/aspro/broker/menus"}, "eh-sync": {"REST_BASE": "/oneweb/ajax/aspro/esb-rest-service", "REST_BAS_BASE": "/oneweb/ajax/aspro/broker", "STATIC_DATA_BASE": "/app/staticData/", "PROFILE_ENDPOINT": "/oneweb/idm/v1/profile", "REST_BASE_MENU": "/oneweb/ajax/aspro/broker/menus"}}
  ```

#### Calling the app

Once the server is running, it will accept both GET and POST requests, and these will also receive and forward custom headers and a request body if present, along with any other query data that's requested. Anything after the `endpoint/` route in the call will be sent to the `BASE_URL` requested above.

So instead of trying to call the endpoint `https://ehbus-ditr.services.ehgroup/ESB/services/rest/ESB_ContactReadRestService/v1/retrieveContactDetail` directly, the tunnel app should be called instead: `https://api-test.allianz.com/node-esb-tunnel/endpoint/ESB_ContactReadRestService/v1/retrieveContactDetail`. This will internally build the same URL as the actual endpoint, but tunneling it through the proxy and retrieving the results.

#### Testing a call

Try making a `POST` call to the following URL: `https://api-test.allianz.com/node-esb-tunnel/endpoint/ESB_ContactReadRestService/v1/retrieveContactDetail`, add the following custom headers:

1. `ONEWEB-USERID`: `429049`
2. `ONEWEB-GROUP`: `BP_EH_MNG,BP_EH_ADMIN,BP_TECH_PRINT`
3. `x-eh-transactionId`: `BP`

As the request body send the following:
`{"restContextHeader":{"applicativeContext":{"languageISOCode":"EN"}},"authorizationCriteria":{"intermediaryCode":"N/A"}}`

This will retrieve a JSON object with valid data. Congratulations! You're getting data from ESB!

_Make sure the `Content-Type` header is set to `plain/text`, otherwise Node will not process the body._ _Edit: No longer applies, can also be json._

#### Using APP_URL

The use of `APP_URL` allows an application to include `https://api-test.allianz.com/node-esb-tunnel/environment.js` and have access to the value defined on the CloudFoundry environment variables. Once injected, accessing the values is easy since the object is saved on the global JavaScript variable `APP_URL`. A sample of its use:

```
var currentEnv = 'myeh';
var test = APP_URL[currentEnv].REST_BASE;
```

`test` would hold `'oneweb/ajax/aspro/esb-rest-service'`.

#### Debugging

Be sure to watch the CloudFoundry logs, the application will send all communication attempts as well as any issues it finds.

#### Docker

This application uses node:alpine as a base image. To build the image run the following command while on the folder:

```
$ docker build -t <TAG_NAME> .
```

Once the image is built, the environment variables must be sent when the application runs. This can be done via either an environment file or setting them directly in the `run` command.

To run the container with environment variables do the following:

```
$ docker run -e "PORT=8080" -e "BASE_URL=https://api-test.allianz.com/node-esb-tunnel/endpoint/" -e "APP_URL={'from-docker': true}" -p 8080:8080 -d <TAG_NAME>
```

Where -e is an individual environment variable, -p is the port combination that will be used locally and the exposed one from the container (local:exposed), -d means it will run in a detached mode, and finally the tag name for the build.

If on windows run `docker-machine ip default` to retrieve the IP that will be used, otherwise use `localhost`.

To test the container run:

```
$ curl 192.168.99.100:8080/endpoint/what
```

---

Author: Antonio Estrada (antonio.estrada.ext@eulerhermes.com)

Last Updated: 14/11/2017