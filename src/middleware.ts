import { defineMiddleware, sequence } from "astro/middleware";
import { User } from "./db/models/User";
import { signToken, verifyToken } from "./lib/jwt";
import { connectDB } from "./db/connection";

const createUser = async () => {
  const dbConnection = await connectDB()
  const user = await User.create({ links: [] })
  await dbConnection.disconnect()
  return user
}

export const authMiddleware = defineMiddleware(async (context, next,) => {
  let token = context.cookies.get("auth-token")?.value
  let payload: undefined | { userID: string } = undefined

  if (token !== undefined) {
    payload = (await verifyToken(token)).payload
  }

  if (payload === undefined) {
    const user = await createUser()
    const userID = user._id.toString()
    const newToken = await signToken(userID)
    context.cookies.set("auth-token", newToken, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      path: "/",
    })
    payload = { userID }
  }

  if (payload !== undefined) {
    const refreshedToken = await signToken(payload.userID)
    context.cookies.delete("auth-token")
    context.cookies.set("auth-token", refreshedToken, {
      maxAge: 60 * 60 * 24 * 365,
      httpOnly: true,
      path: "/",
    })
  }

  context.locals.userID = payload.userID
  return next()
});

export const onRequest = sequence(authMiddleware)
