import {PutObjectCommand, PutObjectCommandInput, S3Client} from "@aws-sdk/client-s3";
import {v4} from "uuid"

const s3Client = new S3Client({
    endpoint: "https://fra1.digitaloceanspaces.com",
    region: "us-east-1", // ignored by DO
    credentials: {
        accessKeyId: process.env.SPACES_KEY ?? '',
        secretAccessKey: process.env.SPACES_SECRET ?? ''
    }
});

export async function saveFile(contents: PutObjectCommandInput["Body"], extension?: string) {

    const bucketParams: PutObjectCommandInput = {
        Bucket: process.env.SPACES_BUCKET ?? 'default',
        Key: `${process.env.SPACES_FOLDER ?? 'image-upload'}/${v4()}${extension ? `.${extension}` : ''}`,
        Body: contents,
        ACL: "public-read",
    };

    await s3Client.send(new PutObjectCommand(bucketParams));
    return `${process.env.SPACES_ROOT}/${bucketParams.Key}`;
}

