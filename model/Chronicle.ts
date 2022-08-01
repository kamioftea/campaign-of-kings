import mongoose, {Schema} from "mongoose";
import {ChronicleContent, ChronicleDocument} from "./ChronicleDocument";
import {ObjectID} from "bson";

const chronicleContentSchema = new Schema<ChronicleContent>({
    title: String,
    snippet: String,
    body: String,
    allowHtml: Boolean,
});

const chronicleSchema = new Schema<ChronicleDocument>({
    chronicleType: String,
    authorId: ObjectID,
    slug: String,
    coverImageUrl: String,
    publishedDate: Date,
    updatedDate: Date,
    draftContent: chronicleContentSchema,
    approvedContent: chronicleContentSchema,
    reviewStatus: String,
    reviewNotes: String,
})

export const Chronicle = mongoose.model<ChronicleDocument>("Chronicle", chronicleSchema);

