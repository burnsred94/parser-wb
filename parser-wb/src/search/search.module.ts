import { Module } from '@nestjs/common';
import { KeysGeneratorModule } from 'src/keys-generator/keys-generator.module';

@Module({
    imports: [KeysGeneratorModule]
})
export class SearchModule {}
