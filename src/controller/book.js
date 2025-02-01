import { badRequest, internalServerError } from "../middlewares/handle_error";
import * as service from "../service";
import {
  title,
  image,
  category_code,
  price,
} from "../helper/joi_schema";
import joi from "joi";
const cloudinary = require("cloudinary").v2;


export const getBooks = async (req, res) => {
  try {
    const response = await service.getBooks(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const createBooks = async (req, res) => {
  try {
    const fileData = req.file;
    
    const { error } = joi
      .object({ title, image, category_code, price })
      .validate({ ...req.body, image: fileData?.path });
    if (error) {
      // if has error, delete file on cloudinary storage
      if(fileData) cloudinary.uploader.destroy(fileData.filename)
      return badRequest(error.details[0].message, res);
    }
    const response = await service.createNewBook(req.body, fileData)
    res.status(200).json(response)
  } catch (error) {
    console.log(error);
  }
};
