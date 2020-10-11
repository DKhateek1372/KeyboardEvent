import React, { useState, useEffect } from "react";
import { searchData } from "./data";
import Searchbar from "./search";
import "./styles.css";

const useKeyPress = function(targetKey) {
  const [keyPressed, setKeyPressed] = useState(null);

  function downHandler(event,key) {
   if (key === targetKey  || event.keyCode == 40  ) {
      setKeyPressed(event.keyCode);
      let wHeight = window.innerHeight;
      window.scrollY = wHeight;
    }
  }

  const upHandler = (event,key) => {
    if (key === targetKey || event.keyCode == 38 ) {
      setKeyPressed(event.keyCode);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", (e) =>downHandler(e, 'keydown'));
    window.addEventListener("keyup", (e) =>upHandler(e, 'keyup'));

    return () => {
      window.removeEventListener("keydown",(e) => downHandler(e, 'keydown'));
      window.removeEventListener("keyup",(e) =>  upHandler(e, 'keyup'));
    };
  });

  return keyPressed;
};

export default function App() {
  const divRef = React.useRef(0);
  const [state, setState] = React.useState(searchData);
  const [search, setSearchState] = React.useState({
    searchText: "",
  });
  const [searchResult, setSearchResult] = React.useState(false);
  const [selected, setSelected] = useState(undefined);
  const downPress = useKeyPress("ArrowDown");
  const upPress = useKeyPress("ArrowUp");
  const enterPress = useKeyPress("Enter");
  const [cursor, setCursor] = useState(0);
  const [hovered, setHovered] = useState(undefined);

  useEffect(() => {
    if (state.length && downPress ===40 ) {
      setCursor(prevState =>
        prevState < state.length - 1 ? prevState + 1 : prevState
      );
    }
  }, [downPress]);
  useEffect(() => {
    if (state.length && upPress && downPress ===38 )  {
      setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
    }
  }, [upPress]);
  useEffect(() => {
    if (state.length && enterPress) {
      setSelected(state[cursor]);
    }
  }, [cursor, enterPress]);
  useEffect(() => {
    if (state.length && hovered) {
      setCursor(state.indexOf(hovered));
    }
  }, [hovered]);

  let { searchText } = search;

  const SearchHandler = (e) => {
    setSearchState(e.target.value);
    const text = e.target.value;
    const searchText = text.toLowerCase();
    setSearchResult(true);
    const data =
      !!state &&
      Array.isArray(state) &&
      state.length > 0 &&
      state.filter(
        (data) =>
          data.name.toLowerCase().includes(searchText) ||
          data.address.toLowerCase().includes(searchText) ||
          data.id.toString().includes(searchText) ||
          data.pincode.toString().includes(searchText)
      );
    searchText !== ""
      ? setState(data)
      : setState(searchData) || setSearchResult(false);
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const ListItem = ({ item, active, setSelected, setHovered, key }) => (
    <div
      className={`item ${active ? "active" : ""}`}
      onClick={() => setSelected(item)}
      onMouseEnter={() => setHovered(item)}
      onMouseLeave={() => setHovered(undefined)}
    >
      <div ref={divRef} className="searchDetails" key={key}>
        <div className="searchId">
          {item.id}
          <br></br>
          {item.name}
        </div>
        <div className="searchData">
          <div>{item.address}</div>
          <div>{"," + item.pincode}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="App">
      <h1>Niyo Solutions Task</h1>
      <div className="searchBar">
        <Searchbar searchHandler={SearchHandler} searchBar={searchText} />
        <div>
          {!!searchResult ? (
            <div className={state.length === 0 ? "emptyList" : "suggestedName"}>
              {!!state && Array.isArray(state) && state.length > 0 ? (
                state.map((item, index) => (
                  <ListItem
                    key={item.id}
                    active={index === cursor}
                    item={item}
                    setSelected={setSelected}
                    setHovered={setHovered}
                  />
                ))
              ) : (
                <div className="empty">No user Found</div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
