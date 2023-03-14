import { Types } from "mongoose";
import { Key } from "src/modules/keys-generator/intrerfaces/key.interface";

export interface CheckData {
    category: null | Types.ObjectId,
    subCategory: null | Types.ObjectId,
    article: null | Types.ObjectId
}

export interface ResultDataInDB {
    article: string;
    img: string;
    product: {
        parentCategory: any;
        subCategory: any;
        name: any;
        keys: Key[];
    };
}
 
