import db from "../models";
import { Op } from "sequelize";

export const getBooks = async ({ page, limit, order, name, ...query }) => {
  try {
    const queries = { raw: true, nest: true };

    // select from offset position
    const offset = (!page || +page <= 1) ? 0 : (+page - 1);
    const fLimit = +limit || +process.env.LIMIT_BOOK;

    // select base page,  consider page have 5 items (limit = 5 ) and page = 2 then starting point will be 5 => select the second page
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (name) query.title = { [Op.substring]: name };
    if (order) {
      queries.order = [order];
    }

    

    const response =await db.Book.findAndCountAll({
      where: query,
      ...queries,
    });

    return {
      err: response ? 0 : 1,
      mes: response ? "Got" : "No book was found",
      bookData: response,
    };
  } catch (error) {
    console.log(error);
  }
};
