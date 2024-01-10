import "./App.css";
import Header from "./components/Header";
import ObituaryList from "./components/ObituaryList";
import ObituaryCreator from "./components/ObituaryCreator";
import { useState, useEffect } from "react";

function App() {
  const [showCreator, setShowCreator] = useState(false);
  const [obituaries, setObituaries] = useState([]);
  const [loading, setLoading] = useState(false);

  const sortData = (data) => {
    return data.sort((a, b) => {
      return new Date(a.created_at) - new Date(b.created_at);
    });
  };

  useEffect(() => {
    try {
      const fetchObituaries = async () => {
        const res = await fetch(`${process.env.REACT_APP_GET_LAMBDA_URL}`, {
          method: "GET",
          header: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`An error occurred: ${res.statusText}`);
        }

        const data = await res.json();
        const sortedFetchedData = sortData(data);

        console.log(sortedFetchedData);
        setObituaries(sortedFetchedData);
      };

      fetchObituaries();
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  const onAddObituary = async (image, name, birthDate, deathDate) => {
    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("birthDate", birthDate);
    data.append("deathDate", deathDate);

    setLoading(true);
    try {
      const res = await fetch(`${process.env.REACT_APP_PUT_LAMBDA_URL}`, {
        method: "PUT",
        body: data,
      });

      if (!res.ok) {
        throw new Error(`An error occurred: ${res.statusText}`);
      }

      const newObituaryObject = await res.json();
      const newObituary = {
        id: newObituaryObject.id,
        name: newObituaryObject.name,
        born_year: newObituaryObject.born_year,
        died_year: newObituaryObject.died_year,
        obituary_text: newObituaryObject.obituary_text,
        open: true,
        obituary_image_url: newObituaryObject.obituary_image_url,
        obituary_audio_url: newObituaryObject.obituary_audio_url,
      };

      setObituaries((prevObituaries) => [...prevObituaries, newObituary]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
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
      if (obituary.name === updatedObituary.name) {
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
