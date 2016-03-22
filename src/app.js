'use strict';

angular.module('crm-web', ['ngMaterial', 'ngMessages']).controller('MainCtrl', ['$http', '$mdToast', '$scope', function ($http, $mdToast, $scope) {

        /* --- MODELS --- */

        $scope.baseURL = 'http://api.hcrcandco.com/';
        $scope.customer = {};
        $scope.feedback = {};
        $scope.nascent = false;

        var date = new Date();
        $scope.minDate = new Date(date.getFullYear() - 100, date.getMonth(), date.getDate());
        $scope.maxDate = new Date(date.getFullYear() - 10, date.getMonth(), date.getDate());

        /* --- FUNCTIONS --- */

        $scope.initialize = function () {

            $scope.customer = {
                firstName: '',
                lastName: '',
                birthday: new Date(date.getFullYear() - 30, date.getMonth(), date.getDate()),
                phone: null
            };

            $scope.feedback = {
                isSatisfied: true,
                message: ''
            };

        };

        $scope.getCustomer = function () {

            if ($scope.customer.phone) {

                $scope.nascent = true;

                $http.get($scope.baseURL + 'customer', {params: {phone: $scope.customer.phone}}).then(function (response) {

                    if (response && response.status === 200 && response.data.length === 1) {

                        var customer = response.data[0];

                        $mdToast.show($mdToast.simple().textContent('Hi ' + customer.firstName + '!').position('top right'));

                        var tzOffset = (new Date()).getTimezoneOffset() * 60000;

                        $scope.customer = {
                            firstName: customer.firstName,
                            lastName: customer.lastName,
                            birthday: new Date(new Date(customer.birthday) - tzOffset),
                            phone: $scope.customer.phone
                        };

                    } else {

                        $scope.customer = {
                            firstName: '',
                            lastName: '',
                            birthday: new Date(date.getFullYear() - 30, date.getMonth(), date.getDate()),
                            phone: $scope.customer.phone
                        };

                    }

                    $scope.nascent = false;

                }, function () {
                    $scope.nascent = false;
                });

            }

        };

        $scope.submitFeedback = function () {

            $scope.nascent = true;

            var data = {
                customer: angular.copy($scope.customer),
                feedback: angular.copy($scope.feedback)
            };

            $http.post($scope.baseURL + 'submit-feedback', data).then(function (response) {

                if (response && response.status === 200) {

                    // Notify
                    $mdToast.show($mdToast.simple().textContent('Your feedback was saved. Thanks!').position('top right'));

                    // Reset form
                    $scope.initialize();
                    $scope.feedbackForm.$setUntouched();

                } else {

                    // Notify
                    $mdToast.show($mdToast.simple().textContent('Sorry, the feedback could not be saved.').position('top right'));

                }

                $scope.nascent = false;

            }, function () {

                // Notify
                $mdToast.show($mdToast.simple().textContent('Sorry. The feedback could not be saved.').position('top right'));

                $scope.nascent = false;

            });

        };

        /* --- RUN --- */

        $scope.initialize();

    }]);