import * as jose from "jose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signData(data: any, secret: string, expiresIn: string = "24h"): Promise<string> {
    const secretKey = new TextEncoder().encode(secret);

    return await new jose.SignJWT(data).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expiresIn).sign(secretKey);
}

export async function verifyData<T>(token: string, secret: string): Promise<T | null> {
    try {
        const secretKey = new TextEncoder().encode(secret);
        const { payload } = await jose.jwtVerify(token, secretKey);
        return payload as T;
    } catch {
        return null;
    }
}
