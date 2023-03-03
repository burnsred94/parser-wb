import { ConfigService } from "@nestjs/config";
import { MongooseModuleOptions } from "@nestjs/mongoose";

export const getMongoconfig =  (configService:ConfigService):MongooseModuleOptions=>  {
    const mongoUri = getMongoConnectUri(configService)
    return {
        uri:mongoUri
    }
}

const getMongoConnectUri = (configService:ConfigService) => {
    const uri= `mongodb://${configService.get('MONGO_INITDB_ROOT_USERNAME')}:${configService.get('MONGO_INITDB_ROOT_PASSWORD')}@${configService.get('HOST_MONGO_DB')}:${Number(configService.get('MONGO_DB_PORT'))}`
    return uri
}