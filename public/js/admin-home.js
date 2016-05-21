var $grid = $('.grid');
$grid.on( 'click', 'a .fa-thumb-tack', function() {
	var removeItem = $(this).parents()[2];
	var email = ($($(this).closest('.card').children()[3]).children('span.email')).text();

	$.ajax({
		url: '/stage',
		type: 'POST',
		data: {'email' : email, 'status': 'staged'},
		success: function(result){
			if(result == 'noproblem'){
				$grid.masonry( 'remove', $(removeItem)).masonry('layout');
			}else{
                    //Noooooooo
                }
            }

        });

	return false;
});

$grid.on( 'click', 'a .fa-undo', function() {
	var removeItem = $(this).parents()[2];
	var email = ($($(this).closest('.card').children()[3]).children('span.email')).text();

	$.ajax({
		url: '/stage',
		type: 'POST',
		data: {'email' : email, 'status': 'fresh'},
		success: function(result){
			if(result == 'noproblem'){
				$grid.masonry( 'remove', $(removeItem)).masonry('layout');
			}else{
                    //Noooooooo
                }
            }

        });

	return false;
});
