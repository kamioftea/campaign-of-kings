import {Document} from "mongoose";

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
    slug: string;
    snippet: string;
    body: string;
    allowHtml: boolean;
}

export type ChronicleDocument = Document & {
    chronicleType: ChronicleType,
    coverImageUrl?: string,
    authorId?: string;
    publishedDate?: Date;
    updatedDate?: Date;
    draftContent?: ChronicleContent;
    approvedContent?: ChronicleContent;
    reviewStatus?: ReviewStatus,
    reviewNotes?: string,
};
