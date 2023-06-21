import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import "./App.css";
import { Persons } from "./Persons";

const ALL_PERSONS = gql`
  query {
    allPersons {
      id
      name
      phone
      address {
        street
        city
      }
    }
  }
`;

function App() {
  const { data, error, loading } = useQuery(ALL_PERSONS);

  if (error) return <span style="color: red"> {error} </span>;
  return (
    <>
      <div className="App">
        <header className="App"></header>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Persons persons={data?.allPersons} />
          </>
        )}
      </div>
    </>
  );
}

export default App;

/*
  
  FORMA DE HACER A MANO EL FETCH
  
   useEffect(() => {
   
    fetch("http://localhost:4000/", {
      //GraphQL siempre debe de ser POST
      method: "POST",
      //El contenido que le pasaremos será un json
      headers: { "Content-Type": "application/json" },
      //La query
      body: JSON.stringify({
        query: `
        query {
          allPersons {
            name
          }
        }
        `,
      }),
    })
      //Nos devuelve una promesa que convertimos en json y luego lo que debe de hacer
      .then((res) => res.json())
      .then((res) => {
        console.log(res.data);
      });
  });
  */
