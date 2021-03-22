import axios from 'axios';

import { MAPBOX_ACCESS_TOKEN } from '@env';

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

export async function fetchAddressMapbox(
  address: string,
): Promise<MapboxResponseCoordinates> {
  try {
    const response = await axios.get<MapboxPlacesResponse>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${MAPBOX_ACCESS_TOKEN}`,
    );

    const [longitude, latitude] = response.data.features[0].center;

    return { latitude, longitude };
  } catch {
    throw new Error(
      'It was not able to retrieve the coordinates from the Mapbox API',
    );
  }
}
