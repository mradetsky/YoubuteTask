


var test = angular.module("Test", [
    "ui.router",
    "oc.lazyLoad",
    "ngSanitize",
    'kendo.directives'
    //'angular-ui'

]);

test.filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
test.config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        // global configs go here
    });
}]);

//AngularJS v1.3.x workaround for old style controller declarition in HTML
test.config(['$controllerProvider', function ($controllerProvider) {
    // this option might be handy for migrating old apps, but please don't use it
    // in new ones!
    $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/




/* Setup Rounting For All Pages */
test.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("/dashboard.html");

    $stateProvider

        // Dashboard
        .state('dashboard', {
            url: "/dashboard.html",
            templateUrl: "/app/views/dashboard.html",
            data: { pageTitle: 'Admin Dashboard Template' },
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'Test',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/services/dataService.js',
                            'app/controllers/dashboardController.js',
                        ]
                    });
                }]
            }
        })
        .state('album', {
            url: "/album/:id",
            templateUrl: "/app/views/album.html",
            data: { pageTitle: 'Album' },
            controller: "AlbumController",
            resolve: {
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'Test',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
                        files: [
                            'app/controllers/AlbumController.js',
                            'app/services/dataService.js',

                        ]
                    });
                }]
            }
        })

}]);
