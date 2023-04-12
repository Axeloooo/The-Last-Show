function Obituary({name, birthDate, deathDate, body, formatDate}) {
    return (
        <div className="obituary">
            <div className="obituary-img">
                <img src="https://clipartix.com/wp-content/uploads/2018/02/Minion-black-and-white-pic-minions-clipart.jpg" alt="obituary" />
            </div>
            <div className="obituary-info">
                <p>{name}</p>
                <small>{formatDate(birthDate)} - {formatDate(deathDate)}</small>
            </div>
            <div className="obituary-body">
                <p>{body}</p>
            </div>
            <div className="obituary-buttons">
                <button className="obituary-button-play">Play</button>
            </div>
        </div>
    );
}
export default Obituary;
