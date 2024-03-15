import type { APIRoute } from "astro";
import { connectDB } from "../../../db/connection";
import { User, type IUserPopulatedDocument } from "../../../db/models/User";
import { Link } from "../../../db/models/Link";

export const DELETE: APIRoute = async ({ params, locals }) => {
  const id = params.id;
  const userID = locals.userID;

  try {
    const connection = await connectDB();
    const user: IUserPopulatedDocument = await User.findOne({ _id: locals.userID }).populate("links");

    if (!user) {
      return new Response("User not found", { status: 404 });
    }
    user.links

    let link = user.links.find(link => link.id === id);
    if (!link) {
      return new Response("Link not found", { status: 404 });
    }

    await Promise.all([
      Link.deleteOne({ id: link.id }),
      User.updateOne({ _id: userID }, { $pull: { links: link._id } }),
    ]);

    await connection.disconnect();

    return new Response("Link deleted", { status: 200 });

  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}