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
        if (open){
            setAudio(new Audio(obituary_audio_url));
        }
        else {
            setPlaying(false);
        }
        
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
                    {/* <div className="obituary-img-overlay"></div> */}
                </div>
                <div className="obituary-info">
                    <p>{name}</p>
                    <small>{formatDate(born_year)} - {formatDate(died_year)}</small>
                </div>
                {open && (

                <div className="obituary-body">
                    <p>{obituary_text}</p>
                </div>
                ) }
            </div>

            {open && (
            <div className="obituary-buttons">
                <button className="obituary-button-play" onClick={() => toggleSound()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9.525 18.025q-.5.325-1.012.038T8 17.175V6.825q0-.6.513-.888t1.012.038l8.15 5.175q.45.3.45.85t-.45.85l-8.15 5.175Z"/></svg>
                </button>
            </div>
            ) }

        </div>
    );
}
export default Obituary;
