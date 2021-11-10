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
  const [error, setError] = React.useState('')
  const [status, setStatus] = React.useState({status: request_status.IDLE, pokemon: null});

  React.useEffect(() =>{
    if(!pokemonName) return

    const updatedStatus = {status: request_status.PENDING};
    setStatus(prev => ({...prev, ...updatedStatus}))

    fetchPokemon(pokemonName).then(
      pokemonData => {
        const updatedStatus = {status: request_status.RESOLVED, pokemon: pokemonData};
        setStatus({...updatedStatus})
      },
      error =>{
        const {message} = error;
        const updatedStatus = {status: request_status.REJECTED, pokemon: null};
        setStatus({...updatedStatus})
        setError(message);
      }
    )
  }, [pokemonName]);

  if(status.status === request_status.IDLE){
    return 'Submit a pokemon'
  }
  if(status.status === request_status.PENDING){
    return ( <PokemonInfoFallback name={pokemonName}/> )
  }
  if(status.status === request_status.RESOLVED){
    return ( <PokemonDataView pokemon={status.pokemon} /> )
  }
  if(status.status === request_status.REJECTED){
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
