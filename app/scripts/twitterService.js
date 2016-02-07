'use strict';

angular.module('angularApp')
	.service('twitterService', function ($q){
		var authorizationResult = false;

	    return {
	        initialize: function() {	            
	            OAuth.initialize('wPQ_lvjRUxFWbxIBxMqIZ2MVxnE', {cache:true});	            
	            authorizationResult = OAuth.create('twitter');
	        },
	        isReady: function() {
	            return (authorizationResult);
	        },
	        connectTwitter: function() {
	            var deferred = $q.defer();
	            OAuth.popup('twitter', {cache:false}, function(error, result) {
	                if (!error) {
	                    authorizationResult = result;
	                    deferred.resolve();
	                }
	            });
	            return deferred.promise;
	        },
	        clearCache: function() {
	            OAuth.clearCache('twitter');
	            authorizationResult = false;
	        },
	        getLatestTweets: function (count) {	            
	            var deferred = $q.defer();
	      			var url='/1.1/statuses/user_timeline.json';
	      			if(count){
	      				url+='?count='+count;
	      			}
	            var promise = authorizationResult.get(url).done(function(data) { 	                
					        deferred.resolve(data);
	            }).fail(function(err) {	               
	                deferred.reject(err);
	            });	            
	            return deferred.promise;
	        },
	        getUser: function() {
	        	var deferred = $q.defer();
	        	var url = '/1.1/account/verify_credentials.json';
	        	var promise = authorizationResult.get(url)
	        	.done(function(data){
	        		deferred.resolve(data);
	        	})
	        	.fail(function(err){
	        		deferred.reject(err);
	        	});
	        	return deferred.promise;
	        },
	        postStatusUpdate: function(status){
	        	var deferred = $q.defer();
	        	var url = '/1.1/statuses/update.json?status='+status;
	        	var promise = authorizationResult.post(url)
	        	.done(function(data){
	        		deferred.resolve(data);
	        	})
	        	.fail(function(err){
	        		deferred.reject(err);
	        	});
	        	return deferred.promise;
	        }
	    }
	})