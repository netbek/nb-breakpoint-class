/**
 * Breakpoint class directive
 *
 * @author Hein Bekker <hein@netbek.co.za>
 * @copyright (c) 2015 Hein Bekker
 * @license http://www.gnu.org/licenses/agpl-3.0.txt AGPLv3
 */

(function (window, angular, undefined) {
	'use strict';

	angular
		.module('nb.breakpointClass')
		.directive('nbBreakpointClass', nbBreakpointClassDirective);

	nbBreakpointClassDirective.$inject = ['$window', '_'];
	function nbBreakpointClassDirective ($window, _) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var $$window = angular.element($window);
				var classNames;

				function resize (apply) {
					var add = [], remove = [];

					angular.forEach(classNames, function (mq, className) {
						if ($window.matchMedia(mq).matches) {
							add.push(className);
						}
						else {
							remove.push(className);
						}
					});

					if (add.length || remove.length) {
						if (add.length) {
							element.addClass(add.join(' '));
						}
						if (remove.length) {
							element.removeClass(remove.join(' '));
						}
						if (apply) {
							scope.$apply();
						}
					}
				}

				attrs.$observe('nbBreakpointClass', function (rawValue) {
					if (rawValue) {
						var value = scope.$eval(rawValue);

						if (angular.isObject(value)) {
							classNames = value;
							resize(false);
						}
					}
				});

				var onWindowResize = _.throttle(function () {
					resize(true);
				}, 60);

				$$window.on('resize', onWindowResize);

				scope.$on('$destroy', function () {
					$$window.off('resize', onWindowResize);
				});
			}
		};
	}
})(window, window.angular);
