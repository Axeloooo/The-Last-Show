function Obituary({onUpdateObituary, open, name, born_year, died_year, obituary_text, obituary_image_url, obituary_audio_url, formatDate}) {
    
    const changeObituaryVisibility = () => {
        open = !open;
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
        <div className="obituary" onClick={changeObituaryVisibility}>
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
            ) }
            <div className="obituary-buttons">
                <button className="obituary-button-play">Play</button>
            </div>
        </div>
    );
}
export default Obituary;
