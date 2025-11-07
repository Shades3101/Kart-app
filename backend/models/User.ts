import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface user {
    _id: mongoose.Types.ObjectId,
    name:string,
    email: string,
    password: string,
    googleId: string,
    profilePicture?: string,
    phone?: string,
    isVerified: boolean,
    token?: string,
    resetPassToken: string,
    resetPassExpire: Date,
    agreeTerms: boolean,
    addresses: mongoose.Types.ObjectId[],
    comparePass(candidatePass : string): Promise<boolean>

}

const userSchema = new Schema<user>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password : {type: String},
    googleId: {type: String},
    profilePicture: {type: String, default: null},
    phone: {type: String, default: null},
    isVerified : {type: Boolean, default: false},
    agreeTerms: {type: Boolean, default:false},
    token: {type: String, default: null},
    resetPassExpire: {type: Date, default: null},
    resetPassToken: {type: String, default: null},
    addresses: [{type: Schema.Types.ObjectId, ref: "Address"}]

}, {timestamps: true})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

userSchema.methods.comparePass = async function (candidatePass : string): Promise<boolean> {

    return bcrypt.compare(candidatePass, this.password)
}

export const UserModel = mongoose.model("User", userSchema);