/**
 * PicController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var _ = require("underscore")._;
var async = require('async');
module.exports = {
    find: function(req, res){
        var qs = req.query;
        if (qs.q && qs.i) {
            console.log("qs.q", qs.q);
            console.log("qs.i", qs.i);
            var url = 'http://www.22mm.cc'+ qs.q + '-' + qs.i + '.html';
//            console.log("url", url);
            request(url, function (error, re, body) {
                if (!error && re.statusCode == 200) {
//        console.log("body:", body);
                    var $ = cheerio.load(body);
                    var div = $('#box-inner');
                    var strong = $('.diblcok').text();
                    var c = strong.indexOf('/');
                    strong = strong.substr(c+1);

                    var script = div.children()[2];
                    var src = $(script).text();

                    var a = src.lastIndexOf('=');
                    var b = src.lastIndexOf('\"');

                    var s = src.substring(a+2, b);
                    var s = s.replace('big', 'pic');
                    var total = strong;
                    res.json({src: s});
                }
            })
        } else {
            var url = 'http://www.22mm.cc' + qs.qs;
//            console.log("url", url);
//            console.log("*******************************");
            request(url, function (error, re, body) {
                if (!error && re.statusCode == 200) {
//        console.log("body:", body);
                    var $ = cheerio.load(body);
                    var div = $('#box-inner');
                    var strong = $('.diblcok').text();
                    var c = strong.indexOf('/');
                    strong = strong.substr(c+1);

                    var script = div.children()[2];
                    var src = $(script).text();
//        console.log("src", src);
                    var a = src.lastIndexOf('=');
                    var b = src.lastIndexOf('\"');

                    var s = src.substring(a+2, b);
                    var s = s.replace('big', 'pic');
                    var total = strong;
                    res.render('detail', {
                        total: total,
                        first: s,
                        url: qs.qs.replace('.html', '')
                    });
//                res.json({total: total, src: s});
                }
            })
        }

    },
    getRandomPage: function(req, res){
          res.render('random');
    },
    random: function(req, res){
        var url = [
            'http://www.22mm.cc/mm/qingliang/',
            'http://www.22mm.cc/mm/jingyan/',
            'http://www.22mm.cc/mm/bagua/',
            'http://www.22mm.cc/mm/suren/'
        ];
        var r1 = _.random(0, 3);
        var r2 = _.random(2, 25);
        var u = url[r1] + 'index_' + r2 + '.html';
        request(u, function (error, re, body) {
            if (!error && re.statusCode == 200) {
                var $ = cheerio.load(body);
                var li = $('li');
//                console.log("li.length:", li.length);
                var arr = [];
                li.each(function (index, ele) {
                    var text = $(this).text();
                    var src = $('img', this).attr('src');
                    var href = $('a', this).attr('href');
//                    console.log("href:", href);
                    var obj = {
                        src: src,
                        href: href,
                        text: text
                    };
                    arr.push(obj);
                });

//                res.json( _.last(arr, 32));
                var max = arr.length -1;
                var randomIndex = _.random(0, max);
                var firstUrl = 'http://www.22mm.cc' + arr[randomIndex].href;
//                var firstUrl = 'http://www.22mm.cc/mm/qingliang/aabage_bceaib.html';
                request(firstUrl, function (error, re, body) {
                    if (!error && re.statusCode == 200) {
//        console.log("body:", body);
                        var $ = cheerio.load(body);
                        var div = $('#box-inner');
                        var strong = $('.diblcok').text();
                        var c = strong.indexOf('/');
                        strong = strong.substr(c+1);
//                        console.log("strong", strong);
                        var script = div.children()[2];
                        var src = $(script).text();
//        console.log("src", src);
                        var a = src.lastIndexOf('=');
                        var b = src.lastIndexOf('\"');

                        var s = src.substring(a+2, b);
                        var s = s.replace('big', 'pic');
                        var total = parseInt(strong) + 1;
//                        console.log("total", total);
                        var firstPic = s;
//                        console.log("firstPic", firstPic);
                        firstUrl = firstUrl.replace('.html', '');
//                        console.log("firstUrl", firstUrl);
                        var array = [];
                        for (var v = 2; v < total; v++) {
                            array.push(firstUrl + "-" + v + ".html");
                        }
//                        console.log("array", array);
                        async.map(array, function(url, callback) {
//                            console.log("url", url);
                            request(url, function (error, res, body) {
                                if (!error && res.statusCode == 200) {
                                    var $ = cheerio.load(body);
                                    var div = $('#box-inner');
                                    var strong = $('.diblcok').text();
                                    var c = strong.indexOf('/');
                                    strong = strong.substr(c+1);
                                    var script = div.children()[2];
                                    var src = $(script).text();
                                    var a = src.lastIndexOf('=');
                                    var b = src.lastIndexOf('\"');
                                    var s = src.substring(a+2, b);
                                    var s = s.replace('big', 'pic');
                                    var total = strong;
                                    callback(null, s);
                                }
                            });
                        }, function(err,results) {
//                            console.log("err", err);
//                            console.log("results", results);
                            results.push(firstPic);
                            res.json(results);

                        });


                    }
                })
            }
        })
    }

  
};
