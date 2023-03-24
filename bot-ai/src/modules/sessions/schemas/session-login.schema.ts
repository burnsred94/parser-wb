import { Login } from "./interfaces/sessions.interfacs";

export class LoginSession {
    email: string;
    password: string;
    tickEmail: boolean;
    tickPassword: boolean;
    isLogin: boolean;
    

    createDataSetLogin() {
        return {
            email: '',
            password: '',
            tickEmail: false,
            tickPassword: false,
            isLogin: false,
        }
    }

    updateLoginSessionDate(data: Partial<Login>){
        return {
            email: data.email,
            password: data.password,
            tickEmail: data.tickEmail,
            tickPassword: data.tickPassword,
            isLogin: data.isLogin,
        }
    }
}