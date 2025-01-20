import { internalServerError } from '../middlewares/handle_error'
import * as services from '../service'

export const insertData = async (req, res) => {
     try {
        const response = await services.insertData()
        return res.status(200).json(response)
     } catch (error) {
        return internalServerError(res)
     }
}