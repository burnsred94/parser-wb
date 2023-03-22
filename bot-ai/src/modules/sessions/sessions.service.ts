import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/sessions.schema';

@Injectable()
export class SessionsService {

    constructor(@InjectModel(Session.name) private _sessionRepository: Model<SessionDocument>) { }


    async createSession(session: Session) {
        return await this._sessionRepository.create(session);
    }

    async findOneAndUpdate(userId: Session['userId'], data: Partial<Session>) {
        return await this._sessionRepository.findOneAndUpdate({
            where: {
                userId: userId
            },
            data,
        });
    }

    async findOne(userId: Session['userId']) {
        return await this._sessionRepository.findOne({
            where: {
                userId: userId
            }
        });
    }

    async delete(userId: Session['userId']) {
        return await this._sessionRepository.deleteOne({
            where: {
                userId: userId
            }
        });
    }
}
