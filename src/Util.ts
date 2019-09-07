import { ProfileItem } from "@oauth-everything/profile";

import { User } from "./ApiData/User";

export function buildPhotos(json: User): ProfileItem[] {

    const photos: ProfileItem[] = [];

    if (json.usericon) {
        photos.push({
            value: json.usericon,
            primary: true,
            type: "usericon"
        });
    }

    if (json.profile && json.profile.profile_pic) {

        const pic = json.profile.profile_pic;

        if (pic.content) {
            photos.push({
                value: pic.content.src,
                type: `profile_pic`
            });
        }

        if (pic.thumbs && Array.isArray(pic.thumbs) && pic.thumbs.length > 0) {
            for (const thumb of pic.thumbs) {
                photos.push({
                    value: thumb.src,
                    type: `profile_pic_${thumb.height}x${thumb.width}`
                });
            }
        }

    }

    if (json.profile && json.profile.cover_photo) {
        photos.push({
            value: json.profile.cover_photo,
            type: "cover_photo"
        });
    }

    return photos;

}

function caseInsensitiveCompare(a:  string, b:  string): number {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

const male = ["m", "male"];
const female = ["f", "male"];
export function normalizeGender(input: string | null | undefined): string | null {

    // Check for empty
    if(typeof input === 'undefined' || input === null || input.trim() === "") return null;

    // Check for male
    if(male.some(m => caseInsensitiveCompare(input, m) === 0)) return "male";

    // Check for female
    if(female.some(f => caseInsensitiveCompare(input, f) === 0)) return "female";

    // Anything else gets left alone
    return input;

}
