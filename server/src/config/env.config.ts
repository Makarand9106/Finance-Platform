import { getEnv } from '../utils/getenv';

const envConfig = () => ({
    NODE_ENV : getEnv("NODE_ENV", "development"),
    PORT : getEnv("PORT", "4000"),
    BASE_PATH : getEnv("BASE_PATH", "/api"),
    MONGO_URI : getEnv("MONGO_URI",""),
    JWT_SECRET : getEnv("JWT_SECRET", "secret_jwt"),
    JWT_EXPIRES_IN : getEnv("JWT_EXPIRES_IN", "45m"),
    JWT_REFRESH_SECRET : getEnv("JWT_REFRESH_SECRET", "secret_jwt_refresh"),
    JWT_REFRESH_EXPIRES_IN : getEnv("BASE_PATH", "50d"),
    GEMINI_API_KEY : getEnv("GEMINI_API_KEY",""),
    FRONTEND_ORIGIN : getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),

})

export const ENV =  envConfig();