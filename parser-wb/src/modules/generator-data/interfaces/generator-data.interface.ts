export interface IGeneratorData {
    article: number;
    data_generation: Array<Array<Record<string, string>>>;
    counter: number;
    instance: number;
    result: Array<Record<string, string>>;
}