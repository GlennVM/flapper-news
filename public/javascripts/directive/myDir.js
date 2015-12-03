angular.module('myDir', [])
	.directive('titel', function(){
		return{
			restrict: 'E',
			template: "<span>{{post.title}}</span>",
			replace: true,
			scope:{
				post: '='
			}
		};
	});