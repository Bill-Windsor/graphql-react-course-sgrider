const graphql = require('graphql');
const _ = require('lodash');
// lodash is a helper library that helps us walk through collections of data, and work through collections of data. Here we use lodash to find a user with a particular 'id'.

// destructuring properties from the graphql library:
const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema   
} = graphql;
// 'GraphQL Schema' ^  : helper function from the GraphQL library that takes in a rootQuery
//  and returns a GraphQL Schema instance (see below)

const users = [
	{ id: '23', firstName: 'Bill', age: 20 },
	{ id: '47', firstName: 'Samantha', age: 21 }
];

const UserType = new GraphQLObjectType( {
	name: 'User',
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt }
	}
});

// RootQuery points us to a particular record in our Graph, from all records that we have
const RootQuery = new GraphQLObjectType( {
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
// 'resolve' (below) returns the data from our data store
// 'args' parameter below is an object that gets called with whatever arguments were passed into the original query; for example here, if our object expects the 'id' argument to locate the user, then 'id' will be present on the 'args' object
			resolve(parentValue, args) {
				return _.find(users, { id: args.id }); 
				// lodash syntax: above ^ retrieves the record with the value of 'args.id'
				// [At this point, Stephen says: "Yeah, this is all heavy-duty stuff." :-)  ]
			}
		}
	}
});

module.exports = new GraphQLSchema( {
	query: RootQuery
});
