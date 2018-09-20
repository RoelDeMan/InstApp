import RNPolyline from 'rn-maps-polyline';
const request = require('superagent');

class Navigation {
    getNavigationData(startLat, startlong, destLat, destLong) {
        return new Promise((resolve, reject) => {
            const mode = 'driving';
            let start = [startLat, startlong];
            let destination = [destLat, destLong];
            const APIKEY = 'AIzaSyBUgSbt6n_EYI9RJRPDQTW5BLspjBW4M80';
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${start}&destination=${destination}&key=${APIKEY}&mode=${mode}`;
            request
                .get(url)
                .set("Accept", "application/json")
                .end(function (err, res) {
                    let routeData = res.body;
                    resolve(routeData);
                });
        });
    }
    getNavigationDataForDriver(startCoords, waypoints, endCoords) {
        return new Promise((resolve, reject) => {
            const mode = 'driving';
            const APIKEY = 'AIzaSyBUgSbt6n_EYI9RJRPDQTW5BLspjBW4M80';
            const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startCoords}&destination=${endCoords}&waypoints=optimize:true|${waypoints}&key=${APIKEY}&mode=${mode}`;
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
            return routeData.routes[0].legs[0].duration.text.replace("hours", "uren").replace("hour", "uur").replace("mins", "min");
    }

    getNavigationDurationNew(routeData) {
        let totalTime = 0;
        for(let i = 0; i < routeData.routes[0].legs.length; i++){
            totalTime += routeData.routes[0].legs[i].duration.value;
        }
        totalTime = Math.ceil(totalTime / 60);
        return totalTime;
    }
}

export default new Navigation();