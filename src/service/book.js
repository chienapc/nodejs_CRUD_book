import db from "../models";
import { Op } from "sequelize";
const cloudinary = require('cloudinary').v2

export const getBooks = async ({ page, limit, order, name, ...query }) => {
  try {
    const queries = { raw: true, nest: true };

    // select from offset position
    const offset = !page || +page <= 1 ? 0 : +page - 1;
    const fLimit = +limit || +process.env.LIMIT_BOOK;

    // select base page,  consider page have 5 items (limit = 5 ) and page = 2 then starting point will be 5 => select the second page
    queries.offset = offset * fLimit;
    queries.limit = fLimit;
    if (name) query.title = { [Op.substring]: name };
    if (order) {
      queries.order = [order];
    }

    const response = await db.Book.findAndCountAll({
      where: query,
      ...queries,
      attributes: {
        exclude: ["category_code"], // Đúng cú pháp
      },
      include: [
        {
          model: db.Category, // Không phải 'models', đúng là 'model'
          attributes: { exclude: ["createdAt", "updatedAt"] }, // Đúng cú pháp
          as: "categoryData", // Alias đúng
        },
      ],
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

export const createNewBook = async (body, fileData) => {
  try {
    const response = await db.Book.findOrCreate({
      where: {
        title: body.title,
      },
      defaults: body,
      image: fileData?.path,
      filename: fileData?.filename

    });

    if(!response[1]){
      cloudinary.uploader.destroy(fileData.filename)
    }

    return {
      err: response ? "0" : "1",
      mes: response ? "created" : "cannot create new book",
    };
  } catch (error) {
    cloudinary.uploader.destroy(fileData.filename)
    console.log(error);
  }
};


// UPDATE
export const updateBook  = async ({id, ...body}, fileData) => {
  try {
    if(fileData){
      body.image = fileData?.path
    }
    const response = await db.Book.update({body}, {
      where : {id}
    })

    return {
      err: response[0] > 0? 0: 1,
      mes: response[0] > 0? 'Updated' :  'Cannot update the book' 
    }
  } catch (error) {
    console.log(error)
  }
}


/*
  params = {
    bids = [id1, id2],
    filename = [filename1, filename2]
  }


*/

// DELETE
export const deleteBook = async ({bids, filename}) => {

  const transaction = await db.sequelize.transaction();
  try {
    const response = await db.Book.destroy({
      where: {id: bids},
      transaction
    })
    //cloudinary.uploader.destroy("123");

    
    cloudinary.api.delete_resources(filename)
    

    await transaction.commit();

    return {
      err: response[0] > 0 ? 0 : 1,
      mes: response[0] > 0 ?  `${response} book(s) was deleted` : "Can not detele book"
    }
  } catch (error) {
    await transaction.rollback();
    console.log(error)
  }
}