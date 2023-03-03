import { Types } from "mongoose";

export class DtoParentCategory {
    name: string;
    categories: Types.ObjectId;
}