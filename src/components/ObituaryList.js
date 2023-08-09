import Obituary from "./Obituary";
import { useState, useEffect } from "react";
import useMediaQuery from "../hooks/useMediaQuery";

function ObituaryList({ onUpdateObituary, obituaries, formatDate }) {
  const [fourColumns, setfourColumns] = useState([]);
  const [twoColumns, settwoColumns] = useState([]);

  const isWindow = useMediaQuery("(min-width: 1000px)");

  useEffect(() => {
    const fourColumns = obituaries.reduce(function (columns, item, index) {
      const columnIndex = index % 4;
      const rowIndex = Math.floor(index / 4);
      if (!columns[columnIndex]) {
        columns[columnIndex] = [];
      }
      columns[columnIndex][rowIndex] = item;
      return columns;
    }, []);

    const twoColumns = obituaries.reduce(function (columns, item, index) {
      const columnIndex = index % 2;
      const rowIndex = Math.floor(index / 2);
      if (!columns[columnIndex]) {
        columns[columnIndex] = [];
      }
      columns[columnIndex][rowIndex] = item;
      return columns;
    }, []);

    settwoColumns(twoColumns);
    setfourColumns(fourColumns);
  }, [obituaries]);

  if (obituaries.length === 0)
    return (
      <div className="no-obituaries">
        <h1>No Obituary Yet</h1>
      </div>
    );

  return (
    <>
      {isWindow ? (
        <div className="obituary-list">
          {fourColumns.map((column) => (
            <div className="column">
              {column.map((obituary) => (
                <Obituary
                  onUpdateObituary={onUpdateObituary}
                  open={obituary.open}
                  name={obituary.name}
                  born_year={obituary.born_year}
                  died_year={obituary.died_year}
                  obituary_text={obituary.obituary_text}
                  obituary_image_url={obituary.obituary_image_url}
                  obituary_audio_url={obituary.obituary_audio_url}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="obituary-list">
          {twoColumns.map((column) => (
            <div className="column">
              {column.map((obituary) => (
                <Obituary
                  onUpdateObituary={onUpdateObituary}
                  open={obituary.open}
                  name={obituary.name}
                  born_year={obituary.born_year}
                  died_year={obituary.died_year}
                  obituary_text={obituary.obituary_text}
                  obituary_image_url={obituary.obituary_image_url}
                  obituary_audio_url={obituary.obituary_audio_url}
                  formatDate={formatDate}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default ObituaryList;
