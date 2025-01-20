import db from "../models";
import { internalServerError } from "../middlewares/handle_error";

export const getOne = async (userId) => {
  try {
    const response = await db.User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ['password', 'role_code']
      },
      include: [
        {
            model: db.Role, as: 'role_data',
            attributes: ['id', 'code', 'value']
        }
      ]
    });
    return {
        err: response? '0' : '1',
        mes: response? 'Got' : 'User not found',
        userData: response
    }
  } catch (error) {
    return {
        error
    }
  }
};
