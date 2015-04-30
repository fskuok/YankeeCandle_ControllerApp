// Ionic Starter App



// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
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


    .factory( 'deviceDataService', function(){

        // in the real situation, this should be fetched from user devices
        // and cached in app data
        var deviceData = dummyDeviceData;


        //utility methods
        deviceData.util = {

            // @para hue: Number | String
            // @return CSS hsl color: String
            getHslColor: function(hue){
                return 'hsl(' + hue  + ', 85%, 55%)';
            },

            findDeviceInCluster: function(deviceId){
                var cluster;
                _.forEach(deviceData.clusters, function(value, key){
                    // if cluster hasn't been found
                    // and device is found in this cluster
                    if(!cluster && value.devices.indexOf(deviceId)>=0) cluster = deviceData.clusters[key];
                });
                return cluster;
            },

            //@para cluster: cluster: Object or String
            syncClusterStatusToDevice : function (cluster){

                // change String input into cluster data Object
                if(typeof cluster === 'string') cluster = deviceData.clusters[cluster];

                cluster.devices.forEach(function(deviceId){
                    deviceDataService.devices[deviceId].status = _.clone(cluster.status, true);
                });
            },

            formatTimer: function(time){
                //convert to string
                time = +time;
                if(time === 0) return 'No Timer';
                else return ['0' + ~~(time/(1000*60*60)), (~~time%(1000*60*60)/(1000*60) > 9 ? '' : '0') + ~~time%(1000*60*60)/(1000*60)]
            }
        };

        return deviceData;
    })

    .factory( 'deviceCommunicationService', [ '$http' , 'deviceDataService', '$SparkCore',
        function( $http, deviceDataService, $SparkCore ){
            var accessToken = "";

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
                    v.sparkCore = new $SparkCore(accessToken, v.sparkId);
                })
            }

            function init(){

                _getClusterScent();
                // create a Spark Core instance for each device in device data
                _initSparkCores();
            }

            return {
                //communications

                // initiation, executed in app.run()
                init: init
            }

        }]
);

