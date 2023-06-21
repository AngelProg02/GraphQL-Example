import { gql } from "@apollo/client";

const FIND_PERSON = gql`
query findPersonByName($nameToSearch: String!){
    findPerson(name: $nameToSearch) {
      id
    address {
      street
      city
    }
    }`;

export const Persons = ({ persons }) => {
  if (persons === null) return null;
  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.id}>
          {p.name} {p.phone}
        </div>
      ))}
    </div>
  );
};
