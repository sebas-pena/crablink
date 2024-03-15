import type { APIRoute } from "astro";
import { User, type IUserPopulated } from "../../db/models/User";
import { connectDB } from "../../db/connection";
import { createApiResponse, createErrorResponse } from "../../lib/api";

export const GET: APIRoute = async (ctx) => {
  try {
    const connection = await connectDB();
    const user: IUserPopulated = await User.findOne({ _id: ctx.locals.userID }).populate("links");
    await connection.disconnect();

    return createApiResponse<IUserPopulated>({
      data: user,
      message: "User found",
      status: 200,
    });

  } catch (e) {
    return createErrorResponse({
      message: e.message,
      status: 500,
      data: null,
    });
  }
};
