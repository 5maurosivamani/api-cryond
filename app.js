const express = require("express");
const app = express();
const PORT = 5000;
const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const userRouter = require("./router");
app.use("/users", userRouter);

app.listen(PORT, (err) => {
  if (!err) {
    console.log(`Server started at PORT: ${PORT}.`);
  }
});
