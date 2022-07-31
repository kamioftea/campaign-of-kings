import {Document} from "mongoose";

export type ChronicleDocument = Document & {
    title: string;
    slug: string;
    published: Date;
    draft: boolean;
    snippet: string;
    body: string;
};
