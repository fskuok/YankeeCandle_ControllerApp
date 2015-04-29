// Ionic Starter App



// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular
    .module('ycapp', ['ionic', 'ngCordova'])

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

        deviceData.util = {
            getHslColor: function(hue){
                return 'hsl(' + hue  + ', 85%, 65%)';
            }
        };

        return deviceData;
    })

    .factory( 'deviceCommunicationService', [ '$http' , 'deviceDataService', function( $http, deviceDataService ){
        function getClusterScent(){
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

        function read(deviceID){

        }

        function order(){

        }

        function init(){
            getClusterScent();
        }

        function syncClusterStatusToDevice(cluster){
            cluster.devices.forEach(function(deviceId){
                deviceDataService.devices[deviceId].status = _.clone(cluster.status, true);
            });
        }

        return {
            //communications
            read: read,
            order: order,

            syncClusterStatusToDevice: syncClusterStatusToDevice,

            // initiation, executed in app.run()
            init: init
        }

    }]);

