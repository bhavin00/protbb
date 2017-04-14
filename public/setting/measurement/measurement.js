﻿

(function () {
    'use strict';

    angular.module('myra').controller('MeasurementController', MeasurementController);

    MeasurementController.$inject = ['Restangular', '$state', 'SweetAlert','$stateParams'];

    function MeasurementController(Restangular, $state, SweetAlert, $stateParams) {
        var vm = this;
        vm.list = [];
        vm.save = save;
        vm.edit = edit;
        vm.getList = getList;
        vm.search = search;
        vm.order = order;
        vm.pageChange = pageChange;
        vm.options = {
            pagesize: 10,
            totalItems: 0,
            page: 1,
            search: ''
        }
        vm.measurement = {
            isActive: true
        };
       
        if ($stateParams.id && $stateParams.id != 'new') {
            Restangular.one('api/measurement/' + $stateParams.id).get().then(function (res) {
                vm.measurement = res.data;
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
            });
        }

        function edit(obj) {
            $state.go('secure.setting.edit-measurement', { id: obj.id });
        }

        function save(form) {
            if (form.$invalid) {
                _.forEach(form.$error.required, function (frm) {
                    frm.$setDirty();
                });
                vm.isSubmitted = true;
                return;
            }
            vm.startProcessing = true;
            if (!vm.measurement.id) {
                Restangular.all('api/measurement').post(vm.measurement).then(function (res) {
                    SweetAlert.swal("Measurement saved successfully!");
                    $state.go('secure.setting.measurement');
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
            else {
                Restangular.one('api/measurement/' + vm.measurement.id).patch(vm.measurement).then(function (res) {
                    SweetAlert.swal("Measurement updated successfully!");
                    $state.go('secure.setting.measurement');
                }, function (err) {
                    console.log(err);
                    vm.error = err.data.message;
                    vm.startProcessing = false;
                });
            }
        }

        function getList() {
            Restangular.all('api/measurement').getList(vm.options).then(function (res) {
                vm.list = res.data;
                vm.options.totalItems = parseInt(res.headers('total'));
            }, function (err) {
                console.log(err);
                vm.error = err.data.message;
            });
        }

        function pageChange() {
            getList();
        }
        function search() {
            vm.options.page = 1;
            vm.options.where = 'title;$like|s|%' + vm.options.search + '%';
            getList();
        }

        function order(col, ord) {

            vm.asc = !vm.asc;
            var ascL = vm.asc ? 'asc' : 'desc';
            vm.options.sort = col + ' ' + ascL;
            vm.options.page = 1;
            getList();
        }
        
    }

})();