import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { WallDetail } from './pages/WallDetail'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/wall/:wallId" element={<WallDetail />} />
      </Routes>
    </Layout>
  )
}

export default App