const Joi = require("joi");

const register = {
  body: Joi.object().keys({
    username: Joi.string().alphanum().lowercase().min(3).max(20).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().min(3).max(15).required(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().min(3).max(15).required(),
  }),
};

module.exports = { register, login };
