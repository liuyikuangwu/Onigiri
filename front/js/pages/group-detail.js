/**
 * Created by Zizy on 4/6/16.
 */
let ajaxMethod = require('../ajaxMethods.js');
let $$ = Dom7;
let myApp = null,mainView=null;
let tool = require('../tool.js');

class GroupDetailPage {
    constructor(_myApp, _mainView) {
        myApp = _myApp;
        mainView = _mainView;

    }

    bind() {


        myApp.onPageBeforeInit('group-detail', (page) => {
            this.metId = this.metId || page.query.metId;

            console.log('group-detail onPageBeforeInit');
            console.log(page.query);

            $$('#btnJoin').on('click', function () {
                mainView.router.loadPage('order.html');
            });
        });

        myApp.onPageInit('group-detail', (page) => {

            console.log('group-detail Init');
        });
    }

}

module.exports = GroupDetailPage;