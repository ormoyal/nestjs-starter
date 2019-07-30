import {Document, Model, model, Schema } from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
// import { IRole } from '../role/role.model';
// import { IProductType } from '../product_type/product_type.model';
const ObjectId = Schema.Types.ObjectId;

export interface IUser extends Document {
    name: string;
    email?: string;
    password: string;
    phone: string;
    deleted: boolean;
    // roles: IRole['_id'];
    // products: IProductType['_id'];
    project_managers: IUser['_id'];

    comparePassword: comparePasswordFunction;
    generateToken: generateTokenFunction;
}

type UserModel = Model<IUser> & {
    findByToken?: findByToken;
};

export const userSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 70,
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // allowed for null values
        trim: true,
        lowercase: true,
        maxlength: 100,
        validate: {
            validator: (value: string) => /\S+@\S+\.\S+/.test(value),
            msg: "מייל אינו תקין"
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 35,
        trim: true
    },
    phone: {
        type: String,
        unique:true,
        required: true,
        trim: true,
        validate: {
            validator: function(v: string) {
                return /^[0]\d{9}$/g.test(v);
            },
            msg: "טלפון 10 ספרות, מתחיל בספרה 0"
        },
    },
    deleted:{
        type:Boolean,
        default:false,
        required:true
    },
    project_managers:[{
        type: ObjectId, ref: "User",
    }],
    roles:[{
        type: ObjectId, ref: "User_Role",
    }],
    products:[{
        type: ObjectId, ref: "Product_Type",
    }],

},{ timestamps: true });

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: boolean) => void) => void;
type generateTokenFunction = () => string;
type findByToken = (token: string) => IUser;

const comparePassword: comparePasswordFunction = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err: Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
};

const generateToken: generateTokenFunction = function () {
    const user = this;
    return jwt.sign({_id: user._id.toHexString()}, <string>process.env.JWT_SECRET, {expiresIn: "7d"}).toString();
};

const findByToken: findByToken = function (token) {
    const User = this;
    let decoded: any;
    try {
        decoded = jwt.verify(token, <string>process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject(e);
    }
    return User.findOne({_id: decoded._id}).populate("roles");
};

userSchema.statics.findByToken = findByToken;
userSchema.methods.comparePassword = comparePassword;
userSchema.methods.generateToken = generateToken;

userSchema.pre("save", function save(next) {
    const user = <IUser>this;
    if (!user.isModified("password")) { return next(); }
    bcrypt.genSalt(10, (err, salt) => {
        console.log('salt ', salt);
        if (err) { return next(err); }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) { return next(err); }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};


// const User: UserModel = model("User", userSchema);
// export default User;
