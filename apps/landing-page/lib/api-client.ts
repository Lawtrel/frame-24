import {
    AuthApi,
    Configuration,
} from '@repo/api-types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const createConfig = (token?: string) => {
    return new Configuration({
        basePath: baseURL,
        accessToken: token,
    });
};

export const api = {
    auth: new AuthApi(createConfig()),
};