var express = require("express");
var path = require("path");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const uc = require("upper-case");
var app = express();

require("./config/passport")(passport);

const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Express body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//User Images making available for other folder
app.use('/images', express.static('images')); 

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.static(path.join(__dirname, "/assets")));

var propics = require('./routes/profilepic');
app.use(propics);

var routes = require("./routes/welcome");
app.use("/", routes);

var routelog = require("./routes/login");
app.use("/login", routelog);

var routereg = require("./routes/register");
app.use("/register", routereg);

var routedash = require("./routes/dashboard");
app.use("/dashboard", routedash);

var routedashdriver = require("./routes/dashboarddriver");
app.use("/dashboarddriver", routedashdriver);

var routeout = require("./routes/logout");
app.use("/logout", routeout);

var routetravel = require("./routes/travelform");
app.use("/travelform", routetravel);

var routeprofile = require("./routes/profile");
app.use("/profile", routeprofile);

var routeprofiledriver = require("./routes/profiledriver");
app.use("/profiledriver", routeprofiledriver);

var routeSearch = require("./routes/search");
app.use("/search", routeSearch);

var routeRequest = require("./routes/request");
app.use("/request", routeRequest);

var driverdetail = require("./routes/driverdetail");
app.use("/driverdetail", driverdetail);

var journey = require("./routes/journey");
app.use("/journey", journey);

var driver = require("./routes/driver");
app.use("/driver", driver);

var detail = require("./routes/detail");
app.use("/detail", detail);


app.set("port", process.env.PORT || 3000);

app.listen(app.get("port"), function () {
  console.log("Server started on port " + app.get("port"));
});
