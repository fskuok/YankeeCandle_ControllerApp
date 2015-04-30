var dummyDeviceData = {
    "devices":{
        "d001":{
            "sparkId": "",
            "name": "bedroom table",
            "color": 30, //Hue value range from 0 to 360
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
                "timer": 0, //ms
                "strength": 0
            }
        },
        "d002":{
            "sparkId": "",
            "name": "living room 1",
            "color": 80,
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
                "timer": 0, //ms
                "strength": 0
            }
        },
        "d003":{
            "sparkId": "",
            "name": "bedroom window sill",
            "color": 180,
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
                "timer": 0, //ms
                "strength": 0
            }
        }
    },

    "clusters": {
        "c001":{
            "name": "living room",
            "color": 230,
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
