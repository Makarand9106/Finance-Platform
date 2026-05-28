import mongoose from "mongoose";
import { asyncHandler } from "../middlewares/asyncHandler";
import UserModel from "../models/user.model";
import { NotFoundException, UnauthorizedException } from "../utils/app-error";
import { RegisterSchemaType, type LoginSchemaType } from "../validators/auth.validator";
import ReportSettingModel, { ReportFrequencyEnum } from "../models/report-setting.model";
import { calculateNextReportDate } from "../utils/helper"
import { sigeJwtToken } from "../utils/jwt";

export const registerService = async(body : RegisterSchemaType) => {
    const {email} = body;

    const session = await mongoose.startSession();

    try {
        await session.withTransaction(async () => {

            const existingUser = await UserModel.findOne({email}).session(session);;
            if(existingUser){
                throw new NotFoundException("Email already exists")
            }
            const newUser = new UserModel({
                ...body,
                
            })
            await newUser.save({ session })
            
            const reportSetting = new ReportSettingModel({
                userId : newUser._id,
                frequency : ReportFrequencyEnum.MONTHLY,
                isEnabled : true,
                lastSentDate : null,
                nextReportDate : calculateNextReportDate()
            })

            await reportSetting.save({ session })

            return {
                user : newUser.omitPassword()
            }
        }) 

    } catch (error) {
        throw error;
    }finally{
        await session.endSession();
    }
}


export const loginService = async(body : LoginSchemaType) => {
    const {email, password} = body;
    const user = await UserModel.findOne({ email }).select("+password");

    if(!user) throw new NotFoundException("Email or password doesnt match")

    const isPasswordValid = await user.comparePassword(password)
    if(!isPasswordValid) throw new UnauthorizedException("Invalid password")

    const {token, expiresAt}= sigeJwtToken({userId : user.id})

    const reportSetting = await ReportSettingModel.findOne({
        userId : user.id
    }, {_id : 1, frequency : 1, isEnabled : 1}).lean

    return {
        user : user.omitPassword(),
        accessToken : token,
        expiresAt,
        reportSetting,
    }

}

// import mongoose from "mongoose";
// import UserModel, {type UserDocument} from "../models/user.model";
// import { NotFoundException } from "../utils/app-error";
// import { RegisterSchemaType } from "../validators/auth.validator";
// import ReportSettingModel, { ReportFrequencyEnum } from "../models/report-setting.model";
// import { calculateNextReportDate } from "../utils/helper";

// type RegisterServiceReturnType = {
//   user: Omit<UserDocument, "password">;
// };

// export const registerService = async (
//   body: RegisterSchemaType
// ): Promise<RegisterServiceReturnType> => {
//   const { email } = body;

//   const session = await mongoose.startSession();

//   try {
//     let createdUser:
//       | Omit<UserDocument, "password">
//       | undefined;

//     await session.withTransaction(async () => {
//       const existingUser = await UserModel.findOne({
//         email,
//       }).session(session);

//       if (existingUser) {
//         throw new NotFoundException(
//           "Email already exists"
//         );
//       }

//       const newUser = new UserModel({
//         ...body,
//       });

//       await newUser.save({ session });

//       const reportSetting = new ReportSettingModel({
//         userId: newUser._id,

//         frequency: ReportFrequencyEnum.MONTHLY,

//         isEnabled: true,

//         lastSentDate: null,

//         nextReportDate: calculateNextReportDate(),
//       });

//       await reportSetting.save({ session });

//       createdUser = newUser.omitPassword();
//     });

//     if (!createdUser) {
//       throw new Error("User creation failed");
//     }

//     return {
//       user: createdUser,
//     };
//   } catch (error) {
//     throw error;
//   } finally {
//     await session.endSession();
//   }
// };