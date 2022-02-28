const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema
const aggregatePaginate = require('mongoose-aggregate-paginate-v2')

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
    },
    customerId: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        maxlength: 10,
        minlength: 10,
        default: "",
    },
    address: {
        type: String,
    },
    avatar: {
        type: String,
        default: "",
    },
    roles: {
        type: String,
        enum: ["student", "teacher"],
        default: "student"
    },
    balance: {
        type: Number,
        default: 0,
    },
    point: {
        type: Number,
        default: 0,
    },
    logical_delete: {
        type: Date,
        default: null
    },
}, {
    timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.__v
            delete ret.logical_delete
            return ret;
        },
    }
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error(error)
    }
};

// custom client
userSchema.index({ email: 1, phoneNumber: 1 }, { unique: true })
userSchema.plugin(aggregatePaginate);
const UserModel = mongoose.model('users', userSchema)
module.exports = UserModel