import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/sessions.schema';

@Injectable()
export class SessionsService {

    constructor(@InjectModel(Session.name) private _sessionRepository: Model<SessionDocument>) { }


    async create(session: Session) {
        return await this._sessionRepository.create({});
    }

}
