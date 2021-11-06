// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(key, defaultValue = ''){
  const getInitialValue = () => {
    const localValue = window.localStorage.getItem(key);
    if(localValue){
      return JSON.parse(localValue)
    }
    return defaultValue;
  }

  const [state, setState] = React.useState(getInitialValue);
  const prevKey = React.useRef(key);

  React.useEffect(() => {
    if(prevKey.current !== key){
      window.localStorage.removeItem(prevKey.current)
      prevKey.current = key;
    }
    window.localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorage('name', initialName);

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
