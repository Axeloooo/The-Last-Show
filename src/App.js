import "./App.css";
import Header from "./components/Header";
import ObituaryList from "./components/ObituaryList";
import ObituaryCreator from "./components/ObituaryCreator";
import { useState, useEffect } from "react";

function App() {
  const [showCreator, setShowCreator] = useState(false);
  const [obituaries, setObituaries] = useState(
    localStorage.obituaries ? JSON.parse(localStorage.obituaries) : []
  );

  useEffect(() => {
    localStorage.setItem("obituaries", JSON.stringify(obituaries));
  }, [obituaries]);

  const onAddObituary = async (image, name, birthDate, deathDate) => {
    const data = new FormData();
    data.append("image", image);
    data.append("name", name);
    data.append("birthDate", birthDate);
    data.append("deathDate", deathDate);

    console.log(data);

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

      console.log(newObituary);

      setObituaries((prevObituaries) => [...prevObituaries, newObituary]);
    } catch (error) {
      console.error("Error:", error);
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
        obituary.name === updatedObituary.name &&
        obituary.birthDate === updatedObituary.birthDate &&
        obituary.deathDate === updatedObituary.deathDate
      ) {
        return updatedObituary;
      }
      return obituary;
    });
    setObituaries(updatedObituaryArray);
  };

  return (
    <div className="app-container">
      <Header changeVisibilityCreator={changeVisibilityCreator} />
      <ObituaryList
        onUpdateObituary={onUpdateObituary}
        obituaries={obituaries}
        formatDate={formatDate}
      />
      {showCreator && (
        <ObituaryCreator
          changeVisibilityCreator={changeVisibilityCreator}
          onAddObituary={onAddObituary}
        />
      )}
    </div>
  );
}

export default App;
