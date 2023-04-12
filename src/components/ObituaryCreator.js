import { useState, useEffect } from "react";

function ObituaryCreator({changeVisibilityCreator, onAddObituary}) {
    const [name, setName] = useState("");
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    const [birthDate, setBirthDate] = useState();
    const [deathDate, setDeathDate] = useState();
    const [img, setImg] = useState(null);

const WriteObituary = (name, birthDate, deathDate) => {
    onAddObituary(name, birthDate, deathDate);
    changeVisibilityCreator();
};

    return (
        <div className="obituary-creator-container">
            <div className="obituary-creator-close-button" onClick={changeVisibilityCreator}>x</div>
            <h1 className="title">Create a New Obituary</h1>
            <label htmlFor="img-upload" className="img-upload-label">
                <input id="img-upload" type="file" onChange={(e) => setImg(e.target.files[0])}/>
                {img ? (<p>Select an image for the deceased ({img.name})</p>) : (<p>Select an image for the deceased</p>)}
            </label>
            <input className="creator-name-input" type="text" placeholder="Name of the deceased" value={name} onChange={(e) => setName(e.target.value)}/>
            <div className="creator-date-container">
                <p>Born: </p>
                <input className="date-input-birth" type="datetime-local" onChange={(e) => setBirthDate(e.target.value)}/>
                <p>Died: </p>
                <input className="date-input-death" type="datetime-local" onChange={(e) => setDeathDate(e.target.value)}/>
            </div>
            <button className="creator-submit-button" onClick={() => WriteObituary(name, birthDate, deathDate)}>Write Obituary</button>
        </div>
    );
}

export default ObituaryCreator;