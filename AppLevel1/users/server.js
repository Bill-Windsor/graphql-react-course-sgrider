const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

// expressGraphQL: middleware to connect Express with GraphQL
app.use('/graphql', expressGraphQL( {
	schema,  // ES6 format, equivalent to: schema: schema, 
	graphiql: true
}));

app.listen(4000, () => {
	console.log('Listening on port: 4000');
});
