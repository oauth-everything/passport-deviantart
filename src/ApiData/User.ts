import { Deviation } from "./Deviation";

export interface UserSimple {
    userid: string;
    username: string;
    usericon: string;
    type: string;
}
export interface User extends UserSimple {
    is_watching?: boolean;
    details?: {
        sex: string | null;
        age: number | null;
        joindate: string;
    };
    geo?: {
        country: string;
        countryid: number;
        timezone: number;
    };
    profile?: {
        user_is_artist: boolean;
        artist_level: string | null;
        artist_speciality: string | null;
        real_name: string;
        tagline: string;
        website: string;
        cover_photo: string;
        profile_pic: Deviation;
    };
    stats?: {
        watchers: number;
        friends: number;
    };
}
