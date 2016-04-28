'use strict';
/**
 * Created by Zizy on 4/6/16.
 */
let ajaxMethod = require('../ajaxMethods.js');
let $$ = Dom7;
let myApp = null, mainView = null;
let tool = require('../tool.js');
let cookies = require('js-cookie');


class MyGroups { //TODO first
    constructor(_myApp, _mainView) {
        myApp = _myApp;
        mainView = _mainView;

    }

    bind() {

        myApp.onPageBeforeInit('my-groups', function (page) {//TODO second
            let hostId = cookies.getJSON('user').usrId;
            tool.loadTemplateFromJsonPromise(myApp, ajaxMethod.getGroupedOrdersAndSumsByHostIdPromise(hostId), page, function (result) {
                $$('.btn-contact-merchant').click(function () {

                    window.location.href = 'tel:'+$$(this).data('met-phone');
                });
            });

        });
    }

}

module.exports = MyGroups;////TODO third
//TODO fourth : 加入到Main.js里面注册bind方法