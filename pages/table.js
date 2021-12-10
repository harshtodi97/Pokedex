import React from "react";

import { Table, Thead, Tbody, Tr, Th, Td, chakra, Box } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { useTable, useSortBy, useExpanded } from "react-table";

function TableComponent({ columns: userColumns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { expanded },
  } = useTable({ columns: userColumns, data }, useSortBy, useExpanded);

  return (
    <Box
      m={24}
      border="1px solid"
      borderColor="gray.100"
      borderRadius="md"
      boxSizing="border-box"
      // height={900}
      // width={700}
      p={5}
      overflow="auto"
    >
      <Table
        variant="striped"
        colorScheme="gray"
        borderColor="black"
        {...getTableProps()}
      >
        <Thead>
          {headerGroups.map((headerGroup) => (
            <Tr key={headerGroup} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th
                  key={column}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  isNumeric={column.isNumeric}
                >
                  {column.render("Header")}
                  <chakra.span pl="4">
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <ChevronDownIcon aria-label="sorted descending" />
                      ) : (
                        <ChevronUpIcon aria-label="sorted ascending" />
                      )
                    ) : null}
                  </chakra.span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr key={row} {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <Td
                    key={cell}
                    {...cell.getCellProps()}
                    isNumeric={cell.column.isNumeric}
                  >
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </Box>
  );
}

function Pokemon({ pokeDetails, pokemonNames }) {
  const columns = React.useMemo(
    () => [
      {
        // Build our expander column
        id: "expander", // Make sure it has an ID
        // Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => (
        //   <span {...getToggleAllRowsExpandedProps()}>
        //     {isAllRowsExpanded ? "👇" : "👉"}
        //   </span>
        // ),
        Header: () => null,
        // eslint-disable-next-line react/display-name
        Cell: ({ row }) =>
          // Use the row.canExpand and row.getToggleRowExpandedProps prop getter
          // to build the toggle for expanding a row
          row.canExpand ? (
            <span
              {...row.getToggleRowExpandedProps({
                style: {
                  // We can even use the row.depth property
                  // and paddingLeft to indicate the depth
                  // of the row
                  paddingLeft: `${row.depth * 2}rem`,
                },
              })}
            >
              {row.isExpanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
            </span>
          ) : null,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "ID",
        accessor: "pokeId",
        isNumeric: true,
      },
      {
        Header: "BASE EXP",
        accessor: "baseExp",
        isNumeric: true,
      },
    ],
    []
  );

  // const pokemon = pokemonNames.map((pokemon) => ({
  //   name: pokemon.name,
  //   pokeId: pokeDetails[pokemon.name].id,
  //   baseExp: pokeDetails[pokemon.name].base_experience,
  //   subRows: [
  //     {
  //       name: pokemon.name,
  //       pokeId: pokeDetails[pokemon.name].id,
  //       baseExp: pokeDetails[pokemon.name].base_experience,
  //     },
  //   ],
  // }));

  const pokemon = [
    {
      name: pokemonNames[0].name.toUpperCase(),
      pokeId: pokeDetails[pokemonNames[0].name].id,
      baseExp: pokeDetails[pokemonNames[0].name].base_experience,
      subRows: [
        {
          name: pokemonNames[1].name.toUpperCase(),
          pokeId: pokeDetails[pokemonNames[1].name].id,
          baseExp: pokeDetails[pokemonNames[1].name].base_experience,
        },
        {
          name: pokemonNames[2].name.toUpperCase(),
          pokeId: pokeDetails[pokemonNames[2].name].id,
          baseExp: pokeDetails[pokemonNames[2].name].base_experience,
        },
      ],
    },
    {
      name: pokemonNames[3].name.toUpperCase(),
      pokeId: pokeDetails[pokemonNames[3].name].id,
      baseExp: pokeDetails[pokemonNames[3].name].base_experience,
      subRows: [
        {
          name: pokemonNames[4].name.toUpperCase(),
          pokeId: pokeDetails[pokemonNames[4].name].id,
          baseExp: pokeDetails[pokemonNames[4].name].base_experience,
        },
        {
          name: pokemonNames[5].name.toUpperCase(),
          pokeId: pokeDetails[pokemonNames[5].name].id,
          baseExp: pokeDetails[pokemonNames[5].name].base_experience,
        },
      ],
    },
    {
      name: pokemonNames[6].name.toUpperCase(),
      pokeId: pokeDetails[pokemonNames[6].name].id,
      baseExp: pokeDetails[pokemonNames[6].name].base_experience,
      subRows: [
        {
          name: pokemonNames[7].name.toUpperCase(),
          pokeId: pokeDetails[pokemonNames[7].name].id,
          baseExp: pokeDetails[pokemonNames[7].name].base_experience,
        },
        {
          name: pokemonNames[8].name.toUpperCase(),
          pokeId: pokeDetails[pokemonNames[8].name].id,
          baseExp: pokeDetails[pokemonNames[8].name].base_experience,
        },
      ],
    },
  ];

  console.log(pokeDetails);

  const data = React.useMemo(() => pokemon, []);

  return <TableComponent columns={columns} data={data} />;
}

export async function getStaticProps() {
  const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10");

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
