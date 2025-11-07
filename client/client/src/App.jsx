import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import SubmitPaper from './pages/SubmitPaper';
import CreateConference from "./pages/CreateConference"

export default function App(){
  return (
    <BrowserRouter>
      <Nav/>
      <div style={{padding:12}}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/submit" element={<SubmitPaper/>}/>
          <Route path="/create-conference" element={<CreateConference/>}/>

        </Routes>
      </div>
    </BrowserRouter>
  );
}
