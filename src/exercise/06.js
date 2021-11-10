// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

const request_status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}

function PokemonInfo({pokemonName}) {
  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState('')
  const [status, setStatus] = React.useState(request_status.IDLE);

  React.useEffect(() =>{
    if(!pokemonName) return
    setStatus(request_status.PENDING)

    fetchPokemon(pokemonName).then(
      pokemonData => {
        setPokemon(pokemonData)
        setStatus(request_status.RESOLVED)
      },
      error =>{
        const {message} = error;
        setError(message);
        setStatus(request_status.REJECTED)
      }
    )
  }, [pokemonName]);

  if(status === request_status.IDLE){
    return 'Submit a pokemon'
  }
  if(status === request_status.PENDING){
    return ( <PokemonInfoFallback name={pokemonName}/> )
  }
  if(status === request_status.RESOLVED){
    return ( <PokemonDataView pokemon={pokemon} /> )
  }
  if(status === request_status.REJECTED){
    return (
      <div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{error}</pre>
      </div>
    )
  }

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
