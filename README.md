# Connect Deta

Use [Deta](https://deta.sh) Base to store cookie sessions, compatiable with [Express Session](https://expressjs.com/en/resources/middleware/session.html).

How to install:
```
npm install deta express express-session 
npm install connect-deta
```


How to use:
```javascript
var express = require("express");
var session = require("express-session");
var DetaBaseStore = require("connect-deta")(session);

var app = express();

app.use(
  session({
    store: new DetaBaseStore({
      detaProjectKey: "", // your deta base project id
      detaBaseName: "session", // optional table name, defaults to "session"
      prefix: "test:", // optional prefix for session id
    }),
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 60 * 10000, // this will set the expiresAt field in Deta base
    },
  })
);
```

* * *

[MIT Open Source](/LICENSE.txt)
