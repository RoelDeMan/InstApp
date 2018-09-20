const KEYS = {
    CAR_NODE: 'cars',
    CAR: {
        BRAND: 'brand',
        COLOUR: 'colour',
        LICENSE: 'license',
        NAME: 'name',
    },
    DRIVER_NODE: 'drivers',
    DRIVER: {
        CAR: {
            BRAND: 'carbrand',
            COLOUR: 'carcolour',
            LICENSE: 'carlicense',
        },
        LAT: 'lat',
        LONG: 'long',
        NAME: 'drivername',
        ROUTE: 'route',
        TIMESTAMP: 'timestamp',
        DRIVERCITYNAME: 'driverCityName'

    },
    FCM : {
        TOPICS : '/topics/',
        NOTIFICATION: {
            TYPE: {
                REQUEST: 'request',
                ACCEPTED: 'accepted',
            }
        }
    },
    LOCATIONS_NODE: 'locations',
    LOCATIONS: {
        ADDRESS: 'address',
        CITY: 'city',
        NAME: 'name',
        LONG: 'long',
        LAT: 'lat',
    },
    REQUEST_NODE: 'requests',
    REQUEST: {
        ADDRESS: 'address',
        CITY: 'city',
        DESTINATION: {
            ADDRESS: 'destaddress',
            CITY: 'destcity',
            LAT: 'destlat',
            LONG: 'destlong',
        },
        DRIVER: {
            NAME: 'drivername',
            UID: 'driveruid',
        },
        PASSENGER: {
            NAME: 'name',
            UID: 'uid',
        },
        REQUESTTIMESTAMP: 'requesttimestamp',
        START: {
            ADDRESS: 'address',
            CITY: 'city',
            LAT: 'lat',
            LONG: 'long',
        },
        STATE: 'ready',
        STATES: {
            PASSENGERREQUESTED: 1,
            DRIVERACCEPTED: 3,

        },
        STATES_SEMI: {
            PASSENGERREQUESTED: 20,
            DRIVERACCEPTED: 21,
        },
        TIMESTAMP: 'timestamp',
    },
    STORAGE : {
        PROFILE_PICTURE : 'profilePictures',
    },
    UPLOADS_NODE: 'uploads',
    UPLOADS: {
        TIME: 'time',
        TYPE: 'type',
        USER: 'user',
        TYPES: {
            PROFILE_PICTURE :'profilePicture',
        }
    },
    USER_NODE: 'users',
    USER: {
        NAME: 'name',
        EMAIL: 'email',
        PHONE: 'phone',
        PICTURE: 'picture',
        PLACE: 'place',
        FBID: 'fbid',
        ACCESSTOKEN: 'accesstoken'
    },
    VALUE: {
        ONCE: 'value',
        VALUE: 'value',
    }

};

export default KEYS;