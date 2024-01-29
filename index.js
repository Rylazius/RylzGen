const { ZenRows } = require("zenrows");
const express = require('express')
const fs = require("fs")
const app = express()
const port = 3000

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);
app.use(express.json());

app.use(express.static("public"))

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

app.post("/auth/login/v1", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  fs.readFile('user.json', 'utf8', (err, data) => {
      if (err) {
          console.error(err);
          res.status(500).send("Server-side error. Please contact Rylazius."); // Error handler
          return;
      }

      const userList = JSON.parse(data); // Parse the JSON data

      // Check if the username exists in the JSON object
      if (userList.hasOwnProperty(username)) {
          const passntier = userList[username];

          // Check if passntier is defined
          if (passntier) {
              const [passwordDB, tierDB] = passntier.split(':');

              // Compare the provided password with the stored password
              if (password === passwordDB) {
                  res.send({ "result": "SUCCESS" });
              } else {
                  res.send({ "result": "ERROR" });
              }
          } else {
              res.send({ "result": "ERROR" });
          }
      } else {
          res.send({ "result": "ERROR" });
      }
  });
})

app.post('/reghmc', (req, res) => {
  (async () => {
    const providedUsername = req.body.username; // Username provided in the request
    const providedPassword = req.body.password; // Password provided in the request
    const capToken = req.body.capToken;
    const zrtoken = req.body.zrToken;
    const tokenValue = req.body.csrfToken
    const phpID = req.body.phpSess

    // Check if the provided username and password are valid
    if (!providedUsername || !providedPassword) {
      res.status(200).send({ "status": {"status": "cut di rac :sob: :sob:"}});
      return;
    }

    fs.readFile('user.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(200).send({ "status": {"status": "Contact Rylazius"}});
        return;
      }

      const userList = JSON.parse(data);

      // Check if the username exists in the JSON object
      if (userList.hasOwnProperty(providedUsername)) {
        const passntier = userList[providedUsername];

        // Check if passntier is defined
        if (passntier) {
          const [passwordDB, tierDB] = passntier.split(':');

          // Compare the provided password with the stored password
          if (providedPassword === passwordDB) {
            // Continue with the registration process
            const client = new ZenRows(`${zrtoken}`);
            const username = "R" + makeid(11) + "R";
            const password = makeid(5);
            const url = "https://id.heromc.net/member/xuly.php";
            const postData = `type=dangky&username=${username}&password=${password}&passc=${password}&email=nodejsenj@gmail.com&token=${tokenValue}&captcha=${capToken}`
            const headers = {
              "Cookie": `PHPSESSID=${phpID}`,
            };
            try {
              (async () => {
                const { data } = await client.post(url, {
                  "premium_proxy": "true",
                  "proxy_country": "vn",
                  "original_status": "true",
                  "custom_headers": "true",
                }, { headers, data: postData });

                const respdata = {
                  "username": username,
                  "password": password,
                  "status": data
                };

                console.log(respdata);
                res.send(respdata);
              })();
            } catch (error) {
              console.error(error.message);
              if (error.response) {
                console.error(error.response.data);
              }
            }
          } else {
            res.status(200).send({ "status": {"status": "cut di rac :sob: :sob:"}});
          }
        } else {
          res.status(200).send({ "status": {"status": "cut di rac :sob: :sob:"}});
        }
      } else {
        res.status(200).send({ "status": {"status": "cut di rac :sob: :sob:"}});
      }
    });
  })();
});


app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

