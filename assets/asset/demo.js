
$(function () {
    'use strict';

    // Load demo images from flickr:
    $.getJSON('/pic/getPic', function(result){
        console.log("result", result);
        var linksContainer = $('#links'),
            baseUrl;
        // Add the demo images as links with thumbnails to the page:
        $.each(result, function (index, photo) {
            $('<a style="margin: 3px;" target="_blank"/>')
                .append($('<img>').prop('src', photo.src))
                .prop('href', '/detail?qs=' + photo.href)
                .prop('title', photo.text)
                .attr('data-gallery', '')
                .appendTo(linksContainer);
        });
    })
});
