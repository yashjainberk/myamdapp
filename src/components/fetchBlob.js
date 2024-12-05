const { BlobServiceClient } = require("@azure/storage-blob");

const blobSasUrl = "https://amdupsynctest.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2026-08-08T06:58:12Z&st=2024-10-24T22:58:12Z&spr=https,http&sig=BeMYOypmexAYhYWexJYTSCjD1yf9Dw9y7KqKX1rROfI%3D";

async function fetchJsonFile(containerName, blobName) {
    try {
        const blobServiceClient = new BlobServiceClient(blobSasUrl);
        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blobClient = containerClient.getBlobClient(blobName);

        const downloadBlockBlobResponse = await blobClient.download();
        const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);

        console.log("File content:", downloaded);
    } catch (error) {
        console.error("Error fetching JSON file:", error.message);
    }
}

async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => chunks.push(data.toString()));
        readableStream.on("end", () => resolve(chunks.join("")));
        readableStream.on("error", reject);
    });
}

const containerName = "folders"; // Update with your container name
const blobName = "broker-investigations/3213211/3213211.json"; // Replace with your blob name
fetchJsonFile(containerName, blobName);
