import { internalServerError } from "../middlewares/handle_error";
import * as service from "../service";

export const getBooks = async (req, res) => {
  try {
    const response = await service.getBooks(req.query);
    return res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};
