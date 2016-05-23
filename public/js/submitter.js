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
                 $('#submit').hide();

                 $('.well').animate({
                    'marginTop' : "+=60px" 
                });

                 $.toast({
                    text : "Welcome aboard. We will mail you soon if you are selected.",
                    showHideTransition: 'slide',
                    loader: false,
                    position: 'bottom-center',
                    hideAfter: 10000,
                    allowToastClose: false
                });

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