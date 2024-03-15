import { Types, Schema, model } from "mongoose";

export interface ILink {
  _id: Types.ObjectId;
  alias: string;
  url: string;
  clicks: number;
  id: string;
  updatedAt: Date;
  createdAt: Date;
  lastViewed: Date | null;
}

const linkSchema = new Schema<ILink>({
  alias: { type: String, required: true },
  url: { type: String, required: true },
  id: { type: String, required: true, key: true },
  clicks: { type: Number, default: 0 },
  lastViewed: { type: Date, default: null },
}, {
  versionKey: false,
  timestamps: true,
});

export const Link = model<ILink>("Link", linkSchema);