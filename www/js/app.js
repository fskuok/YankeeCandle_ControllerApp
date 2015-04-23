// Ionic Starter App
var dummyDeviceData = {
    "devices":{
        "d001":{
            "name": "bedroom table",
            "color": "#f0652f",
            "cluster": "bedroom",
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
                    "name": "orange",
                    "remain": 50
                }
            },
            "status" : {
                "scent": null, //indicates ON/OFF also
                "timer": 60000 //ms
            }
        },
        "d002":{
            "name": "living room 1",
            "color": "#7ed2ab",
            "cluster": "bedroom",
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
                    "name": "orange",
                    "remain": 50
                }
            },
            "status" : {
                "scent": null //indicates ON/OFF also
            }
        },
        "d003":{
            "name": "bedroom window sill",
            "color": "#336cbf",
            "cluster": "bedroom",
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
                    "name": "orange",
                    "remain": 50
                }
            },
            "status" : {
                "scent": null, //indicates ON/OFF also
                "timer": 60000 //ms
            }
        }
    },

    "clusters": {
        "c001":{
            "name": "living room",
            "color": "#a5acd9"
        },
        "c002":{
            "name": "bedroom",
            "color": "#336cbf"
        }
    }
};

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular
    .module('ycapp', ['ionic', 'ngCordova'])

    .config(function(){

    })

    .run(function($ionicPlatform, $cordovaDialogs) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if(window.StatusBar) {
              StatusBar.styleDefault();
            }


        });
    })

    .filter('titleCase', function(){
        return function(input){
            return typeof input === "string" ? input.split(' ').map(function(v){
                return v.charAt(0).toUpperCase() + v.slice(1);
            }).join(' ') : input;
        }
    })

    .factory( 'deviceCommunicationService', [ '$http' , function( $http ){
        function read(deviceID){

        }
        function order(){

        }

        return {
            read: read,
            order: order
        }

    }])

    .controller( 'controlController',
        [ '$scope', '$ionicPlatform', '$cordovaDialogs',
            function( $scope, $ionicPlatform, $cordovaDialogs ){
                $ionicPlatform.ready(function() {

                });

                $scope.deviceData = dummyDeviceData;
                $scope.choseSystem = 'devices';
                $scope.choseDevice = 'd001';
                $scope.choseCluster = 'c001';

                $scope.$watchGroup(['choseDevice','choseSystem','choseCluster'], function(){
                    $scope.choseDeviceData = $scope
                        .deviceData[$scope.choseSystem][$scope.choseSystem === 'devices' ?
                        $scope.choseDevice : $scope.choseCluster];
                });

                $scope.onSwipeLeft = function(){ onSwipe('left');};
                $scope.onSwipeRight = function(){ onSwipe('right');};
                function onSwipe(direction){
                    function shiftId(id, plus){
                        return id.slice(0, id.length-1) + (+id.slice(id.length-1) + (plus ? 1 : -1))
                    }

                    if($scope.choseSystem === 'devices'){
                        if($scope.deviceData.devices[shiftId($scope.choseDevice, direction === 'left')])
                            $scope.choseDevice = shiftId($scope.choseDevice, direction === 'left')
                    }else if($scope.choseSystem === 'clusters'){
                        if($scope.deviceData.clusters[shiftId($scope.choseCluster, direction === 'left')])
                            $scope.choseCluster = shiftId($scope.choseCluster, direction === 'left')

                    }
                }




            }
        ]
    );


