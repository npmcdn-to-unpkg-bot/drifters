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
});

