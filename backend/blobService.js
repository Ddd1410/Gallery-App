require("dotenv").config();
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
async function uploadFile(file) {
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const fileName = `${Date.now()}-${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(fileName);

  await blockBlobClient.uploadData(file.buffer, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  });

  return blockBlobClient.url;
}

// Delete a blob by name
async function deleteImage(blobName) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlockBlobClient(blobName);
  await blobClient.deleteIfExists();
}

module.exports = { uploadFile, deleteImage };
