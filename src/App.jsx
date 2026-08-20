import { Routes, Route } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Sidebar from './layouts/Sidebar'
import Header from './layouts/Header'
import PageHeader from './layouts/PageHeader'
import Login from './pages/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/" element={<Sidebar />} />
      <Route path="/" element={<Header />} />
      <Route path="/" element={<PageHeader />} />
    </Routes>
  )
}

export default App