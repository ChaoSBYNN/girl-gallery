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
    getIndexPage: function(req, res){
      res.render('home/index');
    },
    getPic: function(req, res){
        var url = [
            'http://www.22mm.cc/mm/qingliang/',
            'http://www.22mm.cc/mm/jingyan/',
            'http://www.22mm.cc/mm/bagua/',
            'http://www.22mm.cc/mm/suren/'
        ];
        var r1 = _.random(0, 3);
        var r2 = _.random(2, 25);
        var u = url[r1] + 'index_' + r2 + '.html';
//        console.log("random", r1);
//        console.log("random2", r2);
        console.log("u", u);
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
                console.log("arr", arr);
                res.json( _.last(arr, 32));

            }
        })
    }

  
};
