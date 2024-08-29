const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const homePage = require("./routes/homePage");
const adminPage = require("./routes/adminPage");
const fs = require("fs");
const csurf = require("csurf");
const sitemapRouter = require("./routes/siteMapRouter");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use("/static", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use("/", sitemapRouter);
app.set("view engine", "ejs");

// CSRF middleware initialization
// const csrfProtection = csurf({ cookie: true });

// app.use(csrfProtection);

// // CSRF token'ı her EJS sayfasına eklemek için middleware
// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

app.use("/", homePage);
app.use("/admin", adminPage);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
