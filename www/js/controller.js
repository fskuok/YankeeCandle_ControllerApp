/**
 * Created by vangos on 4/24/15.
 */
app
    .controller('headerController', ['$scope', '$state', '$rootScope', function($scope, $state, $rootScope){

        // *********** MODEL ***********

        // the model of button type
        // if type is null, button will be hidden using ng-hide
        // otherwise, the type will be add to button class for styling
        $scope.buttonStatus = {
            left: null, // possible value: null, 'back'
            right: null // possible value: null
        };

        // *********** MODEL UPDATER ***********

        // assign the right button type
        // every time the state changes
        $rootScope.$on('$stateChangeSuccess', function(e, nowState, newStateParams, prevState){
            var nowPathArr = nowState.name.split('/'),
                prevPathArr = prevState.name.split('/');

            // if it's not a root state, left button will be assigned as a back button
            if( nowPathArr.length > 1){
                $scope.buttonStatus.left = 'back'
            }else{
                $scope.buttonStatus.left = null;
            }

        });

        // *********** INTERACTION HANDLERS ***********

        // return a state name
        // that remove the part after the last '/' of the input state name
        function getUpperLevelStateName(name){
            var tempArr = name.split('/');
            tempArr.pop();
            return tempArr.join('/')

        }

        $scope.leftButtonOnTap = function(){


            //handle back button pressed
            if($scope.buttonStatus.left === 'back'){
                $state.go(getUpperLevelStateName($state.current.name));
            }

        };

        $scope.rightButtonOnTap = function(){

        };

    }])

    .controller('navController', ['$scope', '$rootScope', '$state', '$ionicViewSwitcher', function($scope, $rootScope, $state, $ionicViewSwitcher){

        // *********** MODEL UPDATER ***********

        //change nav bar view
        $rootScope.$on('$stateChangeSuccess', function(event, nowState, prevState){
            $scope.$parent.navStatus = nowState.name.split('/')[0];
        });


        // *********** INTERACTION HANDLERS ***********

        //on tap relocate
        $scope.$watch('$parent.navStatus', function(newValue){
            if(typeof newValue === 'string' && newValue.length > 0){
                $ionicViewSwitcher.nextDirection('swap');
                $state.go(newValue);
            }
        });


    }])

    .controller( 'controlController',
        [ '$scope', '$ionicPlatform', '$cordovaDialogs', 'deviceDataService',
            function( $scope, $ionicPlatform, $cordovaDialogs, deviceDataService ){
                var previousScent;


                $scope.deviceData = deviceDataService;
                $scope.getHsl = deviceDataService.util.getHslColor;

                // choosing status
                $scope.choseSystem = 'devices';
                $scope.choseDevice = 'd001';
                $scope.choseCluster = $scope.deviceData.clusters.c001 ? 'c001': undefined;

                // change chose device or cluster by swiping
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


                // access chose device or cluster data on every change
                $scope.$watchGroup(['choseDevice','choseSystem','choseCluster'], function(){
                    $scope.choseDeviceData = $scope
                        .deviceData[$scope.choseSystem][$scope.choseSystem === 'devices' ?
                        $scope.choseDevice : $scope.choseCluster];

                    previousScent = $scope.choseDeviceData.status.scent;
                });


                $scope.scentOnTap = function(scentId){
                    // if already have a scent on,
                    // and tap again on this scent,
                    // turn of the scent
                    if(previousScent && previousScent === scentId){
                        $scope.choseDeviceData.status.scent = scentId = null;
                    }
                    previousScent = scentId;
                };

                $scope.deviceSettingOnTap = function(){

                };

                $ionicPlatform.ready(function() {

                });

            }
        ]
    )
    .controller('controlSettingController', ['$scope', '$rootScope', '$state', '$stateParams', 'deviceDataService',
        function($scope, $rootScope, $state, $stateParams, deviceDataService){

            // $stateParams.id should be 'setting-d___' or 'setting-c___'
            $scope.deviceId = $stateParams.id.slice(8);
            $scope.systemType = $scope.deviceId.charAt(0) === 'c' ? 'cluster' : 'device';
            $scope.deviceData = deviceDataService[$scope.systemType + 's'][$scope.deviceId];
            console.log($scope.deviceData.name);

        }
    ])

    .controller('shopController', ['$scope', '$rootScope', '$state', '$ionicBackdrop', function($scope, $rootScope, $state, $ionicBackdrop){
        $scope.items = shopData.list;
        //$ionicBackdrop.retain();
    }])
    .controller('statusController', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state){

    }])
    .controller('settingController', ['$scope', '$rootScope', '$state', function($scope, $rootScope, $state){

    }]);

