import { UserSimple } from "./User";

export interface Deviation {
    deviationid: string;
    printid: string | null;
    url?: string;
    title?: string;
    category?: string;
    category_path?: string;
    is_favourited?: boolean;
    is_deleted: boolean;
    author?: UserSimple;
    stats?: {
        comments: number;
        favourites: number;
    };
    published_time?: string;
    allows_comments?: boolean;
    preview?: {
        src: string;
        height: number;
        width: number;
        transparency: boolean;
    };
    content?: {
        src: string;
        height: number;
        width: number;
        transparency: boolean;
        filesize: number;
    };
    thumbs?: Array<{
        src: string;
        height: number;
        width: number;
        transparency: boolean;
    }>;
    videos?: Array<{
        src: string;
        quality: string;
        filesize: number;
        duration: number;
    }>;
    flash?: {
        src: string;
        height: number;
        width: number;
    };
    daily_deviation?: {
        body: string;
        time: string;
        giver: UserSimple;
        suggester?: UserSimple;
    };
    excerpt?: string;
    is_mature?: boolean;
    is_downloadable?: boolean;
    download_filesize?: number;
    challenge?: {
        type: Array<unknown>;
        completed: boolean;
        tags: Array<unknown>;
        locked?: boolean;
        credit_deviation: string | null;
        media: Array<unknown>;
        level_label?: string;
        time_limit?: number;
        levels?: string[];
    };
    challenge_entry?: {
        challengeid: string;
        challenge_title: string;
        challenge?: Deviation;
        timed_duration: number;
        submission_time: string;
    };
    motion_book?: {
        embed_url: string;
    };
}
