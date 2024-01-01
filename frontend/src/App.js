import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './Components/Home';
import AddCourse from './Components/AddCourse';
import CourseContent from './Components/CousreContent';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Home/>
        <Routes>
          {/* <Route path="/" element={<Home/>}/> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
