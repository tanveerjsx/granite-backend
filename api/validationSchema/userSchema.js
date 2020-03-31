const Joi = require('@hapi/joi');
const createVendorSchema=Joi.object({
    firstName:Joi.string().required().error(new Error('first name is required')),
    lastName:Joi.string().required().error(new Error('last name is required')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).error(new Error('please enter valid email')),
    password: Joi.string().required().error(new Error('password is required')),
    role:Joi.string().required().error(new Error('please specify role of user')),
    contact:Joi.string().regex(/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,5})|(\(?\d{2,6}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/).error(new Error('please provide Valid Phone Number')),
    profilePic:Joi.string(),
    storeName:Joi.string().required().error(new Error('please provide store name')),
    storeAddress:Joi.string().required().error( new Error('please provide store address'))
});
const createAdminSchema=Joi.object({
    firstName:Joi.string().required().error(new Error('first name is required')),
    lastName:Joi.string().required().error(new Error('last name is required')),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).error(new Error('please enter valid email')),
    password: Joi.string().required().error(new Error('password field is required')),
    role:Joi.string().required().error(new Error('please specify role of user')),
});

module.exports={
    createAdminSchema,
    createVendorSchema
}