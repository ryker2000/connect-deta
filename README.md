# Connect Deta

Use [Deta](https://deta.sh) Base to store cookie sessions, compatiable with [Express Session](https://expressjs.com/en/resources/middleware/session.html).

How to install:
```
npm install deta express express-session --save
npm install connect-deta --save
```


How to use:
```javascript
const express = require("express");
const session = require("express-session");
const DetaBaseStore = require("connect-deta")(session);

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
