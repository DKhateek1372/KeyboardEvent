import * as React from "react";
import "./styles.css";

const Searchbar = (props) => {
  const { serachBar, searchHandler } = props;
  return (
    <div>
      <input
        placeholder="Please Search Here by Id, address, name"
        margin="normal"
        value={serachBar}
        onChange={searchHandler}
        className="globalSearch"
      />
      <span><i className="fa fa-search"></i></span>
    </div>
  );
};
export default Searchbar;
