import { Schema, model, Types, type Document, type PopulatedDoc } from "mongoose";
import type { ILink } from "./Link";

type IUserBase = {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type IUser = IUserBase & { links: Types.ObjectId[] }
export type IUserPopulated = IUserBase & { links: ILink[] }

export type IUserDocument = Document<IUser>;
export type IUserPopulatedDocument = {
  links: PopulatedDoc<ILink & Document>[]
} & Document<IUser>;

export const userSchema = new Schema<IUser>({
  links: [{ type: Types.ObjectId, ref: "Link" }],
}, {
  versionKey: false,
  timestamps: true,
});

export const User = model<IUser>("User", userSchema);