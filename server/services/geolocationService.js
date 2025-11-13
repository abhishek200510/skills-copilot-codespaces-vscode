import axios from 'axios';

class GeolocationService {
  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY;
  }

  /**
   * Get coordinates from address
   */
  async geocodeAddress(address) {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            address,
            key: this.apiKey,
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formattedAddress: response.data.results[0].formatted_address,
        };
      }

      throw new Error('No results found for the given address');
    } catch (error) {
      console.error('Error geocoding address:', error.message);
      throw error;
    }
  }

  /**
   * Get address from coordinates
   */
  async reverseGeocode(latitude, longitude) {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/geocode/json',
        {
          params: {
            latlng: `${latitude},${longitude}`,
            key: this.apiKey,
          },
        }
      );

      if (response.data.results && response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      }

      throw new Error('No results found for the given coordinates');
    } catch (error) {
      console.error('Error reverse geocoding:', error.message);
      throw error;
    }
  }

  /**
   * Calculate distance between two points
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in kilometers
  }

  /**
   * Convert degrees to radians
   */
  toRad(degrees) {
    return degrees * (Math.PI / 180);
  }

  /**
   * Find nearby locations
   */
  async findNearby(latitude, longitude, radius = 5, type = 'pharmacy') {
    try {
      const response = await axios.get(
        'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
        {
          params: {
            location: `${latitude},${longitude}`,
            radius: radius * 1000, // Convert km to meters
            type,
            key: this.apiKey,
          },
        }
      );

      return response.data.results || [];
    } catch (error) {
      console.error('Error finding nearby locations:', error.message);
      throw error;
    }
  }
}

export default new GeolocationService();
