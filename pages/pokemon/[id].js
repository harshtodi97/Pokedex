import Link from "next/link";

const Pokemon = ({ data }) => {
  // Render post...
  return (
    <div>
      <button>
        <Link href="/" passHref>
          <a>Back to Pokedex</a>
        </Link>
      </button>
      <div>{"Name: " + data.name.toUpperCase()}</div>
      <div>{"ID: " + data.id}</div>
      <div>{"Base Experience: " + data.base_experience}</div>
      <div>{"Height: " + data.height}</div>
      <div>{"Weight: " + data.weight}</div>
    </div>
  );
};

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await res.json();
  const pokemonData = data.results;
  // Get the paths we want to pre-render based on posts
  const paths = pokemonData.map((pokemon) => ({
    params: { id: pokemon.name },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  const data = await res.json();

  // Pass post data to the page via props
  return { props: { data } };
}

export default Pokemon;
