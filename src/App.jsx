import { Routes, Route, Navigate } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Tasks from './pages/Tasks'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App