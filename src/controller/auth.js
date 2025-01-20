import * as service from "../service";
import { email, password } from "../helper/joi_schema";
import joi from "joi";
import {
  internalServerError,
  badRequest,
} from "../middlewares/handle_error";

export const register = async (req, res) => {
  try {
    const { error }= joi.object({email, password}).validate(req.body);
    

    if (error) {
      return badRequest(error.details[0].message, res);
    }

    const response = await service.register(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      err: -1,
      message: "internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        err: 1,
        mes: "missing payload",
      });
    } else {
      const response = await service.login(req, res);
      res.status(200).json(response);
    }
  } catch (error) {
    internalServerError(res);
  }
};
