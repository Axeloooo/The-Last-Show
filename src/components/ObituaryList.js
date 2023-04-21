import Obituary from './Obituary';

function ObituaryList({onUpdateObituary, obituaries, formatDate}) {

    if (obituaries.length === 0) return <div className="no-obituaries"><h1>No Obituary Yet</h1></div>;

    return(
        <div className="obituary-list">
            {obituaries.map((obituary) => (
            <div className="item">
                <Obituary onUpdateObituary={onUpdateObituary} open={obituary.open} name={obituary.name} born_year={obituary.born_year} died_year={obituary.died_year} obituary_text={obituary.obituary_text} obituary_image_url={obituary.obituary_image_url} obituary_audio_url={obituary.obituary_audio_url} formatDate={formatDate}/>
                <div className="space"></div>
            </div>          
            ))}
        </div>
    );
}

export default ObituaryList;