import { jwtVerify, SignJWT } from "jose";

const secret = new TextEncoder().encode(import.meta.env.JWT_SECRET_KEY);

export const verifyToken = async (token?: string) => {
  try {
    const jwtVerifyResult = await jwtVerify<{ userID: string }>(token, secret);
    return {
      payload: jwtVerifyResult.payload,
      status: "success",
    } as const;
  } catch (err) {
    return { status: "error", msg: "could not validate auth token" } as const;
  }
};

export const signToken = async (userID: string) => {
  return await new SignJWT({ userID })
    .setProtectedHeader({ alg: "HS256" })
    .sign(secret)
}