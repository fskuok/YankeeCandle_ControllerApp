

var app = angular
    .module('ycapp', ['ionic', 'ngCordova', 'ngSpark'])

    .config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){


        appData.nav.forEach(function(navName){
            $stateProvider
                .state(navName, {
                    url: '/' + navName,
                    templateUrl: 'page/' + navName + '.html',
                    controller: navName + 'Controller'
                });
        });

        $stateProvider
            .state('control/cluster-setting', {
                cache: false, //cache will cause go-back-page incoherency, for reusable template
                url: '/control/{id:setting-c[0-9]{3}}',
                templateUrl: 'page/control-device-setting.html',
                controller: 'controlSettingController'
            })
            .state('control/device-setting', {
                cache: false, //cache will cause go-back-page incoherency, for reusable template
                url: '/control/{id:setting-d[0-9]{3}}',
                templateUrl: 'page/control-device-setting.html',
                controller: 'controlSettingController'
            });

        $urlRouterProvider
            .otherwise('control');

    })

    .run(function($ionicPlatform, $cordovaDialogs, deviceCommunicationService, $rootScope) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
              StatusBar.styleDefault();
            }

            deviceCommunicationService.init();

            // debug usage
            $rootScope.$on('$stateNotFound', function(e){
                console.log(e);
            });
            $rootScope.$on('$stateChangeError', function(e){
                console.log(e);
            });
        });
    })

    .filter('titleCase', function(){
        return function(input){
            return typeof input === "string" ? input.split(' ').map(function(v){
                return v.charAt(0).toUpperCase() + v.slice(1);
            }).join(' ') : input;
        }
    })


    .factory( 'deviceDataService',
        ['$interval',
            function($interval){

                // in the real situation, this should be fetched from user devices
                // and cached in app data
                var deviceData = dummyDeviceData;

                // given the Id of a device or a cluster
                // return it's matched device data obj
                // @para deviceId : String
                // @return Object(cluster|device)
                function getDevice(deviceId){
                    if(typeof deviceId !== 'string') return undefined;

                    return deviceData[deviceId.charAt(0) === 'c' ? 'clusters' : 'devices'][deviceId];
                }

                function getDevicesInCluster(clusterId){
                    var devices = [];
                    getDevice(clusterId).devices.forEach(function(deviceId){
                        devices.push(getDevice(deviceId));
                    });

                    return devices;
                }

                // given the Id of a device
                // return the which cluster the object belongs to
                // @para deviceId : String
                // @return Object(cluster)
                function findDeviceInCluster(deviceId){
                    if(typeof deviceId !== 'string' || deviceId.charAt(0) !== 'd') return undefined;

                    var cluster;
                    _.forEach(deviceData.clusters, function(value, key){
                        // if cluster hasn't been found
                        // and device is found in this cluster
                        if(!cluster && value.devices.indexOf(deviceId)>=0) cluster = deviceData.clusters[key];
                    });
                    return cluster;
                }

                // utility methods
                deviceData.util = {

                    // *********** Device Searching & Fetching ***********
                    getDevice: getDevice,
                    getDevicesInCluster: getDevicesInCluster,
                    findDeviceInCluster: findDeviceInCluster,

                    // *********** Device Manipulation ***********

                    // @para cluster: cluster: Object or String
                    syncClusterStatusToDevice : function (cluster){

                        // change String input into cluster data Object
                        if(typeof cluster === 'string') cluster = deviceData.clusters[cluster];

                        cluster.devices.forEach(function(deviceId){
                            deviceDataService.devices[deviceId].status = _.clone(cluster.status, true);
                        });
                    },

                    // keep track of all timers and count down
                    // @return void
                    timerCountDown: (function(){
                        var interval;

                        return function(cancel){
                            //create count down if not exist
                            if (!interval){
                                interval = $interval(function(){
                                    _.forEach(deviceData.devices, function(device){
                                        // if timer value > 0
                                        if(device.status.timer > 0){
                                            device.status.timer = device.status.timer - 1000;
                                            if(device.status.timer <= 0){
                                                device.status.scent = null;
                                            }
                                        }
                                    })
                                }, 1000);
                            }
                            else{
                                // if passed in true, cancel all countdowns
                                if(cancel) {
                                    $interval.cancel(interval);
                                    interval = undefined;
                                }
                            }
                            return interval;
                        };
                    })(),


                    // *********** String Methods ***********

                    // @para hue: Number | String
                    // @return CSS hsl color: String
                    getHslColor: function(hue){
                        return 'hsl(' + hue  + ', 85%, 55%)';
                    },

                    // format timer from ms to readable time
                    // @para time(in ms) : Number
                    // @return readable time : String(if time is 0) | Array
                    formatTimer: function(time){
                        //convert to string
                        time = +time;
                        if(time === 0) return 'No Timer';
                        else return (
                                //hours
                                '0' + ~~( time/( 1000*60*60 ) ) +
                                //minutes
                                ( ~~ (time%( 1000*60*60 )/( 1000*60 ) ) > 9 ? ':' : ':0' ) +  ~~ ( time%( 1000*60*60 )/( 1000*60 ) )+
                                //seconds
                                ( ~~ (time%( 1000*60 )/( 1000 ) ) > 9 ? ':' : ':0' ) +  ~~ ( time%( 1000*60 )/( 1000 ) )
                        );
                    }
                };

                deviceData.util.timerCountDown();

                return deviceData;
            }
        ]
    )

    .factory( 'deviceCommunicationService', [ '$http' , 'deviceDataService', '$SparkCore',
        function( $http, deviceDataService, $SparkCore ){
            var accessToken = "c5fb6c4afae16c8c1d664cf0e4d2813318b023d4";

            // get clusters' scent from the devices belong to them
            function _getClusterScent(){
                var clusterData;
                for(var clusterName in deviceDataService.clusters){
                    if(deviceDataService.clusters.hasOwnProperty(clusterName)){
                        clusterData = deviceDataService.clusters[clusterName];
                        // use the data of the first device in the cluster
                        // in the real situation, this should be calculated from all devices data
                        clusterData.scents = deviceDataService.devices[clusterData.devices[0]].scents;
                    }
                }
            }

            // create a Spark Core instance for each device in device data
            function _initSparkCores(){
                _.forEach(deviceDataService.devices, function(v, i, a){
                    if(v.sparkId) v.sparkCore = new $SparkCore(v.sparkId, accessToken);
                })
            }

            function _listenToDevice(){
                _.forEach(deviceDataService.devices, function(device, deviceId){
                    if(device.sparkCore){
                        device.sparkCore.subscribe('scentChange/device/' + deviceId, function(event){

                        });
                        device.sparkCore.subscribe('timerChange/device/' + deviceId, function(event){

                        });
                        device.sparkCore.subscribe('strengthChange/device/' + deviceId, function(event){

                        });
                    }
                })
            }

            function set(id, name, value){
                var devices;

                console.log(id, name, value);

                if( id.charAt(0) === 'c')
                    devices = deviceDataService.util.getDevicesInCluster(id);
                else if( id.charAt(0) === 'd')
                    devices = [deviceDataService.util.getDevice(id)];
                else return;

                console.log(devices);

                // either device or cluster will be handled.


                switch(name){
                    case 'scent':
                        if(!value) value = 'none';
                        devices.forEach(function(device){
                            console.log(value);
                            device.sparkCore.callFn('turnOnScent', value);
                        });
                        break;
                    case 'strength':
                        devices.forEach(function(device){
                            device.sparkCore.callFn('setStrength', value);
                        });
                        break;
                    case 'timer':
                        devices.forEach(function(device){
                            device.sparkCore.callFn('setTimer', value);
                        });
                        break;
                    default:
                }
            }

            function init(){
                deviceDataService.util.timerCountDown();

                _getClusterScent();
                // create a Spark Core instance for each device in device data
                _initSparkCores();

                _listenToDevice();
            }

            return {
                //communications
                set: set,

                // initiation, executed in app.run()
                init: init

            }

        }]
);

