const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./models/db.js");
const dotenv = require("dotenv");
const app = express();
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
//MVC Routes
const mvcRoutes = require("./routes/mvcRoutes.js");
const productsRouter = require("./routes/products.js");
const categoriesRouter = require("./routes/categories.js");
const registerRouter = require("./routes/register.js");
//API routes
const apiProductRouter = require("./routes/api/products.js");
const apiCategoryRouter = require("./routes/api/categories.js");
const apiUserRouter = require("./routes/api/user.js");
const protectedRoute = require("./middleware/protectedRoute.js");
const AppError = require("./utilities/appError.js");
const globalErrors = require("./middleware/globalErrors.js");

dotenv.config({ path: "./config.env" });

app.set("view engine", "pug");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow any origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Specify allowed methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Specify allowed headers
  next();
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(express.static(`${__dirname}/public/build`));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//rate limit

const limiter = rateLimit({
  max: 100,
  windowMS: 60 * 60 * 1000,
  message: "Too Many requests, try again after an Hour!",
});

app.use(limiter);

app.use(helmet());

app.use(mongoSanitize());

app.use(xss());

app.use(hpp());
//protectedRoute.protectedApiRoute,
app.use("/api", apiUserRouter, apiProductRouter, apiCategoryRouter);
app.use(
  "/mvc",
  registerRouter,
  protectedRoute.protectedRoute,
  mvcRoutes,
  productsRouter,
  categoriesRouter
);

app.all("*", async (req, res, next) => {
  next(new AppError("this route is not valid", 404)); //express assume pass err (ignore all middleware stack)
});

app.use(globalErrors);

//environemnt vairables
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(port));
db();
//security
//client do too many requests express-rate-limit
//denial of service DoS attack
//A brute force attack

//helmet
//NoSql injection
//express-mongo-sanitize
//XSS (Cross Site Scripting)
//XSS-clean
//Parameter Pollution
//hpp =>
