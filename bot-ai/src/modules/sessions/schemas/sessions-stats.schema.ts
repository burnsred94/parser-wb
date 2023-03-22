import { Stats } from "./interfaces/sessions.interfacs";


export class SessionStats {
    start_bot: number;
    channels_button: number;
    success_registration: number;
    support_button: number;
    start_generation_button: number;
    regenerate_button: number;
    track_position_button: number;
    reviews_or_copyright: [];

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


}