const joi = require('joi')

const SignUpSchema = joi.object({
    name: joi.string().trim().required().min(5).max(20).default('Breadan'),
    email: joi.string().email().required(),
    password: joi.string().required(),
    age: joi.number().min(15).max(80).integer().positive(),
    gender: joi.string().valid('male', 'female'),
    bio:joi.string(), 
    role:joi.string()
}).required()



const signInSchema = joi.object({
    email:joi.string().email().required(),
    password:joi.string().required()
})

module.exports = {
    SignUpSchema,
    signInSchema
}

