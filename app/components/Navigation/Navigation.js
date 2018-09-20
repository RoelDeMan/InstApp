import RNPolyline from 'rn-maps-polyline';
const request = require('superagent');

class Navigation {

    getNavigationData(startLat, startlong, destLat, destLong) {
        console.log('loggggg');
        return new Promise((resolve, reject) => {
            const mode = 'driving';
            let start = [startLat, startlong];
            let destination = [destLat, destLong];
            let waypoint = [51.986279, 5.899756];
            const APIKEY = 'AIzaSyBUgSbt6n_EYI9RJRPDQTW5BLspjBW4M80';
            // const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&waypoints=${waypoint}&key=${APIKEY}&mode=${mode}`;
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=51.835594,5.879739&destination=51.848842,5.863850&waypoints=51.841945,5.859052&key=AIzaSyBUgSbt6n_EYI9RJRPDQTW5BLspjBW4M80`;
            // https://maps.googleapis.com/maps/api/directions/json?origin=[51.987145,205.897739]&destination=${destination}&key=AIzaSyBUgSbt6n_EYI9RJRPDQTW5BLspjBW4M80&mode=[51.986279,205.899756]&'driving'
            let context = this;
            request
                .get(url)
                .set("Accept", "application/json")
                .end(function (err, res) {
                    let routeData = res.body;
                    resolve(routeData);
                });
        });
    }

    getNavigationPolyLine(routeData) {
        return RNPolyline.decode(routeData.routes[0].overview_polyline.points);
    }

    getNavigationDistance(routeData) {
        return routeData.routes[0].legs[0].distance.text;
    }

    getNavigationDuration(routeData) {
       return routeData.routes[0].legs[0].duration.text;
    }
}

export default new Navigation();