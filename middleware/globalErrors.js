const AppError = require("../utilities/appError");

const genrateErr = (err) => {
  switch (err.name) {
    case "CastError":
      return new AppError(`invlid ${err.path}: ${err.value}`, 400);
    case "ValidationError":
      return new AppError(
        `data validtion Error`,
        422,
        Object.keys(err.errors).map((key) => ({
          [key]: err.errors[key].message,
        }))
      );
    case "JsonWebTokenError":
      return new AppError(
        "401 Your are not authorized to access this Resource.",
        401
      );
    default:
      return err;
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //default status code
  err.status = err.status || "error";

  const error = genrateErr(err);

  let response = {
    status: error.status,
    message: error.message,
  };
  if (error.errors) {
    response.errors = error.errors;
  }
  if (process.env.ENV === "dev") {
    response.stack = error.stack;
    response.error = err;
  }
  res.status(error.statusCode).json(response);
};
