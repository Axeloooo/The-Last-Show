import './App.css';
import Header from './components/Header';
import ObituaryList from './components/ObituaryList';
import ObituaryCreator from './components/ObituaryCreator';
import { useState, useEffect } from 'react';

function App() {
  const [showCreator, setShowCreator] = useState(false);
  const [obituaries, setObituaries] = useState([]);

  useEffect(() => {
    localStorage.setItem("obituaries", JSON.stringify(obituaries));
  }, [obituaries]);


  const onAddObituary = (name, birthDate, deathDate) => {
    const newObituary = {
      name: name,
      birthDate: birthDate,
      deathDate: deathDate,
      body: "Minion was known for his kind heart and adventurous spirit. He was always willing to lend a helping hand to anyone in need, and his infectious smile could light up a room. From his early days, Minion was drawn to exploration and discovery, and he dedicated his life to pushing the boundaries of what was possible. Minion's legacy will live on through the countless people whose lives he touched. Whether he was sharing stories of his travels or inspiring others to follow their dreams, Minion was a beacon of hope and inspiration to all who knew him.",
      open: true,
    };
    setObituaries([...obituaries, newObituary]);
  };

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatDate = (when) => {
    const formatted = new Date(when).toLocaleString("en-US", options);
    if (formatted === "Invalid Date") {
      return "";
    }
    return formatted;
  };

  const changeVisibilityCreator = () => {
    setShowCreator((prevState) => !prevState);
  };

  const onUpdateObituary = async (updatedObituary) => {
    const updatedObituaryArray = obituaries.map((obituary) => {
        if (obituary.body === updatedObituary.body) {
        return updatedObituary;
        }
        return obituary;
        });
    setObituaries(updatedObituaryArray);
    };

  return (
    <div className="app-container">
      <Header changeVisibilityCreator={changeVisibilityCreator}/>
      <ObituaryList onUpdateObituary={onUpdateObituary} obituaries={obituaries} formatDate={formatDate}/>
      {showCreator && <ObituaryCreator changeVisibilityCreator={changeVisibilityCreator} onAddObituary={onAddObituary}/>}
    </div>
  );
}

export default App;
