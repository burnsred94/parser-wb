
export class Copywriting {
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
}