import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    // Rastrea la vista de página cada vez que cambia la ubicación
    ReactGA.send('pageview', {
      page_path: location.pathname + location.search,
    });
  }, [location]);

  return null; // No retorna nada visible, solo rastrea
}

export default Analytics;
