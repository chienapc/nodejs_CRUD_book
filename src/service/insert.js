import db from '../models'
import data from '../../data/data.json'
import { generateCode } from '../helper/fn'
import category from '../models/category'


export const insertData = async () => {

    
    try {
        const categories = Object.keys(data)
        categories.forEach(async category => {
            await db.Category.create({
                code: generateCode(category),
                value: category
            })
        })
        const dataArr = Object.entries(data)
        dataArr.forEach(async item => {
            item[1].map(async book => {
                await db.Book.create({
                    title: book.bookTitle,
                    price: book.bookPrice,
                    image: book.imageUrl,
                    category_code: generateCode(item[0])
                })
            })
        })

        return "oke"
    } catch (error) {
        return error
    }
}