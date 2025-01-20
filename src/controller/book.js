import { badRequest, internalServerError } from "../middlewares/handle_error";
import * as service from "../service";
import { title, image, category_code, price} from '../helper/joi_schema'
import joi from "joi";

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
        const {error} = joi.object({title, image, category_code, price}).validate(req.body)
        if(error) return badRequest(error.details[0].message, res)
        const response = await service.createNewBook(req.body);
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}
