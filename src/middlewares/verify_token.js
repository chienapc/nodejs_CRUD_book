import jwt, { TokenExpiredError } from "jsonwebtoken";
import { badRequest, notAuth } from "./handle_error";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return badRequest("Require authorization", res);
  }
  const accessToken = token.split(" ")[1];
  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const isChecked = err instanceof TokenExpiredError;
      if (!isChecked) return notAuth("Access token invalid", res, !isChecked);
      if (isChecked) return notAuth("Access token expired", res, isChecked);
    }

    req.user = user;
    next();
  });
};

export default verifyToken;
