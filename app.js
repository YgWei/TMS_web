const express = require("express");
const path = require("path");
const history = require("connect-history-api-fallback");
const app = express();

app.use(history());
app.use(express.static(path.join(__dirname, "dist")));

app.listen(3000, () => {});
