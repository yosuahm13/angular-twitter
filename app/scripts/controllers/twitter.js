angular.module("angularApp")
	.controller("twitterCtrl", function($scope, twitterService){
		var scope = $scope;
		scope.tweets = [];
		scope.allTweets = [];
		scope.connectedTwitter = false; 
		twitterService.initialize(); // initialize oauth
		
		scope.totalTweet = 0;
		scope.currentPage = 1;		

		scope.pageChanged = function(){
			console.log(scope.currentPage);
			scope.tweets = [];
			var count = scope.currentPage * 10;
			var base = (scope.currentPage - 1) * 10;
			var iter = 0;
			if(scope.totalTweet - count >= 0){
				iter = 10;
			}else{
				iter = scope.totalTweet - count + 10;
			}
			for(i=0; i<iter;i++){
				scope.tweets.push(scope.allTweets[base+i].text);
			}
		}

		scope.getLatestTweets = function(){
			twitterService.getUser().then(function(value){
				scope.data = value;
				if (value.statuses_count <= 200){
					scope.totalTweet = value.statuses_count;
				} else {
					scope.totalTweet = 200;
				}

				twitterService.getLatestTweets(scope.totalTweet).then(function(value){
					scope.allTweets = value;							
					scope.pageChanged();
				});						
			});			
		}

		scope.connect = function(){
			twitterService.connectTwitter().then(function(){
				if(twitterService.isReady()){					
					scope.getLatestTweets();
					$('#connect').fadeOut(function(){
						$('#disconnect, #info-area, #tweet-area').fadeIn()
					});	                
	                scope.connectedTwitter = true;
				}
			})
		}

		scope.disconnect = function() {
	        twitterService.clearCache();
	        scope.tweets.length = 0;
	        $('#disconnect, #info-area, #tweet-area').fadeOut(function() {
	            $('#connect').fadeIn();
	            scope.$apply(function() {
	                scope.connectedTwitter = false;
	            })
	        });
	    }

	    scope.updateStatus = function(){
	    	twitterService.postStatusUpdate(scope.status);
	    	scope.getLatestTweets();
	    	scope.status = "";
	    }
	});