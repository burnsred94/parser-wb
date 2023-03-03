import { Key } from "src/modules/keys-generator/intrerfaces/key.interface";

export interface KeyWb extends Key {
    position: number;
}

export type Article = string | number