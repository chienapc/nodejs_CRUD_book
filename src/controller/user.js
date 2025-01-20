import * as service from "../service"
import { internalServerError, badRequest } from "../middlewares/handle_error"
export const getCurrent = async (req, res) => {
    try {
        const {id} = req.user
        const response = await service.getOne(id)
        return res.status(200).json(response)
    } catch (error) {
        
    }
}