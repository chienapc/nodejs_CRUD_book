import { response } from "express";
import { raw } from "mysql2";
import { notAuth } from "../middlewares/handle_error";

const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(8);
const jwt = require("jsonwebtoken");

const hashPassword = (password) => bcrypt.hashSync(password, salt);

export const register = ({ email, password }) =>
  new Promise(async (resolve, reject) => {
    try {
      const response = await db.User.findOrCreate({
        where: { email: email },
        defaults: {
          email: email,
          password: hashPassword(password),
        },
      });
      const accessToken = response[1]
        ? jwt.sign(
            {
              id: response[0].id,
              email: response[0].email,
              role_code: response[0].role_code,
            },
            process.env.JWT_SECRET,
            { expiresIn: "5s" }
          )
        : null;
      //console.log(response[0].dataValues.email)

      //REFRESH TOKEN
      const refreshToken = response[1]
        ? jwt.sign(
            { id: response[0].id },
            process.env.JWT_SECRET_REFRESH_TOKEN,
            { expiresIn: "15d" }
          )
        : null;

      resolve({
        err: response[1] ? 0 : 1,
        mes: response[1] ? "register successed!" : "email is used",
        accessToken: accessToken,
        refreshToken: refreshToken,
      });

      if (refreshToken) {
        await db.User.update(
          { refresh_token: refreshToken },
          {
            where: { id: response[0].id },
          }
        );
      }
    } catch (error) {
      reject(error);
    }
  });

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.User.findOne({
      where: { email },
      raw: true,
    });

    if (!user) {
      res.status(401).json({
        message: "Wrong input email or password!",
      });
    } else {
      if (bcrypt.compareSync(password, user.password)) {
        // return token
        const token = jwt.sign(
          { id: user.id, email: user.email, role_code: user.role_code },
          process.env.JWT_SECRET,
          { expiresIn: "5s" }
        );
        //REFRESH TOKEN
        const refreshToken = user
          ? jwt.sign({ id: user.id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
              expiresIn: "15d",
            })
          : null;

        if (refreshToken) {
          await db.User.update(
            { refresh_token: refreshToken },
            {
              where: { id: user.id },
            }
          );
        }

        res.status(200).json({
          message: "login successfully",
          "access token": `Bearer ${token}`,
          "refresh token": `Bearer ${refreshToken}`,
        });
      } else {
        res.status(401).json({
          message: "Wrong input email or password!",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "server internal error, login",
    });
  }
};

export const refreshToken = async ({refreshToken}) => {
    try {
        const response = await db.User.findOne({
            where: {refresh_token : refreshToken}
        })
        if(response){
            return jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_TOKEN,  (err, decode) => {
                if(err) {
                    return {
                        err: 1,
                        mes: 'Refresh token expired. Please login again'
                    }
                }else{
                    const accessToken =  jwt.sign(
                        { id: response.id, email: response.email, role_code: response.role_code },
                        process.env.JWT_SECRET,
                        { expiresIn: "1d" }
                      );
                      
                      return {
                        err: 0,
                        mes: 'Oke',
                        'access token':  accessToken,
                        'refresh token': refreshToken
                      }

                      
                }
                
            })


        }else{
          return {
            err: 1,
            mes: 'Refresh token invalid. Please send correct refresh token'
          }
        }
        
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "server internal error, login",
      });
    }
}
