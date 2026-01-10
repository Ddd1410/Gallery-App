require("dotenv").config(); // Load .env at the top
const { BlobServiceClient } = require("@azure/storage-blob");

// Read connection string from .env
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error("AZURE_STORAGE_CONNECTION_STRING is not defined in .env");
}

// Create Blob service client
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
const containerName = "images";

// Upload a file to Azure Blob
async function uploadImage(file) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  await containerClient.createIfNotExists();

  const blobName = `${Date.now()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadData(file.buffer);

  return blockBlobClient.url;
}

// List all images in container
async function listImages() {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobs = [];
  for await (const blob of containerClient.listBlobsFlat()) {
    blobs.push({
      name: blob.name,
      url: `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blob.name}`,
      title: blob.metadata?.title || "",
      caption: blob.metadata?.caption || "",
    });
  }
  return blobs;
}

module.exports = { uploadImage, listImages };
