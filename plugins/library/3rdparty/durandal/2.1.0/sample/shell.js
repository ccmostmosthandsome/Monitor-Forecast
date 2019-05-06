define(['plugins/router'], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
                { route: ['', 'home'],                          moduleId: 'library/3rdparty/durandal/2.1.0/sample/hello/index',                title: 'Hello World',           nav: 1 },
                { route: 'view-composition',                    moduleId: 'library/3rdparty/durandal/2.1.0/sample/viewComposition/index',      title: 'View Composition',      nav: true },
                { route: 'modal',                               moduleId: 'library/3rdparty/durandal/2.1.0/sample/modal/index',                title: 'Modal Dialogs',         nav: 3 },
                { route: 'event-aggregator',                    moduleId: 'library/3rdparty/durandal/2.1.0/sample/eventAggregator/index',      title: 'Events',                nav: 2 },
                { route: 'widgets',                             moduleId: 'library/3rdparty/durandal/2.1.0/sample/widgets/index',              title: 'Widgets',               nav: true },
                { route: 'master-detail',                       moduleId: 'library/3rdparty/durandal/2.1.0/sample/masterDetail/index',         title: 'Master Detail',         nav: true },
                { route: 'knockout-samples*details',            moduleId: 'library/3rdparty/durandal/2.1.0/sample/ko/index',                   title: 'Knockout Samples',      nav: true },
                { route: 'keyed-master-details/:id*details',    moduleId: 'library/3rdparty/durandal/2.1.0/sample/keyedMasterDetail/master',   title: 'Keyed Master Detail',   hash: '#keyed-master-details/:id' }
            ]).buildNavigationModel()
              .mapUnknownRoutes('library/3rdparty/durandal/2.1.0/sample/hello/index', 'not-found')
              .activate();
        }
    };
});