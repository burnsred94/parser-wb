import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Stats } from '../stats/schemas/stats.schema';
import { CopywritingService } from './schemas/copywrite-data.schema';
import { LoginSession } from './schemas/session-login.schema';
import { Session, SessionDocument } from './schemas/sessions.schema';

@Injectable()
export class SessionsService {

    constructor(@InjectModel(Session.name) private _sessionRepository: Model<SessionDocument>) { }


    async createSession(session: Session) {
        return await this._sessionRepository.create(session);
    }

    async findOneAndUpdate(userId: Session['userId'], data: Partial<Session>) {
        return await this._sessionRepository.findOneAndUpdate({ userId: userId }, { ...data });
    }

    async updateOne(userId: Session['userId'], data: Partial<Session>) {
        return await this._sessionRepository.updateOne({ userId: userId }, { ...data })
    }

    async updateStats(userId: Session['userId'], data: Partial<Stats>) {
        return await this._sessionRepository.updateOne({ userId: userId }, { stats: data })
    }

    async updateLogin(userId: Session['userId'], data: Partial<LoginSession>) {
        return await this._sessionRepository.updateOne({ userId: userId }, { login: data })
    }

    async updateCopywriterData(userId: Session['userId'], data: Partial<CopywritingService>) {
        return await this._sessionRepository.updateOne({ userId: userId }, { copywriting_data: data })
    }

    async findOne(userId: Session['userId']) {
        return await this._sessionRepository.findOne({ userId: userId });
    }

    async delete(userId: Session['userId']) {
        return await this._sessionRepository.deleteOne({ userId: userId });
    }
}
