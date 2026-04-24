import { useState , useEffect } from 'react';
import axios from "axios";

function App(){
  const[jokes, serjokes] = useState([]);
  useEffect(() => {
    
  })
  return(
    <>
      <h1>Jokes app</h1>
      <p>how many jokes are there: {jokes.length}</p>
      {
        jokes.map((joke, index) => {
          <div key={joke.id}>
            <h2>
              {joke.title}
            </h2>
            <p>
              {joke.content}
            </p>
          </div>
        })
      }
    </>
  )
}

export default App;