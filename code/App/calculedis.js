const calculateDistance = async (origin, destination) => {
    try {     
           const apiKey = 'AIzaSyCdIq65pwy2KoNBa42AhnecTG3wZN5j4EQ'; // Replace with your actual Google Maps API key

      const response = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&units=metric&key=${apiKey}`);
      const data = await response.json();
  
      if (data.status === 'OK') {
        const distanceValue = data.rows[0].elements[0].distance.text;
        return distanceValue;
      } else {
        console.error('Erreur lors du calcul de la distance:', data.status);
        return null;
      }
    } catch (error) {
      console.error('Erreur lors du calcul de la distance:', error);
      return null;
    }
  };
  
  export default calculateDistance;
  /* comment utiliser adem :        useEffect(() => {
        const fetchDistance = async () => {
            if (emitterPosition && receiverPosition) {
                try {
                    const distance = await calculateDistance(
                        `${emitterPosition.latitude},${emitterPosition.longitude}`,
                        `${receiverPosition.latitude},${receiverPosition.longitude}`
                    );
                    console.log('Distance:', distance);
                } catch (error) {
                    console.error('Erreur lors du calcul de la distance:', error);
                }
            }
        };
    
        fetchDistance();
    }, [emitterPosition, receiverPosition]);*/