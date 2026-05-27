import dotenv from "dotenv";
dotenv.config();

export const getEnv = (key : string, defaultValue ?: string) => {
    const value = process.env[key];
    if(value === undefined){
        if(defaultValue === undefined){
            throw new Error(`Environment variable ${key} is not initialized`)
        }
        return defaultValue;
    }
    return value;
}