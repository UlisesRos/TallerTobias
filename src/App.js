import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ClientForm from './components/ClientForm';
import MotoForm from './components/MotoForm';
import ServicioForm from './components/ServicioForm';
import RegistroCompleto from './components/RegistroCompleto/RegistroCompleto';
import Home from './components/Home/Home';
import Calendario from './components/Calendario/Calendario';

const apiRender = 'https://tallertobiasbackend.onrender.com' || 'http://localhost:5000'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/calendario' element={<Calendario apiRender={apiRender} />} />
        <Route path='/cliente' element={<ClientForm apiRender={apiRender} />} />
        <Route path='/moto/:clienteId' element={<MotoForm apiRender={apiRender} />} />
        <Route path='/servicio/:clienteId' element={<ServicioForm apiRender={apiRender} />} />
        <Route path='/registrocompleto' element={<RegistroCompleto apiRender={apiRender} />} />
      </Routes>
    </Router>
  );
}

export default App;
