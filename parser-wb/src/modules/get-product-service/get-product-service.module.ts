import { Module } from '@nestjs/common';

@Module({
    exports: [GetProductServiceModule]
})
export class GetProductServiceModule { }
