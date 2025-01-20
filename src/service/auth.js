import { raw } from 'mysql2'

const db = require('../models')
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(8)
const jwt = require('jsonwebtoken')


const hashPassword = password => bcrypt.hashSync(password, salt)

export const register = ({email, password}) => new Promise( async (resolve, reject) => {
    try {
        

        const response = await db.User.findOrCreate({
            where: { email : email},
            defaults: {
                email: email,
                password: hashPassword(password)
            }
        })
        const token = response[1] ? jwt.sign({id: response[0].id, email: response[0].email, role_code: response[0].role_code}, process.env.JWT_SECRET, {expiresIn: '5d'}) : null
        //console.log(response[0].dataValues.email)
        resolve({
            err: response[1] ? 0 : 1,
            mes: response[1] ? 'register successed!' : 'email is used',
            token: token
        })
    } catch (error) {  
        reject(error)
    }
});

export const login = async (req, res) => {
    try {
        
        const {email, password} = req.body;

        const user = await db.User.findOne({
            where: {email},
            raw: true,
        })


        
        

        if(!user){
            res.status(401).json({
                message: "Wrong input email or password!"
            })
        }else{
            if(bcrypt.compareSync(password, user.password)){
                // return token
                const token = jwt.sign({id: user.id, email: user.email, role_code: user.role_code}, process.env.JWT_SECRET, {expiresIn: '5d'});

                res.status(200).json({
                    message: "login successfully",
                    'access token': `Bearer ${token}`
                })
            }
            else{
                res.status(401).json({
                    message: "Wrong input email or password!"
                })
            }
        }

    } catch (error) {
        res.status(500).json({
            message: "server internal error, login"
        })
        
    }
}
