import React from 'react';
import LoadingIcon from '../svgIcons/LoadingIcon'
import './Loader.scss'


const Loader = ({loadingText}) => {
  return (
    <div className="loader">
      <LoadingIcon />
      <p>{loadingText}</p>
    </div>
  );
};

export default Loader;
