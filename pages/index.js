import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Pokemon({ pokeDetails, pokemonNames }) {
  const [q, setQ] = useState("");
  const [searchParam] = useState(["name"]);
  const [filterParam, setFilterParam] = useState("all");

  const search = (items) => {
    return items.filter((item) => {
      if (
        pokeDetails[item.name].types
          .map((list) => list.type.name.toLowerCase())
          .includes(filterParam)
      ) {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
      } else if (filterParam == "all") {
        return searchParam.some((newItem) => {
          return (
            item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
          );
        });
      }
    });
  };

  return (
    <div>
      <div className="search-bar">
        <label htmlFor="search-form">
          <span className="sr-only">Search Pokemon here </span>
          <input
            type="search"
            name="search-form"
            id="search-form"
            // className="search-input"
            placeholder="Search Pokemon..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </div>
      <div className="type-filter">
        <select
          onChange={(e) => {
            setFilterParam(e.target.value.toLowerCase());
          }}
          className="custom-select"
          aria-label="Filter Pokemon By Type"
        >
          <option value="All">Filter By Type</option>
          <option value="Electric">Electric</option>
          <option value="Fire">Fire</option>
          <option value="Flying">Flying</option>
          <option value="Ghost">Ghost</option>
          <option value="Grass">Grass</option>
          <option value="Ground">Ground</option>
          <option value="Ice">Ice</option>
          <option value="Poison">Poison</option>
          <option value="Rock">Rock</option>
          <option value="Steel">Steel</option>
          <option value="Normal">Normal</option>
          <option value="Fairy">Fairy</option>
          <option value="Fighting">Fighting</option>
          <option value="Dragon">Dragon</option>
          <option value="Bug">Bug</option>
          <option value="Psychic">Psychic</option>
          <option value="Water">Water</option>
        </select>
      </div>
      <div className="container">
        {search(pokemonNames).map((pokemon) => {
          let spriteUrl = Object.values(pokeDetails[pokemon.name].sprites)[4];

          return (
            <div key={pokemon.name} className="card">
              <Link href={`/pokemon/${pokemon.name}`} passHref>
                <a>
                  <div className="pokemon-photo-container">
                    <Image
                      className="pokemon-photo"
                      src={spriteUrl}
                      alt="Pokemon image"
                      width={100}
                      height={100}
                      // layout="fill"
                    />
                  </div>
                  <div className="pokemon-info">
                    <div className="pokemon-name">
                      {pokemon.name.toUpperCase()}
                    </div>
                    <div className="pokemon-name">
                      Type:{" "}
                      {pokeDetails[pokemon.name].types.map(
                        (list) => list.type.name.toUpperCase() + " "
                      )}
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export async function getStaticProps() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");

  const pokemon = await res.json();
  let pokemonNames = pokemon.results;
  let pokeDetails = {};

  await Promise.all(
    pokemon.results.map(async (poke) => {
      const res1 = await fetch(poke.url);
      const details = await res1.json();
      pokeDetails[poke.name] = details;
    })
  );

  return {
    props: {
      pokeDetails,
      pokemonNames,
    },
  };
}

export default Pokemon;
