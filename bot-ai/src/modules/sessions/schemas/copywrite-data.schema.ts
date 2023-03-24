import { CopywritingData } from "./interfaces/sessions.interfacs";

export class CopywritingService {
    description: string;
    keywords: string;
    name: string;
    tickDescription: boolean;
    tickKeywords: boolean;
    tickName: boolean;

    createCopywritingSession() {
        return {
            description: '',
            keywords: '',
            name: '',
            tickDescription: false,
            tickKeywords: false,
            tickName: false
        }
    }

    setCopywritingSession(copywritingSession: Partial<CopywritingData>) {
        return {
            description: copywritingSession.description,
            keywords: copywritingSession.keywords,
            name: copywritingSession.name,
            tickDescription: copywritingSession.tickDescription,
            tickKeywords: copywritingSession.tickKeywords,
            tickName: copywritingSession.tickName
        }
    }
}