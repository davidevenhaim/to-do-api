export type iUserLoginDetails = { username: string; password: string };

export type iToken = { token: string };

// should be in .env but for the task will be here.
export const SECRET_KEY = 'supersecretrandomgeneratedkey';
// In addition this secret key should be a complex random generated string.

export const SECRET_KEY_EXPIRY = '2d'; // 2 days
