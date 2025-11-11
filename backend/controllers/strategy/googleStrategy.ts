import passport from "passport";
import {Profile, Strategy as GoogleStrategy} from "passport-google-oauth20";
import dotenv from "dotenv";
import { Request} from "express";
import { user, UserModel } from "../../models/User";

dotenv.config();

passport.use (new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
},
async (req: Request, accessToken: string, refreshToken : string, profile : Profile, cb: (error: any, user?: user | false) => void) => {

    const {emails, displayName, photos} = profile;
    console.log("this is my Profile", profile);
    try {
        let user = await UserModel.findOne({email: emails?.[0]?.value});
        if(user) {
            if(!user.profilePicture && photos?.[0].value) {
                user.profilePicture = photos?.[0].value
                await user.save();
            }
            return cb (null, user)
        }

        user = await UserModel.create({
            googleId: profile.id,
            name : displayName, 
            email: emails?.[0].value,
            profilePicture: photos?.[0].value,
            isVerified : emails?.[0]?.verified,
            agreeTerms: true,

        })

        cb(null, user)
    } catch (error) {
        cb(error)
    }
}

))

export default passport;