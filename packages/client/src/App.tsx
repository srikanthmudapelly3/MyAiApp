import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/help')
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error('Error fetching data:', error))
  }, [])

  return (
    <div className="App p-100">
      <h1 className="font-bold text-lg">{message}</h1>

      <Button type="button">
        CLICK ME1
      </Button>
    </div>
  )
}

export default App