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
    snippet: string;
    body: string;
    allowHtml: boolean;
}

export type ChronicleDocument = Document & {
    chronicleType: ChronicleType,
    authorId: string;
    slug?: string,
    coverImageUrl?: string,
    publishedDate: Date;
    updatedDate?: Date;
    draftContent?: ChronicleContent;
    approvedContent?: ChronicleContent;
    reviewStatus?: ReviewStatus,
    reviewNotes?: string,
};
