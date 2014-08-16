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
module.exports = {
    find: function(req, res){
        var qs = req.query;
        if (qs.q && qs.i) {
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

    }

  
};
