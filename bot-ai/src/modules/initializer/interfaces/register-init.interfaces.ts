import { Action } from "src/interfaces/telegraf-context.interfaces";

type RegisterState = Action.REGISTER | Action.DEFAULT | Action.REGISTER_SUCCESS;

export interface IRegisterInit {
    message: string;
    state: RegisterState;
}