import axios from 'axios';

interface MapboxPlacesFeatures {
  place_name: string;
  center: number[];
}

interface MapboxPlacesResponse {
  features: MapboxPlacesFeatures[];
}

interface MapboxResponseCoordinates {
  latitude: number;
  longitude: number;
}

const ACCESS_TOKEN_MAP_BOX =
  'pk.eyJ1IjoiZGllZ29kc2YiLCJhIjoiY2tpODBnbnFlMDE0bzJ4cWxiYjVuNmh3MiJ9.LPUAdimSnK9OCzP7Wnxh6A';

export async function fetchAddressMapbox(
  address: string,
): Promise<MapboxResponseCoordinates> {
  try {
    const response = await axios.get<MapboxPlacesResponse>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${ACCESS_TOKEN_MAP_BOX}`,
    );

    const [longitude, latitude] = response.data.features[0].center;

    return { latitude, longitude };
  } catch {
    throw new Error(
      'It was not able to retrieve the coordinates from the Mapbox API',
    );
  }
}
