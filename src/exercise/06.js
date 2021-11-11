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
  const [state, setState] = React.useState({status: request_status.IDLE, pokemon: null, error: ''});
  console.log(state)
  React.useEffect(() =>{
    if(!pokemonName) return

    const updateState = {status: request_status.PENDING};
    setState(prev => ({...prev, ...updateState}))

    fetchPokemon(pokemonName).then(
      pokemonData => {
        const updateState = {status: request_status.RESOLVED, pokemon: pokemonData, error: ''};
        setState({...updateState})
      },
      error =>{
        const {message} = error;
        const updateState = {status: request_status.REJECTED, pokemon: null, error: message};
        setState({...updateState})
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
       throw state.error;
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
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = {hasError: false, error: null}
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error: error };  
  }

  render() {
    if (this.state.hasError) {   
      return <this.props.FallbackComponent error={this.state.error} />
    }
    return this.props.children; 
  }
}

function ErrorFallback({error}){
  return(
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error}.</pre>
    </div>
  )    
}
export default App
