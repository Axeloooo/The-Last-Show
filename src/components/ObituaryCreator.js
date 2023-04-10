import { useState } from "react";

function ObituaryCreator({changeVisibilityCreator, onAddObituary}) {
    const [name, setName] = useState("");
    const dt = new Date();
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    const[date, setDate] = useState(dt.toISOString().slice(0, 16));

const WriteObituary = (name) => {
    onAddObituary(name);
    changeVisibilityCreator();
};

    return (
        <div className="obituary-creator-container">
            <div className="obituary-creator-close-button" onClick={changeVisibilityCreator}>x</div>
            <h1 className="title">Create a New Obituary</h1>
            <img src="https://www.seekpng.com/png/detail/154-1541124_graphics-for-scroll-clip-art-graphics-fancy-design.png" alt="obituary" />
            <p>Select an image for the deceased</p>
            <input className="creator-name-input" type="text" placeholder="Name of the deceased" value={name} onChange={(e) => setName(e.target.value)}/>
            <div className="creator-date-container">
                <p>Born: </p>
                <input className="date-input-birth" type="datetime-local" />
                <p>Died: </p>
                <input className="date-input-death" type="datetime-local" />
            </div>
            <button className="creator-submit-button" onClick={() => WriteObituary(name)}>Write Obituary</button>
        </div>
    );
}

export default ObituaryCreator;