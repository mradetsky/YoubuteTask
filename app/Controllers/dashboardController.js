/* Firm Setup page controller */
angular.module('Test').controller('DashboardController',
    ['$scope', 'dataService', '$state',
        function ($scope, dataService, $state) {
    

    
        $scope.detailsClick = function (e) {
            var dataItem = this.dataItem($(e.currentTarget).closest("tr"));
            $state.go('album', { id: dataItem.id });
        }

   

    $scope.options = {
        toolbar: ["add"],
        width: 150,
        height: 650,
        columns: [{ field: "albumName", title: "Name", width: "100px" },
            { field: "albumDesc", title: "Description", width: "200px" },
            { field: "count", title: "Songs count", width: "50px" },
            {
                command: [{ text: "details", click: $scope.detailsClick },
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
                        albumName: { editable: true, type: "string" },
                        albumDesc: { editable: true, type: "string" },
                        count: { editable: false, type: "number" }
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
                    dataService.getAlbums(options.data).then(function (data) {
                        options.success(data);
                    })

                },
                update: function (options) {
                    dataService.editAlbum(options.data).then(function (data) {
                        options.success(data);
                    })

                },
                create: function (options) {
                    dataService.addAlbum(options.data).then(function (data) {
                        options.success(data);
                    })

                },
                destroy: function(options){
                    dataService.delAlbum(options.data).then(function (data) {
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
