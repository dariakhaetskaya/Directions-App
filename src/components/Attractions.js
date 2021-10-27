function Attractions({attr, placeDesc, maxShown, shownOnPage}){
    return(
        <div className="attractions">
                Top places:
                {[(attr.features).slice(maxShown - shownOnPage, maxShown).map(
                  (feature) =>
                      <div className="place" key={feature.id}>
                        {feature.properties.name}
                        <div className="desc">{(placeDesc[feature?.properties?.name])?.wikipedia_extracts?.text}</div>
                      </div>
                )]}

          </div>
    );
}

export default Attractions;