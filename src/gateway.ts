import { ApolloGateway } from '@apollo/gateway';
import { ApolloServer, gql } from 'apollo-server-express';
import express from 'express';


const gateway = new ApolloGateway({
  serviceList: [
    { name: "spacex", url: "http://localhost:4001/graphql" }
  ]
});

//const { schema, executor } = await gateway.load();

// Create ApolloServer with the loaded schema and executor
const server = new ApolloServer({
  gateway
});

async function startApolloGateway() {
  await server.start();

  const app = express();
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen({ port: PORT }, () =>
    console.log(`Apollo Gateway ready at http://localhost:${PORT}${server.graphqlPath}`)
  );
}

startApolloGateway().catch((err) => console.error('Error starting Apollo Gateway:', err));