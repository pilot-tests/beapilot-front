import React from 'react';
import Robot from '../svgIcons/Robot';
import './AiInput.scss';

export default function AiInput({ input, className = "" }) {

  return (
    <div className={`aiinput ${className}`}>
      <div dangerouslySetInnerHTML={{ __html: input }} />
      <div className="aiinput__picture">
        <Robot />
      </div>
    </div>
  );
}
