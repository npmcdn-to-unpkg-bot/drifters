$(document).ready(function() {

	var x = 1;
	$('#add-url').click(function() {
            $('<input type="text" class="form-control" id="blog-url" name="blog-url" placeholder="Paste a URL">').hide().insertBefore(this).fadeIn();
            $(this).hide().text("Add Another").fadeIn();
            x++;   
            if(x == 4){
            	$(this).hide();
            } 
            return false; //Don't move the page
    });

    listTicker({
        list: textlist ,
        startIndex:0,
        trickerPanel: $('#sentences'),
        interval: 4 * 1000,
    });

});

var textlist = new Array("This one is for the gypsies and the freaks, the weirdos & the misfits, the rebels out in the open and the ones in hiding....", 
    "....put together by some like spirited oddities, who hold a different day job, but are too obnoxious to merely exist in it.", 
    "So screw your friends and your partners, who were either too lazy, too zombified or too chickened by the idea of a trip of a lifetime....",
    '....you trusted their "soon one day" and "next year" way too long, pack your bags, feed the dog, say goodbyes and ride along.');

var listTicker = function(options) {

    var defaults = {
        list: [],
        startIndex:0,
        interval: 3 * 1000,
    }   
    var options = $.extend(defaults, options);

    var listTickerInner = function(index) {

        if (options.list.length == 0) return;

        if (!index || index < 0 || index > options.list.length) index = 0;

        var value= options.list[index];

        options.trickerPanel.fadeOut(function() {
            $(this).html(value).fadeIn();
        });

        var nextIndex = (index + 1) % options.list.length;

        setTimeout(function() {
            listTickerInner(nextIndex);
        }, options.interval);

    };

    listTickerInner(options.startIndex);
}

