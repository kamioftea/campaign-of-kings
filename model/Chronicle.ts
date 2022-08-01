import mongoose, {Schema} from "mongoose";
import {ChronicleContent, ChronicleDocument} from "./ChronicleDocument";
import {ObjectID} from "bson";

const chronicleContentSchema = new Schema<ChronicleContent>({
    title: String,
    slug: String,
    snippet: String,
    body: String,
    allowHtml: Boolean,
});

const chronicleSchema = new Schema<ChronicleDocument>({
    chronicleType: String,
    coverImageUrl: String,
    authorId: ObjectID,
    publishedDate: Date,
    updatedDate: Date,
    draftContent: chronicleContentSchema,
    approvedContent: chronicleContentSchema,
    reviewStatus: String,
    reviewNotes: String,
})

export const Chronicle = mongoose.model<ChronicleDocument>("Chronicle", chronicleSchema);

