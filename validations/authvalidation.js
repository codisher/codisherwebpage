const joi = require('joi');

const registerValidation = (data) => {
    const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
        cpassword: joi.string(),
    });
    return schema.validate(data);
}

module.exports = 
{
    registerValidation
}