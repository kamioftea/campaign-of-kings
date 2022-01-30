export async function uploadFile(file: Blob): Promise<{url: string}> {
    const body = new FormData();
    body.append('file', file)

    return await fetch('/api/image', {
        method: 'POST',
        body,
    }).then(res => {
        if (res.status === 201) {
            return res.json();
        }

        throw new Error("Failed to upload image")
    });
}
