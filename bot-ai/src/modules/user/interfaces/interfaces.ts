export interface IUser {
    id: string;
    username: string;
    confirmed?: boolean;
    password: string;
    telegramUser: string;
    email: string;
    articles?: string[];
}