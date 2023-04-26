import { useState } from "react";

function ObituaryCreator({ loading, changeVisibilityCreator, onAddObituary }) {
  const dt = new Date();
  dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [deathDate, setDeathDate] = useState("");
  const [img, setImg] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    onAddObituary(img, name, birthDate, deathDate);
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 0) {
      setImg(e.target.files[0]);
    }
  };

  return (
    <div className="creator-display">
      <div
        className="obituary-creator-close-button"
        onClick={changeVisibilityCreator}
      >
        x
      </div>
    <form className="obituary-creator-container" onSubmit={onSubmit}>
      <h1 className="title">Create a New Obituary</h1>
      <label htmlFor="img-upload" className="img-upload-label">
        <input
          id="img-upload"
          type="file"
          required
          onChange={handleImageChange}
        />
        {img ? (
          <p>Select an image for the deceased ({img.name})</p>
        ) : (
          <p>Select an image for the deceased</p>
        )}
      </label>
      <input
        className="creator-name-input"
        type="text"
        placeholder="Name of the deceased"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className="creator-date-container">
        <p>Born: </p>
        <input
          className="date-input-birth"
          type="datetime-local"
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />
        <p>Died: </p>
        <input
          className="date-input-death"
          type="datetime-local"
          onChange={(e) => setDeathDate(e.target.value)}
          required
        />
      </div>
      {loading ? (
        <button disabled={true} type="submit" value="Submit" className="creator-submit-button-disabled">
          Please wait. It's not like they-re gonna be late for something.
        </button>
      ) : (
        <button type="submit" value="Submit" className="creator-submit-button">
          Write Obituary
        </button>
      )}
    </form>
    </div>
  );
}

export default ObituaryCreator;
