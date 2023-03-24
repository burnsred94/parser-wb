import { Stats } from "./interfaces/sessions.interfacs";


export class SessionStats {
    start_bot: number;
    channels_button: number;
    success_registration: number;
    support_button: number;
    start_generation_button: number;
    regenerate_button: number;
    track_position_button: number;
    reviews_or_copyright: number[];

    createStatsSession() {
        return {
            start_bot: 0,
            channels_button: 0,
            success_registration: 0,
            support_button: 0,
            start_generation_button: 0,
            regenerate_button: 0,
            track_position_button: 0,
            reviews_or_copyright: []
        }
    }

    getNewStatsSession(stats: Partial<Stats>) {
        return {
            start_bot: stats.start_bot,
            channels_button: stats.channels_button,
            success_registration: stats.success_registration,
            support_button: stats.support_button,
            start_generation_button: stats.start_generation_button,
            regenerate_button: stats.regenerate_button,
            track_position_button: stats.track_position_button,
            reviews_or_copyright: stats.reviews_or_copyright
        }
    }

    


}