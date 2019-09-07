import { Strategy as OAuth2Strategy, StrategyOptions as OAuth2StrategyOptions, InternalOAuthError } from "passport-oauth2";
import { Profile as OAuth2Profile } from "@oauth-everything/profile";
import {
    ExtendableStrategyOptions,
    ExtendableStrategyOptionsWithRequest,
    OAuth2VerifyCallback,
    OAuth2VerifyFunction,
    OAuth2VerifyFunctionWithRequest,
    OAuth2VerifyFunctionWithResults,
    OAuth2VerifyFunctionWithRequestAndResults
} from "@oauth-everything/oauth2-types";

import { User } from "./ApiData/User";
import { ExpandableField } from "./ExpandableField";
import { Scope } from "./Scope";
import { buildPhotos, normalizeGender } from "./Util";

interface OptionsMixin {
    profileFields?: ExpandableField[];
}

interface TokenRequestResponse {
    expires_in: number;
    status: string;
    access_token: string;
    token_type: string;
    refresh_token: string;
    scope: string;
}

export type Profile = OAuth2Profile<User>;
export type StrategyOptions = ExtendableStrategyOptions<OptionsMixin>;
export type StrategyOptionsWithRequest = ExtendableStrategyOptionsWithRequest<OptionsMixin>;
export type VerifyCallback<TUser = object, TInfo = object> = OAuth2VerifyCallback<TUser, TInfo>;
export type VerifyFunction<TUser, TInfo> = OAuth2VerifyFunction<Profile, TUser, TInfo>;
export type VerifyFunctionWithRequest<TUser, TInfo> = OAuth2VerifyFunctionWithRequest<Profile, TUser, TInfo>;
export type VerifyFunctionWithResults<TUser, TInfo> = OAuth2VerifyFunctionWithResults<TokenRequestResponse, Profile, TUser, TInfo>;
export type VerifyFunctionWithRequestAndResults<TUser, TInfo> = OAuth2VerifyFunctionWithRequestAndResults<TokenRequestResponse, Profile, TUser, TInfo>;

export class Strategy<TUser = object, TInfo = object> extends OAuth2Strategy {

    public name = "deviantart";
    private fields: ExpandableField[];

    constructor(
        options: StrategyOptions,
        verify: VerifyFunction<TUser, TInfo>
            | VerifyFunctionWithResults<TUser, TInfo>
    )

    constructor(
        options: StrategyOptionsWithRequest,
        verify: VerifyFunctionWithRequest<TUser, TInfo>
            | VerifyFunctionWithRequestAndResults<TUser, TInfo>
    )

    constructor(
        options: StrategyOptions
            | StrategyOptionsWithRequest,
        verify: VerifyFunction<TUser, TInfo>
            | VerifyFunctionWithResults<TUser, TInfo>
            | VerifyFunctionWithRequest<TUser, TInfo>
            | VerifyFunctionWithRequestAndResults<TUser, TInfo>
    ) {

        super(
            {
                authorizationURL: "https://www.deviantart.com/oauth2/authorize",
                tokenURL: "https://www.deviantart.com/oauth2/token",
                scope: [Scope.USER],
                ...options
            } as OAuth2StrategyOptions,
            verify as VerifyFunction<TUser, TInfo>
        );

        this.fields = options.profileFields || [
            ExpandableField.USER_DETAILS,
            ExpandableField.USER_PROFILE
        ];

    }

    public userProfile(accessToken: string, done: (err?: Error | null, profile?: Profile | null) => void): void {

        this._oauth2.useAuthorizationHeaderforGET(true);
        this._oauth2.get("https://www.deviantart.com/api/v1/oauth2/user/whoami?expand=" + this.fields.join(","), accessToken, (error, result) => {

            if (error) return done(new InternalOAuthError("Failed to fetch user profile", error));

            let json: User;

            try {
                json = JSON.parse(result as string) as User;
            }
            catch (parseError) {
                return done(new InternalOAuthError("Failed to parse user profile", parseError));
            }

            done(null, {
                provider: this.name,
                id: json.userid,
                username: json.username,
                displayName: json.profile && json.profile.real_name,
                profileUrl: `https://www.deviantart.com/${json.username}`,
                gender: json.details && normalizeGender(json.details.sex) || undefined,
                aboutMe: json.profile && json.profile.tagline,
                created: json.details && json.details.joindate ? new Date(json.details.joindate) : undefined,
                name: {
                    formatted: json.profile && json.profile.real_name
                },
                photos: buildPhotos(json),
                urls: json.profile && json.profile.website ? [{ value: json.profile.website }] : undefined,
                _raw: result as string,
                _json: json
            });

        });

    }

}
