const jwt = require("jsonwebtoken");
const User = require("./models/User");

require("dotenv").config();

module.exports.createAccessToken = (user) => {
  const data = {
    id: user._id,
    email: user.email,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(data, process.env.JWT_SECRET_KEY, {});
};

// [SECTION] Token Verification
/*
Analogy
    Receive the gift and open the lock to verify if the the sender is legitimate and the gift was not tampered with
- Verify will be used as a middleware in ExpressJS. Functions added as argument in an expressJS route are considered as middleware and is able to receive the request and response objects as well as the next() function. Middlewares will be further elaborated on later sessions.
*/

module.exports.verify = (req, res, next) => {
  console.log(req.headers.authorization);

  // "req.headers.authorization" contains sensitive data and especially our token
  let token = req.headers.authorization;

  // This if statement will first check if a token variable contains "undefined" or a proper jwt.  we will check token's data type with "typeof", if it is "undefined" we will send a message to the client. Else if it is not, then we return the token.
  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No Token" });
  } else {
    console.log(token);
    token = token.slice(7, token.length);
    console.log(token);

    // [SECTION] Token Decryption
    /*
        Analogy
            Open the gift and get the content
        - Validate the token using the "verify" method decrypting the token using the secret code.
        - token - the jwt token passed from the request headers.
        - JWT_SECRET_KEY - the secret word from earlier which validates our token.
        - function(err,decodedToken) - err contains the error in verification, decodedToken contains the decoded data within the token after verification
        */

    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
      //If there was an error in verification, an erratic token, a wrong secret within the token, we will send a message to the client.
      if (err) {
        return res.status(404).send({
          error: "User not found",
        });
      } else {
        console.log("result from verify method:");
        console.log(decodedToken);

        req.user = decodedToken;

        // next() is an expressJS function which allows us to move to the next function in the route. It also passes details of the request and response to the next function/middleware.
        next();
      }
    });
  }
};

module.exports.verify2 = (req, res, next) => {
  console.log(req.headers.authorization);

  // "req.headers.authorization" contains sensitive data and especially our token
  let token = req.headers.authorization;

  // This if statement will first check if a token variable contains "undefined" or a proper jwt.  we will check token's data type with "typeof", if it is "undefined" we will send a message to the client. Else if it is not, then we return the token.
  if (typeof token === "undefined") {
    return res.send({ auth: "Failed. No Token" });
  } else {
    console.log(token);
    token = token.slice(7, token.length);
    console.log(token);

    // [SECTION] Token Decryption
    /*
        Analogy
            Open the gift and get the content
        - Validate the token using the "verify" method decrypting the token using the secret code.
        - token - the jwt token passed from the request headers.
        - JWT_SECRET_KEY - the secret word from earlier which validates our token.
        - function(err,decodedToken) - err contains the error in verification, decodedToken contains the decoded data within the token after verification
        */

    jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, decodedToken) {
      //If there was an error in verification, an erratic token, a wrong secret within the token, we will send a message to the client.
      if (err) {
        return res.status(403).send({
          error: "Forbidden Action",
        });
      } else {
        console.log("result from verify method:");
        console.log(decodedToken);

        req.user = decodedToken;

        // next() is an expressJS function which allows us to move to the next function in the route. It also passes details of the request and response to the next function/middleware.
        next();
      }
    });
  }
};

// [SECTION] Verify Admin
module.exports.verifyAdmin = (req, res, next) => {
  // console.log("result from verifyAdmin method");
  // console.log(req.user)

  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).send({
      auth: "Failed",
      message: "Action Forbidden",
    });
  }
};

// [SECTION] Error Handler
module.exports.errorHandler = (err, req, res, next) => {
  // Log the error
  console.error(err);

  const statusCode = err.status || 500;
  // If the error contains a message property, we use it as the error message, otherwise, to 'Internal Server Error'.
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message: errorMessage,
      errorCode: err.code || "SERVER_ERROR",
      details: err.details || null,
    },
  });
};

// [SECTION] Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.sendStatus(401);
  }
};
