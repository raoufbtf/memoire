
import axios from 'axios';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCdIq65pwy2KoNBa42AhnecTG3wZN5j4EQ';


const getCurrentAddress = async (latitude, longitude) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const response = await axios.get(url);
    if (response.data.results.length > 0) {
      return response.data.results[0].formatted_address;
    } else {
      return 'Adresse non trouvée';
    }
  } catch (error) {
    console.error(error);
    return 'Erreur lors de la récupération de l\'adresse';
  }
};

export default getCurrentAddress;
