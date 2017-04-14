

(function () {
    'use strict';

    angular.module('myra').controller('HomeController', HomeController);

    HomeController.$inject = ['Authentication'];
    
    function HomeController(Authentication) {
        var vm = this;
        vm.user = Authentication.user;
        vm.toggle = toggle;

        function toggle() {
            $(".navbar").slideToggle();
        }
    }

})();