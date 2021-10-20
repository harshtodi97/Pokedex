import React, { useState, useEffect } from "react";

const SearchBar = () => {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const [q, setQ] = useState("");

  const [searchParam] = useState(["name"]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1118")
      .then((res) => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result.results);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  const search = (items) => {
    return items.filter((item) => {
      return searchParam.some((newItem) => {
        return (
          item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
        );
      });
    });
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div>
        <div>
          <label htmlFor="search-form">
            <input
              type="search"
              name="search-form"
              id="search-form"
              // className="search-input"
              placeholder="Search Pokemon..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <span className="sr-only">Search Pokemon here</span>
          </label>
        </div>
        <ul>
          {search(items).map((item) => (
            <li key={item.name}>{item.name}</li>
          ))}
        </ul>
      </div>
    );
  }
};

export default SearchBar;
