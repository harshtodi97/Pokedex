import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

import { Button, ButtonGroup } from '@chakra-ui/react'

const Pokemon = ({ data }) => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);

  const [financials, setFinancials] = useState(false)
  console.log(financials)

  // useEffect(() => {
  //   if (!router.isReady) return;

  //   const { slug } = router.query;
  //   console.log(slug);

  //   // codes using router.query
  // }, [router.isReady, router.query]);

  return (
    <div>

      <Button onClick={() => setFinancials(!financials)} colorScheme='blue'>Button</Button>
        {
           financials ? (
          <div>
            <h1>Bye</h1>
            </div>
        ) : (
            <div>
              <h1>
                Hello
              </h1>
            </div>
        )}
  
    </div>
)

};

export async function getStaticPaths() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
  const data = await res.json();
  const pokemonData = data.results;
  const paths = pokemonData.map((pokemon) => ({
    params: { id: pokemon.name },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  const data = await res.json();

  return { props: { data } };
}

export default Pokemon;
