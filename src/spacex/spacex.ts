import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { typeDefs } from "./schema";
import { SpaceXAPI } from './api-service';
import { SpaceXResolvers } from "./api-resolver";

dotenv.config();

const server = new ApolloServer({
  schema: buildSubgraphSchema({
    typeDefs,
    resolvers: SpaceXResolvers,
  }),
  dataSources: () => ({
    SpaceXAPI:  new SpaceXAPI(),
  }),
});

async function startApolloServer() {
  await server.start();

  const app = express();
  // Enable CORS for requests from the Apollo Gateway
  app.use(cors());
  server.applyMiddleware({ app });

  const PORT = 4001;
  app.listen({ port: PORT }, () =>
    console.log(`Apollo Server ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
}

startApolloServer().catch((err) => console.error('Error starting Apollo server:', err));