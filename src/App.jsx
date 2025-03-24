import { BrowserRouter, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage"
import Schedule from "./pages/Schedule"

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/schedule" element={<Schedule/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
