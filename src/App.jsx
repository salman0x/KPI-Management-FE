import { Routes, Route, Navigate } from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Tasks from './pages/Tasks'
import Employees from './pages/Employees'
import Calendar from './pages/Calendar'
import KpiTracking from './pages/KpiTracking'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/kpi" element={<KpiTracking />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App