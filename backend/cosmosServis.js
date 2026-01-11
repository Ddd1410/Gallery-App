// cosmosServis.js
const { CosmosClient } = require("@azure/cosmos");

// ✅ Environment variables (must match Azure App Service)
const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseName = process.env.COSMOS_DB_DATABASE;
const containerName = process.env.COSMOS_DB_CONTAINER;

// ✅ Debug logs to confirm values during deployment
console.log("Cosmos DB Endpoint:", endpoint);
console.log("Cosmos DB Database:", databaseName);
console.log("Cosmos DB Container:", containerName);

// ✅ Initialize Cosmos client
const client = new CosmosClient({ endpoint, key });
const database = client.database(databaseName);
const container = database.container(containerName);

// ✅ Add metadata (image or video)
async function addImage(data) {
  if (!data.uploadedAt) {
    data.uploadedAt = new Date().toISOString();
  }

  console.log("Saving item to Cosmos DB...");
  const { resource } = await container.items.create(data);
  return resource;
}

// ✅ List all items
async function listImages() {
  const query = "SELECT * FROM c ORDER BY c.uploadedAt DESC";
  const { resources } = await container.items.query(query).fetchAll();
  return resources;
}

// ✅ Get single item by ID
async function getImageById(id) {
  try {
    const { resource } = await container.item(id, id).read();
    return resource || null;
  } catch (err) {
    if (err.code === 404) return null;
    throw err;
  }
}

// ✅ Update item (comments, ratings, etc.)
async function updateImage(item) {
  const { resource } = await container.item(item.id, item.id).replace(item);
  return resource;
}

// ✅ Delete item by name (query first, then delete by ID)
async function deleteImage(name) {
  const query = {
    query: "SELECT * FROM c WHERE c.name = @name",
    parameters: [{ name: "@name", value: name }],
  };

  const { resources } = await container.items.query(query).fetchAll();
  if (!resources.length) return;

  const item = resources[0];
  await container.item(item.id, item.id).delete();
}

module.exports = {
  addImage,
  listImages,
  deleteImage,
  getImageById,
  updateImage,
};
