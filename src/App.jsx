import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import AddEmployee from './pages/RegisterEmployee/EmployeeForm'
import EmployeeForm from './pages/RegisterEmployee/EmployeeForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <EmployeeForm/>
    </div>
  )
}

export default App
