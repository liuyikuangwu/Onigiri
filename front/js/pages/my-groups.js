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

                //let grpStatus = this.arrayOfSelectedDishIds = page.query.arrayOfSelectedDishIds || this.arrayOfSelectedDishIds;
                console.log(page.query + "567");
                //console.log("result.groupedOrderSums:"+JSON.stringify(result.groupedOrders));

                $$('.btn-contact-merchant').click(function () {
                     window.location.href = 'tel:' + $$(this).data('met-phone');
                });

                $$('.btn-group-detail').click(function () {
                    let grpNextStatus = $$(this).dataset().grpNextStatus;
                    //TODO reopen
                    //if nextStatus===4 => group-setting /w  option:query {Group}

                    let grpId = $$(this).dataset().grpId;

                    if(Number(grpNextStatus) ===4){
                        //Get group

                        let group = result.groupedOrderSums.find(obj=>obj.group.grpId===Number(grpId)).group;
                        mainView.router.load({
                            url:'group-setting.html',
                            query:{group}
                        });

                        return;
                    }


                    console.log("grpNextStatus",grpNextStatus);
                    ajaxMethod.updateGroupStatusPromise(grpId,grpNextStatus).then(result=>{
                        mainView.router.refreshPage();
                    });

                });

                $$('.btn-product-detail').click(function () {
                    //product 抓到orders的  usrId 、dish.dihPrice、ordNum
                    // let product = result.groupedOrders.find(obj=>obj.group.grpId===grpId);
                    // console.log(JSON.stringify(product));
                    
                    //TODO deliver product to product-detail.js
                    mainView.router.load({
                        url:'proudct-detail.html'
                    });
                });

            });

        });
    }

}

module.exports = MyGroups;////TODO third
//TODO fourth : 加入到Main.js里面注册bind方法