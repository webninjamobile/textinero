'use strict';

// Chats controller
angular.module('chats').controller('ChatsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Chats',
    function ($scope, $stateParams, $location, Authentication, Chats) {
        $scope.authentication = Authentication;

        $scope.glued = true;
        $scope.messages = [
            {
                'username': 'username1',
                'content': 'Hi!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            },
            {
                'username': 'username2',
                'content': 'Hello!'
            }
        ];

        $scope.username = Authentication.user.username;

        $scope.sendMessage = function (message) {
            if (message && message !== '') {
                $scope.messages.push({
                    'username': Authentication.user.username,
                    'content': message
                });
                $cop
            }
        };


    }
]);
