import mongoose, {Schema} from "mongoose";
import {ChronicleDocument} from "./ChronicleDocument";

const chronicleSchema = new Schema<ChronicleDocument>({
    title: String,
    slug: String,
    snippet: String,
    body: [String],
});

export const Chronicle = mongoose.model<ChronicleDocument>("Chronicle", chronicleSchema);

