import React, { useState, useMemo, useEffect } from "react";

function Obituary({onUpdateObituary, open, name, born_year, died_year, obituary_text, obituary_image_url, obituary_audio_url, formatDate}) {
    const [playing, setPlaying] = useState(false);
    const [audio, setAudio] = useState(new Audio(obituary_audio_url));


    const toggleSound = () => {
        setPlaying(!playing);
    };

    useEffect(() => {
        playing ? audio.play() : audio.pause();
    }, [playing]);

    useEffect(() => {
        audio.addEventListener("ended", () => setPlaying(false));
        return () => {
            audio.removeEventListener("ended", () => setPlaying(false));
        };
    }, []);
    

    const changeObituaryVisibility = () => {
        open = !open;
        setAudio(new Audio(obituary_audio_url));
        onUpdateObituary({
            name: name,
            born_year: born_year,
            died_year: died_year,
            obituary_text: obituary_text,
            open: open,
            obituary_image_url: obituary_image_url,
            obituary_audio_url: obituary_audio_url
        })
    };


    return (
        <div className="obituary">
            <div className="obituary-container" onClick={changeObituaryVisibility}>
            <div className="obituary-img" >
                <img src={obituary_image_url} alt="obituary"/>
                <div className="obituary-img-overlay"></div>
            </div>
            <div className="obituary-info">
                <p>{name}</p>
                <small>{formatDate(born_year)} - {formatDate(died_year)}</small>
            </div>
            {open && (
            <div className="obituary-body">
                <p>{obituary_text}</p>
            </div>
            )}
            </div>
            {open && (
            <div className="obituary-buttons">
                <button className="obituary-button-play" onClick={() => toggleSound()}>Play</button>
            </div>
            )}
        </div>
    );
}
export default Obituary;
