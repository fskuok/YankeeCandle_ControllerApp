var dummyDeviceData = {
    "devices":{
        "d001":{
            "name": "bedroom table",
            "color": 34, //Hue value range from 0 to 360
            "scents":{
                "scent01": {
                    "name": "peppermint",
                    "remain": 80
                },
                "scent02":{
                    "name": "orange",
                    "remain": 40
                },
                "scent03":{
                    "name": "lavender",
                    "remain": 50
                }
            },
            "status" : {
                "scent": null, //indicates ON/OFF also
                "timer": 60000, //ms
                "strength": 0
            }
        },
        "d002":{
            "name": "living room 1",
            "color": 240,
            "scents":{
                "scent01": {
                    "name": "peppermint",
                    "remain": 40
                },
                "scent02":{
                    "name": "orange",
                    "remain": 60
                },
                "scent03":{
                    "name": "lavender",
                    "remain": 70
                }
            },
            "status" : {
                "scent": null, //indicates ON/OFF also
                "timer": 60000, //ms
                "strength": 0
            }
        },
        "d003":{
            "name": "bedroom window sill",
            "color": 172,
            "scents":{
                "scent01": {
                    "name": "peppermint",
                    "remain": 30
                },
                "scent02":{
                    "name": "orange",
                    "remain": 80
                },
                "scent03":{
                    "name": "orange",
                    "remain": 90
                }
            },
            "status" : {
                "scent": null, //indicates ON/OFF also
                "timer": 60000, //ms
                "strength": 0
            }
        }
    },

    "clusters": {
        "c001":{
            "name": "living room",
            "color": 94,
            "devices": ["d001", "d002"],
            "status" : {
                "scent": null, //indicates ON/OFF also
                "timer": 60000, //ms
                "strength": 0
            }
        },
        "c002":{
            "name": "bedroom",
            "color": 280,
            "devices": ["d003"],
            "status" : {
                "scent": null, //indicates ON/OFF also
                "timer": 60000, //ms
                "strength": 0
            }
        }
    }
};
