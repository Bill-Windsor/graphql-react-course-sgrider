const graphql = require('graphql');
const axios = require('axios');

// destructures properties from the graphql library:
const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema   
} = graphql;
// 'GraphQLSchema': helper function from the GraphQL library that takes in a rootQuery
//  and returns a GraphQL Schema instance (see below)

const CompanyType = new GraphQLObjectType( {
	name: 'Company',
	fields: {
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString }
	}
});

const UserType = new GraphQLObjectType( {
	name: 'User',
	fields: {
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
// Now: associate the Company with the user
// *Note: we treat associations between Types ('CompanyType' and 'UserType') exactly as though it were another field. 
// This traverses the graph among associations. The 'resolve' function indicates to GraphQL how to associate 
// a Company with a given User.
		company: {
			type: CompanyType,
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(res => res.data);
				console.log(parentValue, args);
			}
		}
	}
});

const RootQuery = new GraphQLObjectType( {
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },

// 'resolve' (below) returns the data from our data store
// 'args' object below includes arguments passed into the original query; e.g., if our object expects 'id' argument 
// to locate user, then 'id' will be present on the 'args' object
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`)
					.then(resp => resp.data);
//  ^ the 'resp.data' is a fix from axios  graphql, to return only the data from axios
// or:  .then(response => console.log(response)) 
//  axios returns:  { data: { firstName: 'bill'} }  
//  ^ axios nests the response data value on the '.data' property

			} 
		} 
	}
});

module.exports = new GraphQLSchema( {
	query: RootQuery
});
