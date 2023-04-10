import './App.css';
import Header from './components/Header';
import ObituaryList from './components/ObituaryList';
import ObituaryCreator from './components/ObituaryCreator';
import { useState, useEffect } from 'react';

function App() {
  const [showCreator, setShowCreator] = useState(false);
  const [obituaries, setObituaries] = useState(localStorage.obituaries ? JSON.parse(localStorage.obituaries) : []);

  useEffect(() => {
    localStorage.setItem("obituaries", JSON.stringify(obituaries));
  }, [obituaries]);


  const onAddObituary = (name) => {
    const newObituary = {
      name: name,
      date: "01/01/1900 - 01/01/2000",
      body: "Minion was known for his kind heart and adventurous spirit. He was always willing to lend a helping hand to anyone in need, and his infectious smile could light up a room. From his early days, Minion was drawn to exploration and discovery, and he dedicated his life to pushing the boundaries of what was possible. Minion's legacy will live on through the countless people whose lives he touched. Whether he was sharing stories of his travels or inspiring others to follow their dreams, Minion was a beacon of hope and inspiration to all who knew him.",
    };
    setObituaries([...obituaries, newObituary]);
  };

  const changeVisibilityCreator = () => {
    setShowCreator((prevState) => !prevState);
  };

  return (
    <div className="app-container">
      <Header changeVisibilityCreator={changeVisibilityCreator}/>
      <ObituaryList obituaries={obituaries}/>
      {showCreator && <ObituaryCreator changeVisibilityCreator={changeVisibilityCreator} onAddObituary={onAddObituary}/>}
    </div>
  );
}

export default App;
