'use strict';
/**
 * Created by Zizy on 4/6/16.
 */
let ajaxMethod = require('../ajaxMethods.js');
let $$ = Dom7;
let myApp = null, mainView = null;
let tool = require('../tool.js');
const cookies = require('js-cookie');
let Vue = require('vue');
let _ = require('lodash');


class Home { //TODO first
    constructor(_myApp, _mainView) {
        myApp = _myApp;
        mainView = _mainView;

    }

    bind() {
        let that = this;
        myApp.onPageBeforeInit('home', function (page) {//TODO second


            if (page.query.ajaxResult) {
                window.homeAjaxResult = page.query.ajaxResult;
            } else {
                page.query.ajaxResult = window.homeAjaxResult;
            }

             // console.log('page.query.ajaxResult in homejs', page.query.ajaxResult);
             // console.log('page.query.ajaxResult. page.query.ajaxResult', JSON.stringify(page.query.ajaxResult));

            // console.log('page.query.ajaxResult.groups', page.query.ajaxResult.groups);
            //console.log('page.query.ajaxResult.groups test', JSON.stringify(page.query.ajaxResult.groups));



            window.vueGroups = new Vue({
                el: '#tabGroups',
                data: page.query.ajaxResult,
            });


            window.vueMyOrders = new Vue({
                el: '#tabMyOrders',
                data: page.query.ajaxResult,
                methods: {
                    extraOrder: function (grpId) {
                        window.selectedGroupId = grpId;
                        tool.loadPage({
                            url: 'order.html',
                            query: {isExtraOrder: true}
                        }, mainView, ajaxMethod.getGroupById(grpId));
                    }
                }

            });

            window.vuePopoverFilter = new Vue({
                el: '#popoverFilter',
                computed: {
                    merchantTypes: function () {
                        return _.chain(page.query.ajaxResult.groups.map(o=>o.merchant.metType)).uniq().value();
                    }
                },
                methods: {
                    filter: function (typeName) {
                        window.vueGroups.groups = _.cloneDeep(window.vueGroups.groups).map(o=> _.assign({}, o, o.hidden = o.merchant.metType === typeName ? false : true));

                    },
                    allTypes: function () {
                        window.vueGroups.groups = _.cloneDeep(window.vueGroups.groups).map(o=> _.assign({}, o, o.hidden = false));
                    }
                }


            });

            window.vuePopoverOrder = new Vue({
                el: "#popoverOrder",
                methods: {
                    popNewGroup: function () {
                        window.vueGroups.$set('groups', _.sortBy(window.homeAjaxResult.groups, row=>-Number(new Date(row.grpCreateTime).getTime())));
                        myApp.closeModal(this.el);
                    },
                    popCloseDeadline: function () {
                        window.vueGroups.$set('groups', _.sortBy(window.homeAjaxResult.groups, row=>Number(new Date(row.grpTime).getTime())));
                        myApp.closeModal(this.el);
                    },
                    popFarDeadline: function () {
                        window.vueGroups.$set('groups', _.sortBy(window.homeAjaxResult.groups, row=>-Number(new Date(row.grpTime).getTime())));
                        myApp.closeModal(this.el);
                    },
                    popOldGroup: function () {
                        window.vueGroups.$set('groups', _.sortBy(window.homeAjaxResult.groups, row=>Number(new Date(row.grpCreateTime).getTime())));
                        myApp.closeModal(this.el);
                    }                },
                ready: function () {
                    console.log('vueMyOrders created', window.homeAjaxResult);

                }

            });

            $$('.btn-join-in-group-page').on('click', function () {

                let grpId = $$(this).dataset().grpId;
                console.log(`grpId   : ${grpId}`);

                cookies.set('selectedGroupId', grpId);


                tool.loadPage(`order.html?grpId=${grpId}`, mainView, ajaxMethod.getGroupById(grpId));


            });


            $$('.js-btn-contact-host').click(function () {
                window.location.href = 'tel:' + $$(this).data('grp-host-mobi');
            });

            $$('.btn-group-detail').on('click', function () {

                let grpId = $$(this).dataset().grpId;
                console.log(`grpId : ${grpId}`);

                cookies.set('selectedGroupId', grpId);

                mainView.router.loadPage(`group-detail.html?grpId=${grpId}`);

            });
            $$('.card-img').on('click', function () {

                let grpId = $$(this).dataset().grpId;
                console.log(`grpId : ${grpId}`);

                cookies.set('selectedGroupId', grpId);

                mainView.router.loadPage(`group-detail.html?grpId=${grpId}`);
            });
            $$('.orderDetail').on('click', function () {

                let grpId = $$(this).dataset().grpId;
                mainView.router.loadPage({url: `order-detail.html?grpId=${grpId}`});

            });

        });

    }

    changeTabGroup() {
        //console.log("asdfasdfas");
        myApp.showTab("#tabGroups");

    }

    changeTabOrder() {
        myApp.showTab('#tabMyOrders');
    }
}


module.exports = Home;////TODO third
//TODO fourth : 加入到Main.js里面注册bind方法