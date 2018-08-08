const graphql = require('graphql');
const axios = require('axios');

// destructures properties from the graphql library:
const { 
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = graphql;

// 'GraphQLNonNull' helper function states that the parameter is required (a minor 
//  validation function); also links to GraphQL Documentation in GraphiQL front-end to show 
//  user that this field is required
// 'GraphQLSchema' helper function from the GraphQL library takes in a rootQuery
//  and returns a GraphQL Schema instance (see below)

const CompanyType = new GraphQLObjectType( {
	name: 'Company',
	fields: () => ({  
		id: { type: GraphQLString },
		name: { type: GraphQLString },
		description: { type: GraphQLString },
		users: {
			type: new GraphQLList(UserType),
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
					.then(res => res.data)
			}
		}
	})
});

const UserType = new GraphQLObjectType( {
	name: 'User',
	fields: () => ({
		id: { type: GraphQLString },
		firstName: { type: GraphQLString },
		age: { type: GraphQLInt },
		company: {
			type: CompanyType,
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
					.then(res => res.data);
				console.log(parentValue, args);
			}
		}
	})
});

const RootQuery = new GraphQLObjectType( {
	name: 'RootQueryType',
	fields: {
		user: {
			type: UserType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/users/${args.id}`)
					.then(resp => resp.data);
		} },
		company: {
			type: CompanyType,
			args: { id: { type: GraphQLString } },
			resolve(parentValue, args) {
				return axios.get(`http://localhost:3000/companies/${args.id}`)
				// ^ uses template string for string interpolation: ` ... ${args.id}`
					.then(resp => resp.data);
		} }
	}
});

const mutation = new GraphQLObjectType( {
	name: 'Mutation',
	fields: {
		addUser: {
			type: UserType,  // type of data that we are returning from the mutation
			args: { 
				firstName: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				companyId: { type: GraphQLString }
			},
			resolve(parentValue, { firstName, age }) {
				return axios.post(`http://localhost:3000/users`, { firstName, age })
					.then(res => res.data);
			}
		},

		deleteUser: {
			type: UserType,
			args: { 
				id: { type: new GraphQLNonNull(GraphQLString) }
			},
			resolve(parentValue, { id }) {
				return axios.delete(`http://localhost:3000/users/${id}`)
					.then(res => res.data);
			}
		},

		editUser: {
			type: UserType,
			args: { 
				id: { type: new GraphQLNonNull(GraphQLString) },
				firstName: { type: GraphQLString },
				age: { type: GraphQLInt },
				companyId: { type: GraphQLString }
			},
	// Note the optional fields ^ (that are not essential) will optionally be added to the
	// 'args' object that is generated in 'Resolve' function and passed to GraphQL
			resolve(parentValue, args) {
				return axios.patch(`http://localhost:3000/users/${args.id}`, args)
					.then(res => res.data);
			}
		}
	}
});
module.exports = new GraphQLSchema( {
	mutation,   // ES6 condensation from mutation: mutation
	query: RootQuery
});
