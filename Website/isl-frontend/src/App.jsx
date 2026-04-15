import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Predict from './pages/Predict.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"        element={<Landing />} />
        <Route path="/predict" element={<Predict />} />
      </Routes>
    </BrowserRouter>
  )
}