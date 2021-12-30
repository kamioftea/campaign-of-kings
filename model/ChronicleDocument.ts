import {Document} from "mongoose";

export type ChronicleDocument = Document & {
    title: string;
    slug: string;
    snippet: string;
    body: string;
};
