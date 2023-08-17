import './Bar.scss';
import React from 'react';

export default function bar({ rating, className = "" }) {
  // Determinar el color según la puntuación
  const determineColor = (score) => {
    if (score < 50) {
      return 'hsl(0, 100%, 50%)';  // Rojo
    } else if (score < 75) {
      return 'hsl(30, 100%, 50%)';  // Naranja
    } else if (score < 85) {
      return 'hsl(60, 100%, 50%)';  // Amarillo
    } else {
      return 'hsl(120, 100%, 50%)';  // Verde
    }
  }

  const fillColor = determineColor(rating);

  return (
    <div className={`bar ${className}`} role="progressbar">
      <span id="rating" className='sr-only'>Promedio de resultados:</span>
      <span
        role="progressbar" aria-labelledby="rating" aria-valuenow={rating}>

        <svg width="100%" height="6">
          <rect className='bar-svg__bg' height="6" width="100%" />
          <rect height="6" width={`${rating}%`} fill={fillColor} />
        </svg>

      </span>
    </div>
  );
}
