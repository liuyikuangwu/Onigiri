'use strict';
/**
 * Created by Zizy on 4/6/16.
 */
let ajaxMethod = require('../ajaxMethods.js');
let $$ = Dom7;
let myApp = null, mainView = null;
let tool = require('../tool.js');
let home = require('./home.js');
var SHA256 = require("crypto-js/sha256");

const Public = require('../public.js');
const cookies = require('js-cookie');
window.comments = "";

let homejschange = new home();
class IndexPage {
    constructor(_myApp, _mainView) {
        myApp = _myApp;
        mainView = _mainView;

    }

    bind() {
        $$(document).on('DOMContentLoaded', function () {

            // var json={time:new Date().getTime()};
            // window.history.replaceState("#");
            // window.history.pushState(json,"","/Onigiri/front/html/index.html");
            // window.history.pushState(json,"","#");

            //控制返回鍵
            // window.location.hash = "no-back-button";
            // window.location.hash = "Again-No-back-button";//again because google chrome don't insert first hash into history
            // window.onhashchange = function () {
            //     window.location.hash = "no-back-button";
            // };

            //新版返回點
            window.location.hash = "#index";
            var hash = window.location.hash;
            setInterval(function () {
                if(window.location.hash==='#home'){
                    window.location.hash = "#no-back-button";
                    return;
                }
                if (window.location.hash != hash) {
                    hash = window.location.hash;
                    $$('.icon-back').click();
                    // alert("User went back or forward to application state represented by " + hash);
                }
            }, 100);

            if (!!cookies.getJSON('user') && cookies.get('usrPwdSha')) {

                $$('#floatLabelName').addClass('not-empty-state');
                $$('#floatLabelPwd').addClass('not-empty-state');
                $$('#txtUsrName').addClass('not-empty-state').parent().css('background', '#fff !important');
                $$('#txtUsrPwd').addClass('not-empty-state').parent().css('background', '#fff !important');

                $$('#txtUsrName').val(cookies.getJSON('user').usrName);
                $$('#txtUsrPwd').val(cookies.get('usrPwdSha'));
                //自動登入
                setTimeout(()=>$$('#btn-login').click(), 100);
            }

            $$('#btnCreateGroup').click(function () {
                window.location.hash = "#how-to-create";

                mainView.router.loadPage({url: './html/how-to-create.html'});
            });

            $$('#btnMyGroups').click(function () {
                window.location.hash = "#my-groups";

                mainView.router.loadPage({url: './html/my-groups.html'});
            });

            $$('#btnConfirm').click(function () {
                window.location.hash = "#confirm-order";

                mainView.router.loadPage({url: './html/confirm-order.html'});
            });

            $$('#txtUsrName').on('focus', function () {
                $$('.usrName').css('color', 'white !important');
                setTimeout(()=>$$('.login-screen-content').scrollTop(1000), 500);
            });

            $$('#txtUsrPwd').on('click', function () {
                setTimeout(()=>$$('.login-screen-content').scrollTop(1000), 500);
            });

            $$('#btn-sign-up').click(function () {
                window.location.hash = "#sign-up";
                myApp.closeModal();
                mainView.router.loadPage({url: './html/sign-up.html'});
            });

            $$('#txtUsrPwd').on('keyup', function () {
                cookies.remove('usrPwdSha');
            });

            $$('#btn-login').click(function () {

                let usrName = $$('#txtUsrName').val();


                //let usrPwd = $$('#txtUsrPwd').val();
                let usrPwdSha = cookies.get('usrPwdSha');

                ajaxMethod.userAuth(usrName, usrPwdSha ? usrPwdSha : SHA256($$('#txtUsrPwd').val()).toString()).then(function (result) {

                    cookies.set('user', result.user);
                    if (!usrPwdSha) {
                        cookies.set('usrPwdSha', SHA256($$('#txtUsrPwd').val()).toString());
                    }
                    window.location.hash = "#home";
                    myApp.closeModal();
                    tool.loadPage('./html/home.html', mainView, ajaxMethod.getHomePageDataPromise(result.user.usrId));
                    //mainView.router.loadPage({url: 'home.html'});
                }).catch(function (e) {
                    myApp.alert('登入失敗:' + e);
                });

            });

            $$('#tabNearGroups').click(function () {
                window.location.hash = "#tabNearGroups";
                homejschange.changeTabGroup();
            });
            $$('#tabOrders').click(function () {
                window.location.hash = "#tabOrders";
                homejschange.changeTabOrder();
                //changeTabGroup();
            });
            $$('#btnSend').click(function () {
                window.comments = $$('#comments').val();
                $$('#comments').val("");
            });

            $$('#btnLogout').click(function () {
                // cookies.remove('user');
                cookies.remove('usrPwdSha');
                location.reload();
                // $$('#txtUsrPwd').val("");
            });

            $$('#btnsetting').click(function () {
                window.location.hash = "#user-modify";
                mainView.router.loadPage({url: 'user-modify.html'});
            });

        });


    }

}

module.exports = IndexPage;
