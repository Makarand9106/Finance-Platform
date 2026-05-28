import jwt from "jsonwebtoken";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env.config";

type TimeUnit = 's' | 'm' | 'h' | 'd' | 'w' | 'y';
type TimeString = `${number}${TimeUnit}`
 
export type AccessTokenPayload = {
    userId : string;
}

type SignOptsAndSecret = SignOptions & {
    secret : string;
    expiresIn ?: TimeString | number
}

const defaults: SignOptions = {
    audience : ["user"]
}



const accessTokenSignOptions : SignOptsAndSecret= {
    expiresIn : ENV.JWT_EXPIRES_IN as TimeString,
    secret : ENV.JWT_SECRET
}

export const sigeJwtToken = (payload : AccessTokenPayload, options ?: SignOptsAndSecret) => {
    const isAccessedToken = !options || options === accessTokenSignOptions

    const {secret, ...opts} = options || accessTokenSignOptions
    
    const token = jwt. sign(payload, secret, {
        ...defaults,
        ...opts,
    });

    const expiresAt = isAccessedToken ? (jwt.decode(token) as JwtPayload)?.exp! * 1000 : undefined

    return {
        token,
        expiresAt,
    }

}