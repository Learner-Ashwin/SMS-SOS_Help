import { useState } from 'react'
import app from './firebase/config.js'
function App() {
  const [count, setCount] = useState(0)
  console.log(app);

  return (
    <div>
      <h1>Aashriya Project</h1>
    </div>
  )
}

export default App
