'use strict';
angular.module('Test').controller('AlbumController', ['$scope', '$stateParams', 'dataService', '$state',
    function ($scope, $stateParams, dataService, $state) {

       
        $scope.back = function () {

            $state.go('dashboard');
        }
        $scope.album = {};
        dataService.getAlbum($stateParams.id).then(function (data) {
            $scope.album = data;
        })

        $scope.playClick = function (e) {
            e.preventDefault();
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            
            $scope.win.open();
            $scope.win.$angular_scope.video = dataItem.url;
            $scope.$apply()
        }

        $scope.playClose = function () {
            $scope.win.$angular_scope.video = 'empty.html';
            
        }


        $scope.options = {
            toolbar: ["add"],
            width: 150,
            height: 650,
            columns: [{ field: "songName", title: "Name", width: "100px" },
            { field: "url", title: "Url", width: "200px" },
            
            {
                command: [{ text: "play", click: $scope.playClick },
                    "edit", "destroy"],
                title: " ",
                width: "200px"
            }],
            dataSource: {
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                pageSize: 10,
                schema: {
                    data: "Data",
                    total: "Total",
                    model: {
                        id: "id",
                        fields: {
                            songName: { editable: true, type: "string" },
                            url: { editable: true, type: "string" },
                            albumId: { editable: false, type: "number" }
                        }
                    }
                },
                error: function (e) {
                    var msg = e.xhr.responseText;
                    $scope.savedSuccessfully = false;
                    $scope.message = msg;
                },
                transport: {
                    read: function (options) {
                        dataService.getSongs($stateParams.id, options.data).then(function (data) {
                            options.success(data);
                        })

                    },
                    create: function (options) {
                        options.data.albumId = $stateParams.id;
                        dataService.addSong(options.data).then(function (data) {
                            options.success(data);
                        })

                    },
                    update: function (options) {
                        dataService.editSong(options.data).then(function (data) {
                            options.success(data);
                        })

                    },
                    destroy: function (options) {
                        dataService.delDel(options.data).then(function (data) {
                            options.success(data);
                        })
                    },
                    parameterMap: function (data, operation) {
                        return JSON.stringify(data);
                    },
                }
            },

            pageable: true,
            sortable: true,
            filterable: true,
            editable: "inline",
        };
    }]);