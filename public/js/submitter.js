var allow = false;
$('#form-outer').submit(function() {
	var v = grecaptcha.getResponse();
	if(v.length == 0 || !allow)
    {	      

    }else{
    	$.ajax({
                url: this.action,
                type: this.method,
                data: $(this).serialize(),
                success: function (result) {
                    if(result == 'success'){
                    	$('#inputName').attr('disabled', true);
                    	$('#inputEmail').attr('disabled', true);
                    	$('#inputPhone').attr('disabled', true);
                    	$('#inputWhy').attr('disabled', true);
                    	$('#blog-url').attr('disabled', true);
                    	$('#rc-imageselect').hide();
                    	$('#add-url').hide();
                    	$('#submit').hide().replaceWith("<div class='text-muted'>Welcome aboard. <br>We will mail you soon if you are selected.</div>");
                    	$('#submit').fadeIn();
                    }
                }
        });
    }
    return false;
});
$('#inputEmail').blur(function(){
        $.ajax({
            url: '/checkmail',
            type: 'POST',
            data: {'email' : $('#inputEmail').val()},
            success: function(result){
                if(result == 'exists'){
                    $('#email-error').fadeIn();
                    allow = false;
                }else{
                    $('#email-error').fadeOut();
                    allow = true;
                }
            }

        });
    });