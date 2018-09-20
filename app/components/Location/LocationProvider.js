import Geocoder from 'react-native-geocoder';

class LocationProvider {

    getFullLocation() {
        return new Promise((resolve, error) => {
            navigator.geolocation.getCurrentPosition(
                position => {
                    Geocoder.geocodePosition({lat: position.coords.latitude, lng: position.coords.longitude})
                        .then(result => {
                            resolve(result[0]);
                        });
                },
                error => {
                    console.log(error);
                }
            );
        })
    }
}

export default new LocationProvider();