import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import AddDish from './pages/AddDish';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path='hinzufuegen' element={<AddDish />} />
      </Route>
    </Routes>
  );
}

export default App;
