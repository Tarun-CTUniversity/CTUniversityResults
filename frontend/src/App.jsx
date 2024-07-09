import { useState } from 'react';
import './App.css';
import FrontPage from './components/FrontPage';
import ResultPage from './components/ResultPage';


function App() {
  const [frontPage,setFrontPage] = useState(true);
  const [roll , setRoll] = useState('');
  return (
    <div>
      {frontPage && <FrontPage setFrontPage={setFrontPage} setRoll={setRoll}/>}
      {!frontPage && <ResultPage setFrontPage = {setFrontPage} setRoll={setRoll} roll = {roll}/>}
    </div>
  );
}

export default App;