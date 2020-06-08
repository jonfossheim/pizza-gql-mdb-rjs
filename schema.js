const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLList,
  GraphQLSchema,
} = require('graphql');

//PizzaType
const PizzaType = new GraphQLObjectType({
  name: 'pizza',
  fields: () => ({
    _id: { type: GraphQLInt },
    pizza_name: { type: GraphQLString },
    pizza_price: { type: GraphQLInt },
  }),
});

//OrderType
const OrderType = new GraphQLObjectType({
  name: 'order',
  fields: () => ({
    _id: { type: GraphQLString },
    order_name: { type: GraphQLString },
    order_status: { type: GraphQLString },
    pizza: { type: PizzaType },
  }),
});

//RootQuery
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: () => ({
    pizzas: {
      type: new GraphQLList(PizzaType),
      resolve(parent, args) {
        return [PizzaType];
      },
    },
    pizza: {
      type: PizzaType,
      args: {
        pizza_id: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return { PizzaType };
      },
    },
    orders: {
      type: new GraphQLList(OrderType),
      resolve(parent, args) {
        return [
          {
            _id: 1,
            order_name: 'Jon Fossheim',
            order_status: 'queue',
            pizza: { _id: 1, pizza_name: 'grandiosa', pizza_price: 70 },
          },
          {
            _id: 2,
            order_name: 'Børge Fossheim',
            order_status: 'oven',
            pizza: { _id: 1, pizza_name: 'grandiosa', pizza_price: 70 },
          },
        ];
      },
    },
    order: {
      type: OrderType,
      args: {
        order_id: { type: GraphQLInt },
      },
      resolve(parent, args) {
        return {
          _id: 1,
          order_name: 'Jon Fossheim',
          order_status: 'queue',
          pizza: { _id: 1, pizza_name: 'grandiosa', pizza_price: 70 },
        };
      },
    },
  }),
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
