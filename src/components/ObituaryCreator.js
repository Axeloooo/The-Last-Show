import { useState } from "react";

function ObituaryCreator({changeVisibilityCreator, onAddObituary}) {
    const [name, setName] = useState("");
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    const [birthDate, setBirthDate] = useState();
    const [deathDate, setDeathDate] = useState();
    const [img, setImg] = useState(null);

    const onSubmit = (e) => {
        e.preventDefault();
        WriteObituary(name, birthDate, deathDate, );
    }

    const WriteObituary = (name, birthDate, deathDate) => {
        onAddObituary(name, birthDate, deathDate);
        changeVisibilityCreator();
    };

    const addImg = (e) => {
        console.log(e.target.files[0].name);
        setImg(e.target.files[0].name);
    };

    return (
        <form className="obituary-creator-container" onSubmit={onSubmit}>
            <div className="obituary-creator-close-button" onClick={changeVisibilityCreator}>x</div>
            <h1 className="title">Create a New Obituary</h1>
            <label htmlFor="img-upload" className="img-upload-label">
                <input id="img-upload" type="file" onChange={(e) => addImg(e)} required/>
                {img ? (<p>Select an image for the deceased ({img})</p>) : (<p>Select an image for the deceased</p>)}
            </label>
            <input className="creator-name-input" type="text" placeholder="Name of the deceased" value={name} onChange={(e) => setName(e.target.value)} required/>
            <div className="creator-date-container">
                <p>Born: </p>
                <input className="date-input-birth" type="datetime-local" onChange={(e) => setBirthDate(e.target.value)} required/>
                <p>Died: </p>
                <input className="date-input-death" type="datetime-local" onChange={(e) => setDeathDate(e.target.value)} required/>
            </div>
            <button type="submit" value="Submit" className="creator-submit-button" >Create Obituary</button>
        </form>
    );
}

export default ObituaryCreator;