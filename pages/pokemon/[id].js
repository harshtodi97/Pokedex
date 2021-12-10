import Link from "next/link";
import Image from "next/image";

const Pokemon = ({ data }) => {
  return (
    <div>
      <button>
        <Link href="/" passHref>
          <a>Back to Pokedex</a>
        </Link>
      </button>
      <div className="grid-container">
        <div className="item1">
          <div className="pokemon-image">
            <Image
              className="pokemon-photo"
              src={data.sprites["front_default"]}
              alt="Pokemon image"
              layout="fill"
            />
          </div>
          <div className="pokemon-details">
            <div>
              <b>{data.name.toUpperCase()}</b>
            </div>
            <div>{"ID: " + data.id}</div>
            <div>{"Base Experience: " + data.base_experience}</div>
          </div>
        </div>
        <div className="item2">
          <div>Abilities</div>
          <ul>
            {data.abilities.map((ability) => (
              <li key={ability.ability.name}>{ability.ability.name}</li>
            ))}
          </ul>
        </div>
        <div className="item3">
          <div>Moves</div>
          <ul>
            {data.moves.map((move) => (
              <li key={move.move.name}>{move.move.name}</li>
            ))}
          </ul>
        </div>
        <div className="item4">
          <div>Type</div>
          <ul>
            {data.types.map((type) => (
              <li key={type.type.name}>{type.type.name}</li>
            ))}
          </ul>
        </div>
        <div className="item5">
          <div>Base Stats</div>
          <ul>
            {data.stats.map((stat) => (
              <li key={stat.stat.name}>
                {stat.stat.name}: {stat.base_stat}
              </li>
            ))}
          </ul>
        </div>
        <div className="item6">
          <div>Details</div>
          <ul>
            <li>{"Height: " + data.height}</li>
            <li>{"Weight: " + data.weight}</li>
          </ul>
        </div>
        <div className="item7">
          <div>Held Items</div>
          <ul>
            {data.held_items.length === 0 ? (
              <li>None</li>
            ) : (
              data.held_items.map((item) => (
                <li key={item.item.name}>{item.item.name}</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export async function getStaticPaths() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");
  const data = await res.json();
  const pokemonData = data.results;
  const paths = pokemonData.map((pokemon) => ({
    params: { id: pokemon.name },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
  const data = await res.json();

  return { props: { data }, revalidate: 30 };
}

export default Pokemon;
