import "./App.css";
import Header from "./components/Header";
import ObituaryList from "./components/ObituaryList";
import ObituaryCreator from "./components/ObituaryCreator";
import { useState, useEffect } from "react";

function App() {
  const [showCreator, setShowCreator] = useState(false);
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchObituaries = async () => {
      const res = await fetch(
        "https://f7itakwuthszobp6ykjx3pgsyq0eeonm.lambda-url.ca-central-1.on.aws/",
        {
          method: "GET",
          header: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setObituaries(data);
    };
    fetchObituaries();
  }, []);

  const onAddObituary = async (image, name, birthDate, deathDate) => {
    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("birthDate", birthDate);
    data.append("deathDate", deathDate);

    setLoading(true);
    console.log('loading: true');
    try {
      const res = await fetch(
        "https://5woydzwm463jmh2ob3ovtjsc4i0nscof.lambda-url.ca-central-1.on.aws/",
        {
          method: "PUT",
          body: data,
        }
      );

      if (!res.ok) {
        throw new Error(`An error occurred: ${res.statusText}`);
      }

      const newObituary = await res.json();
      
      setObituaries((prevObituaries) => [...prevObituaries, newObituary]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
      console.log('loading: false');
      changeVisibilityCreator();
    }
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
      if (
        obituary.name === updatedObituary.name) {
        return updatedObituary;
      }
      return obituary;
    });
    setObituaries(updatedObituaryArray);
  };

  return (
    <div className="app-container">
      <Header changeVisibilityCreator={changeVisibilityCreator} />
      <div className="container">
        <ObituaryList
          onUpdateObituary={onUpdateObituary}
          obituaries={obituaries}
          formatDate={formatDate}
        />
      </div>
      {showCreator && (
        <ObituaryCreator
          loading={loading}
          changeVisibilityCreator={changeVisibilityCreator}
          onAddObituary={onAddObituary}
        />
      )}
    </div>
  );
}

export default App;
