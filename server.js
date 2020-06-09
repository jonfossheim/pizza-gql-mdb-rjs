const express = require('express');
const bodyParser = require('body-parser');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Pizza = require('./models/pizza');
const Order = require('./models/order');
const User = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`

        type Pizza {
            _id: ID!
            pizza_name: String!
            pizza_price: Float!
            pizza_image: String!
            stock: Int!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        type Order {
            _id: ID!
            order_name: String!
            order_status: String!
            order_instructions: String
            pizza_type: Pizza!
        }

        input OrderInput {
            order_name: String!
            order_instructions: String
        }

        input PizzaInput {
            pizza_name: String!
            pizza_price: Float!
            pizza_image: String!
            stock: Int!
        }

        type RootQuery {
            pizzas: [Pizza!]!
            orders: [Order!]!
        }

        type RootMutation {
            createPizza(pizzaInput: PizzaInput): Pizza
            createOrder(orderInput: OrderInput): Order
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      pizzas: () => {
        return Pizza.find()
          .then((pizzas) => {
            return pizzas.map((pizza) => {
              return { ...pizza._doc };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createPizza: (args) => {
        const pizza = new Pizza({
          pizza_name: args.pizzaInput.pizza_name,
          pizza_price: +args.pizzaInput.pizza_price,
          pizza_image: args.pizzaInput.pizza_image,
          stock: args.pizzaInput.stock,
        });
        return pizza
          .save()
          .then((result) => {
            console.log(result);
            return { ...result._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      orders: () => {
        return Order.find()
          .populate('pizza_type')
          .then((orders) => {
            return orders.map((order) => {
              return {
                ...order._doc,
                pizza_type: {
                  ...order._doc.pizza_type._doc,
                },
              };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createOrder: (args) => {
        const order = new Order({
          order_name: args.orderInput.order_name,
          order_status: 'queue',
          order_instructions: args.orderInput.order_instructions,
          pizza_type: '5ede3fb51b39f831e02cb2cf',
        });
        return order
          .save()
          .then((result) => {
            console.log(result);
            return { ...order._doc };
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

const PORT = 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0-cbpnz.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
