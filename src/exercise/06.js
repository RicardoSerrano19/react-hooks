// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState('')

  React.useEffect(() =>{
    if(!pokemonName) return
    setPokemon(null);
    setPokemon('...loading');

    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemon(pokemonData)
      },
      error =>{
        const {message} = error;
        setError(message);
      }
    )
  }, [pokemonName]);

  if(!pokemonName) return 'Submit a pokemon'
  if(pokemonName && !pokemon) return ( <PokemonInfoFallback name={pokemonName} message={error}/> )
  if(pokemon) return ( <PokemonDataView pokemon={pokemon} /> )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
