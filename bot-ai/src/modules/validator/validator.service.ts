import { BadRequestException, Injectable } from "@nestjs/common";
import { EMAIL_REGEXP } from "./constants/regexp.constants";

@Injectable()
export class ValidatorService {
    
    async validateTypesString(value: string): Promise<void> {
        if(typeof value!== 'string') {
            throw new BadRequestException('Вы должны ввести значения текстового формата')
        }
    }

    async validateEmail(value: string): Promise<void> {
        if(!value.match(EMAIL_REGEXP)){
            throw new BadRequestException('Вы должны ввести значение которое содержит символы ****@***.com')
        }
    }
}