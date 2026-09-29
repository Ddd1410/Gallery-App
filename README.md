# Cloud‑Native Photo Sharing Web Application

A scalable, cloud‑native media distribution platform built on Microsoft Azure. The application enables users to browse, search, and view photo content stored in Azure Blob Storage, with metadata persisted in Azure Cosmos DB. The solution follows modern cloud architecture principles and integrates CI/CD pipelines for automated deployment.

## Features

- View images  
- Search images  
- Metadata stored in Cosmos DB  
- Images stored in Blob Storage  
- React frontend  
- Node.js backend  
- Azure DevOps CI/CD

## Architecture Overview

**Frontend:** React  
**Backend:** Node.js + Express  
**Storage:** Blob Storage + Cosmos DB  
**CI/CD:** Azure DevOps Pipelines

## Project Structure
root/
├── backend/
│   ├── server.js
│   ├── routes/
│   ├── cosmosClient.js
│   ├── blobClient.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
└── azure-pipelines.yml

## Deployment

Azure App Service, Azure Static Web Apps, Blob Storage, Cosmos DB, DevOps Pipelines

## Search Functionality

GET /api/search?q=<query>

The backend retrieves metadata from Cosmos DB, filters by title or caption, and returns matching results as JSON. The frontend displays filtered gallery items.

## Scalability Considerations

- Blob Storage scales automatically  
- Cosmos DB provides global distribution and low‑latency reads  
- App Service supports horizontal scaling  
- CI/CD ensures reliable deployments

## Limitations

- No authentication or role‑based access implemented  
- No comment/rating system  
- Search is metadata‑based only  
- No CDN or caching layer  
- Creator UI is minimal/admin‑only

## Demonstration

A 5‑minute video shows:
- Application functionality  
- Azure deployment  
- CI/CD pipeline  
- Storage and database integration  
- End‑to‑end flow from frontend → backend → storage

## References (IEEE Style)

1. Microsoft, “App Service Documentation,” *Microsoft Learn*, 2024.  
2. Microsoft, “Azure Blob Storage Documentation,” *Microsoft Learn*, 2024.  
3. Microsoft, “Azure Cosmos DB Documentation,” *Microsoft Learn*, 2024.  
4. Microsoft, “Azure Pipelines Documentation,” *Microsoft Learn*, 2024.  
5. Meta, “React Documentation,” *React.dev*, 2024.  
6. OpenJS Foundation, “Node.js Documentation,” *Nodejs.org*, 2024.  
7. Express.js, “Express Documentation,” *Expressjs.com*, 2024.  
8. Microsoft, “Azure Architecture Center,” *Microsoft Learn*, 2024.
