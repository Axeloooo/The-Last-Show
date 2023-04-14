import Obituary from './Obituary';

function ObituaryList({onUpdateObituary, obituaries, formatDate}) {

    if (obituaries.length === 0) return <div className="no-obituaries"><h1>No Obituary Yet</h1></div>;

    return(
        <div className="obituary-list">
            {obituaries.map((obituary) => (
            <Obituary onUpdateObituary={onUpdateObituary} open={obituary.open} name={obituary.name} birthDate={obituary.birthDate} deathDate={obituary.deathDate} body={obituary.body} formatDate={formatDate}/>
            ))}

        </div>
    );
}

export default ObituaryList;