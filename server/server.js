const express = require('express');
// import ApoloServer 
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 4000;
// create a new ApolloServer and pass in our schema
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema.
const startApolloServer = async (tyeDefs, resolvers) => {
  await server.start();
  // integrate the Apollo server with our express app
  server.applyMiddleware({ app });

  db.once('open', () => {
      app.listen(PORT, () => {
          console.log(`Server is running on port ${PORT}`);
          // log where we can go test out GQL API
          console.log(`Go to http://localhost:${PORT}${server.graphqlPath} to run queries!`);
      });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);