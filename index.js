import { ApolloServer, UserInputError, gql } from "apollo-server";
import { v1 as uuid } from "uuid";
import axios from "axios";

const persons = [
  {
    name: "Ángel",
    phone: "611454192",
    street: "Muñoz Seca",
    city: "Los Palacios",
    id: "1",
  },
  {
    name: "John",
    phone: "987654321",
    street: "Elm Street",
    city: "Birmingham",
    id: "2",
  },
  {
    name: "Luisa",
    street: "Rua das Flores",
    city: "Portugal",
    id: "3",
  },
];

//Definición de datos que vamos a enviar
//le añadimos los campos address y check aunque no estén de antes
const typeDefinitions = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    check: String!
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person

    editNumber(name: String!, phone: String!): Person
  }
`;

//Resolvers, de donde los sacamos
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      /*  Hacemos una conexión con axios y el json-server
      en el cual nos devuelve como una constante data que
      son las personas ASÍNCRONO */
      const { data: personsFromRestApi } = await axios.get(
        " http://localhost:3000/persons"
      );
      if (!args.phone) return personsFromRestApi;
      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;
      persons;
      return personsFromRestApi.filter(byPhone);
    },
    findPerson: (root, args) => {
      const { name } = args;
      //Retornará la persona donde la person.name sea igual al name del argumento
      // que le pasamos
      return persons.find((person) => person.name === name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      //MUTATE VALIDATION
      //Hacemos una comprobación de que si está dentro del array que tenemos a quién queremos añadir
      if (persons.find((p) => p.name === args.name)) {
        /*Si está, lanzamos un error de "UserInputError"
        es decir, el error ha sido del usuario y le decimos el mensaje
        e incluso le podemos pasar un segundo parámetro donde le decímos donde
        está el error */
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      }
      // const {name, phone, street, city } = args -- Esto es lo que tenemos con el  ...
      const person = { ...args, id: uuid() };
      persons.push(person); //Actualizar la BBDD con la nueva persona
      return person;
    },
    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => (p.name = args.name));
      if (personIndex === -1) return null;

      //Recogemos de las personas la que tiene el índice que nos ha entrado
      const person = persons[personIndex];
      const updatedPerson = { ...person, phone: args.phone };
      persons[personIndex] = updatedPerson;
      return updatedPerson;
    },
  },
  //El root es lo que ya ha matcheado antes, podemos crear "nuevos objetos"
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs: typeDefinitions,
  resolvers,
});

//Servidor escuchando en (promesa) entonces devuelve la url
server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
