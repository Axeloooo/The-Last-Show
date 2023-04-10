function Header({changeVisibilityCreator}) {
  return (
    <div className = "app-header">
        <div className = "app-title">
            <h1>The Last Show</h1>
        </div>
        <div className = "app-add-button" onClick={changeVisibilityCreator}>
            <p>+ New Obituary</p>
        </div>
    </div>
  );
}
export default Header;