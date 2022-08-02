import {Document, Types} from "mongoose";

export enum ReviewStatus {
    PENDING = "Pending",
    ACCEPTED = "Accepted",
    REJECTED = "Rejected",
}

export enum ChronicleType {
    NARRATIVE,
    BLOG,
    MILESTONE
}

export type ChronicleContent = {
    title: string;
    snippet: string;
    body: string;
    allowHtml: boolean;
}

export type ChronicleDocument = Document & {
    chronicleType: ChronicleType,
    author: Types.ObjectId;
    slug?: string,
    coverImageUrl?: string,
    publishedDate: Date;
    updatedDate?: Date;
    draftContent?: ChronicleContent;
    approvedContent?: ChronicleContent;
    reviewStatus?: ReviewStatus,
    reviewNotes?: string,
};

export type ChronicleResponse = {
    _id?: string,
    chronicleType: ChronicleType,
    authorName?: string,
    slug?: string,
    coverImageUrl?: string,
    publishedDate: Date;
    updatedDate?: Date;
    draftContent?: ChronicleContent;
    approvedContent?: ChronicleContent;
    reviewStatus?: ReviewStatus,
    reviewNotes?: string,
}
