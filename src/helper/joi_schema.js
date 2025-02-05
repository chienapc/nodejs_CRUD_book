import joi from "joi";

export const email = joi
  .string()
  .email({
    maxDomainSegments: 2,
    tlds: { allow: ["com"] },
  })
  .required();

export const password = joi.string().min(6).max(30).required();

export const title = joi.string().required();

export const price = joi.number().required();

export const category_code = joi.string().alphanum().required();

export const image = joi.string().required();

export const bid = joi.string().required();

export const bids = joi.array().required();

export const filename = joi.array().required();

export const refreshToken = joi.string().required();
