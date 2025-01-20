import { forbidden } from "./handle_error"

export const isAdmin = (req, res, next) =>{
    const {role_code} = req.user
    if(role_code !== "R1"){
        return forbidden("Require role admin", res)
    }
    next()
 }

 export const isModerator = (req,res, next) => {
    const {role_code} = req.user 
    if(role_code !== "R1" && role_code !== "R2"){
        return forbidden("require role admin or moderator", res)

    }
    next()
 }