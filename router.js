const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");

router.get("/", (req, res) => {
  const username = "admin",
    password = "1234";

  if (req.body.username !== username || req.body.password !== password) {
    res.send("Invalid username or password!");
    return;
  }

  const getUserDetails = (data) => {
    const users = data.results;

    let male = 0,
      female = 0,
      others = 0,
      age50to70 = 0,
      usersDetails = [];

    users.map((user) => {
      // To return the number of male, female and other users.
      const gender = user.gender;

      if (gender === "male") {
        male++;
      } else if (gender === "female") {
        female++;
      } else {
        others++;
      }

      const age = user.dob.age;
      if (age >= 50 && age <= 70) {
        age50to70++;
      }

      usersDetails.push(
        `${user.name.title} ${user.name.first} ${user.name.last} | ${user.email}`
      );
    });

    return { male, female, others, age50to70, usersDetails };
  };

  fs.readFile(__dirname + "/db.json", "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    if (data.length === 0) {
      axios
        .get("https://randomuser.me/api/?results=10")
        .then(async (response) => await response.data)
        .then(async (data) => {
          const content = await JSON.stringify(data);
          try {
            fs.writeFileSync(__dirname + "/db.json", content);
            // file written successfully
          } catch (err) {
            console.error(err);
          }

          res.send(await getUserDetails(data));
        })
        .catch((err) => {
          res.send(err);
        });
    } else {
      const jsonData = JSON.parse(data);
      res.send(await getUserDetails(jsonData));
    }
  });
});

module.exports = router;
