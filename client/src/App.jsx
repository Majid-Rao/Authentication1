import Register from "./auth/Register"
import {BrowserRouter,Routes,Route} from 'react-router-dom'


function App() {
  return (
  <BrowserRouter>
  <Routes>
    <Route path="/signup" element={<Register/>}></Route>
  </Routes>
  </BrowserRouter>
  )
}

export default App
