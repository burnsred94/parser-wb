export interface IUser {
    id: string;
    username: string;
    confirmed?: boolean;
    password: string;
    generateSymbol:number;
    telegramUser: string;
    email: string;
    articles?: string[];
}