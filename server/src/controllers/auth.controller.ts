import type { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler";
import { registerSchema, loginSchema } from "../validators/auth.validator";
import { registerService,loginService } from "../services/auth.service";

export const registerController = asyncHandler(
    async (req : Request, res : Response) => {

        const body = registerSchema.parse(req.body);
        const result = await registerService(body);
        
        return res.status(HTTPSTATUS.CREATED).json({
            success : true,
            message : "User registered Successfully",
            data : result
        })
    }
)

export const loginController = asyncHandler(
    async (req : Request, res : Response) => {
        const body = loginSchema.parse({
            ...req.body,
        });
        const {user, accessToken, expiresAt, reportSetting}= await loginService(body)

        return res.status(HTTPSTATUS.OK).json({
            messgae : "User logged in successfully",
            user,
            accessToken,
            expiresAt,
            reportSetting,
        })
    }
)