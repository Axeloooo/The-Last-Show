import Obituary from './Obituary';

function ObituaryList({obituaries}) {
    if (obituaries.length === 0) return <div className="no-obituaries">No Obituary Yet</div>;

    return(
        <div className="obituary-list">
            {obituaries.map((obituary) => (
            <Obituary id={obituary.id} name={obituary.name} date={obituary.date} body={obituary.body} />
            ))}

        </div>
    );
}

export default ObituaryList;