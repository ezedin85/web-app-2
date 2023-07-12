const mongoose = require("mongoose")
const validator = require("validator")

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    bank: {
        type: String,
        required: true,
    },
    package: {
        type: String,
        required: true,
    },
    depositor: {
        type: String,
        default: ""
    },
    trn: {
        type: String,
        default: ""
    },
    validated: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})


usersSchema.statics.register = async function (firstName, lastName, contact, email, bank, package){
    //validatioin
    if(!firstName || !lastName || !contact || !email || !bank || !package){
        throw Error("All Fields Must be filled")
    }
    
    if(!validator.isEmail(email)){
        throw Error("Not a valid email")
    }

    const exists = await this.findOne({contact})
    if(exists){
        throw Error("Contact already in use")
    }

    if(package === 'graphics' || package === 'interrior'){
        const user = await this.create({firstName, lastName, contact, email, bank, package})
        return user
    }else{
        throw Error("Unavaliable Package")
    }

}


module.exports = mongoose.model('user', usersSchema)