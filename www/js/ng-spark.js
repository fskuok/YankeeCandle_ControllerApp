;(function(){
    'use strict';

    angular
        .module('ngSpark', [])
        .factory('$SparkCore', ['$http', function($http){
            var SparkCore = function(deviceID, accessToken, name){
                this.deviceID = deviceID;
                this.accessToken = accessToken;
                this.name = name;
            };

            // @para x2: String, Function
            // @para x1: Object { String: Function [,String: Function] [,...] }
            SparkCore.prototype.subscribe = function(name, handler) {
                var n;

                // if there is no event has been registered on this Spark
                if(!this.eventSource){
                    this.eventSource = new EventSource("https://api.spark.io/v1/devices/" + this.deviceID + "/events/?access_token=" + this.accessToken);

                    console.log('event source created on:', this.deviceID, this.accessToken);

                    this.subscribe('error', function(e){console.log(e)});
                }

                //if passed in event, register it
                if(typeof name === 'string'){

                    console.log('event registered:', name);

                    this.eventSource.addEventListener(name, handler, false);
                }

                //if passed in objects, dissemble them and call subscribe again
                else if(typeof name === 'object')
                    for (n in name){
                        if(name.hasOwnProperty(n)){
                            this.subscribe(n, name[n]);
                        }
                    }
                return this;
            };

            SparkCore.prototype.callFn = function(name, args, onSuccess, onError){

                var url = "https://api.spark.io/v1/devices/" + this.deviceID + "/" + name +
                    "?access_token=" + this.accessToken;

                $http.post( url ,  { "args": args })
                    .success(onSuccess || null)
                    // if specified a onError handler, use it
                    // otherwise, recall the readVariable method
                    .error(onError || function(data, status, headers, config) {
                        this.callFn(name, args, onSuccess, onError);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

                return this;
            };

            SparkCore.prototype.readVariable = function(name, onSuccess, onError){
                var url = "https://api.spark.io/v1/devices/" + this.deviceID + "/" + name +
                    "?access_token=" + this.accessToken;

                $http.get(url)
                    .success(onSuccess || null)
                    // if specified a onError handler, use it
                    // otherwise, recall the readVariable method
                    .error(onError || function(data, status, headers, config) {
                        this.readVariable(name, onSuccess, onError);
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                    });

                return this;
            };

            return SparkCore;
        }])
})();
