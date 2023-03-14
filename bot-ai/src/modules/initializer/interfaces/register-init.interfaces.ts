import { Action } from "src/interfaces/telegraf-context.interfaces";

type RegisterState = Action.REGISTER | Action.DEFAULT;

export interface IRegisterInit {
    message: string;
    state: RegisterState;
}