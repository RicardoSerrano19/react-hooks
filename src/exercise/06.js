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
  const [state, setState] = React.useState({status: request_status.IDLE, pokemon: null});

  React.useEffect(() =>{
    if(!pokemonName) return

    const updateState = {status: request_status.PENDING};
    setState(prev => ({...prev, ...updateState}))

    fetchPokemon(pokemonName).then(
      pokemonData => {
        const updateState = {status: request_status.RESOLVED, pokemon: pokemonData};
        setState({...updateState})
      },
      error =>{
        const {message} = error;
        const updateState = {status: request_status.REJECTED, pokemon: null};
        setState({...updateState})
        setError(message);
      }
    )
  }, [pokemonName]);

  if(state.status === request_status.IDLE){
    return 'Submit a pokemon'
  }
  if(state.status === request_status.PENDING){
    return ( <PokemonInfoFallback name={pokemonName}/> )
  }
  if(state.status === request_status.RESOLVED){
    return ( <PokemonDataView pokemon={state.pokemon} /> )
  }
  if(state.status === request_status.REJECTED){
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
