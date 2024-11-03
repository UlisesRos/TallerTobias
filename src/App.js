import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ClientForm from './components/ClientForm';
import MotoForm from './components/MotoForm';
import ServicioForm from './components/ServicioForm';
import RegistroCompleto from './components/RegistroCompleto/RegistroCompleto';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/cliente' element={<ClientForm />} />
        <Route path='/moto/:clienteId' element={<MotoForm />} />
        <Route path='/servicio/:clienteId' element={<ServicioForm />} />
        <Route path='/registrocompleto' element={<RegistroCompleto />} />
      </Routes>
    </Router>
  );
}

export default App;
