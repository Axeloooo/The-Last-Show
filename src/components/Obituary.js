function Obituary({onUpdateObituary, open, name, birthDate, deathDate, body, formatDate}) {
    
    const changeObituaryVisibility = () => {
        open = !open;
        onUpdateObituary({
            name: name,
            birthDate: birthDate,
            deathDate: deathDate,
            body: body,
            open: open,
        })
    };

    return (
        <div className="obituary" onClick={changeObituaryVisibility}>
            <div className="obituary-img" >
                <img src="https://clipartix.com/wp-content/uploads/2018/02/Minion-black-and-white-pic-minions-clipart.jpg" alt="obituary" />
                <div className="obituary-img-overlay"></div>
            </div>
            <div className="obituary-info">
                <p>{name}</p>
                <small>{formatDate(birthDate)} - {formatDate(deathDate)}</small>
            </div>
            {open && (
            <div className="obituary-body">
                <p>{body}</p>
            </div>
            ) }
            <div className="obituary-buttons">
                <button className="obituary-button-play">Play</button>
            </div>
        </div>
    );
}
export default Obituary;
