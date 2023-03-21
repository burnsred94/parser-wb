import { IStats } from "../schemas/interfaces/stats.interfaces";

export interface StatsDto extends IStats {
    date: string;
}