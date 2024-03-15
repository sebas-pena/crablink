import type { APIRoute } from "astro";
import { connectDB } from "../../db/connection";
import { Link, type ILink } from "../../db/models/Link";
import { User } from "../../db/models/User";
import { nanoid } from "nanoid";
import { createApiResponse, createErrorResponse } from "../../lib/api";

export const POST: APIRoute = async ({ locals, request }) => {
  try {
    const userID = locals.userID
    const body = await request.json();
    const { url, alias } = body;

    const connection = await connectDB();
    const link = await Link.create({ url, alias, clicks: 0, id: nanoid(7) });
    const response = await User.findOneAndUpdate(
      { _id: userID },
      { $push: { links: link._id } },
      { upsert: true, new: true }
    );

    await connection.disconnect();

    return createApiResponse<ILink>({
      data: link,
      message: "Link shortened",
      status: 200,
    })

  } catch (error) {
    return createErrorResponse({
      message: "An error occurred",
      status: 500,
      data: null,
    });
  }
}