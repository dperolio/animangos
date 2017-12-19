<!DOCTYPE html>
<html lang="en" class="no-js">
  <head>
    <meta charset="utf-8">
    <title>Animangos</title>
    <meta name="viewport" content="width=device-width, initial-scale = 1.0" />
    
    <link rel="stylesheet" type="text/css" href="css/animangos.css">
    <link rel="stylesheet" type="text/css" href="css/jquery.mCustomScrollbar.css">

    <link rel="shortcut icon" href="favico.png" />
    <!-- Standard iPhone --> 
    <link rel="apple-touch-icon" sizes="57x57" href="touch-icon-iphone-114.png" />
    <!-- Retina iPhone --> 
    <link rel="apple-touch-icon" sizes="114x114" href="touch-icon-iphone-114.png" />
    <!-- Standard iPad --> 
    <link rel="apple-touch-icon" sizes="72x72" href="touch-icon-ipad-144.png" />
    <!-- Retina iPad --> 
    <link rel="apple-touch-icon" sizes="144x144" href="touch-icon-ipad-144.png" />

    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/syze.min.js"></script>
    <script src="js/jquery.mCustomScrollbar.min.js"></script>
    <script src="js/jquery.mousewheel.min.js"></script>
    <script src="js/jquery.tipsy.js"></script>
    <script src="js/jquery.expandable.js"></script>
    <script src="js/jquery-ui-1.10.3.custom.min.js"></script>
    <script src="js/touchpunch.js"></script>
    <script src="js/external.js"></script>

    <script>
        var userRegEmail = 0;

        $(function(){

        /***********************************************************************************************************************************************
        ************************************************************************************************************************************************
                                                REGISTER FORM - NEEDS TO BE IN HEAD FILE TO LOAD PROPERLY
        ************************************************************************************************************************************************
        ***********************************************************************************************************************************************/

            $('#firstRegister').submit(function() {
                var url = "/laravel/public/auth/firstregister";
                $('.signup-contain').fadeOut(500, function() {
                    $('.above-signup').html('<img src="images/loading-star.png" class="loader"></img>').fadeIn(250);
                    $.ajax({
                        type: "POST",
                        url: url,
                        data: $('#firstRegister').serialize(),
                        success: function(data) {
                            if (data == 'success') {
                                userRegEmail = $('#signup-name').val();
                                $('.signup-contain').empty();
                                $('.signup-contain').load("http://65.24.163.122/laravel/public/signupfurther");
                                $('.above-signup').fadeOut(250, function() {
                                    $('.signup-contain').fadeIn(500); 
                                });    
                            } else {
                                // This is where I will show the errors from the ajax
                                setTimeout(function() {
                                    $('.above-signup').fadeOut(250, function() {
                                        $('.register-submit-error').html(data);
                                        $('.register-submit-error').removeClass('hide');
                                        $('.signup-contain').fadeIn(500); 
                                    });                              
                                }, 250);
                            }
                        }
                    });
                });
                $("#firstRegister").unbind('submit');
                return false;
            });
    
        $(".post-reply-comments").mCustomScrollbar({
            scrollInertia: 10,
            mouseWheelPixels: 100
        });

        $('.post-reply-comments.showlots, #queue-o-cont').on('DOMMouseScroll mousewheel', function(ev) {
            var $this = $(this),
                scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = $this.height(),
                delta = (ev.type == 'DOMMouseScroll' ?
                    ev.originalEvent.detail * -40 :
                    ev.originalEvent.wheelDelta),
                up = delta > 0;

            var prevent = function() {
                ev.stopPropagation();
                ev.preventDefault();
                ev.returnValue = false;
                return false;
            }
            
            if (!up && -delta > scrollHeight - height - scrollTop) {
                // Scrolling down, but this will take us past the bottom.
                $this.scrollTop(scrollHeight);
                return prevent();
            } else if (up && delta > scrollTop) {
                // Scrolling up, but this will take us past the top.
                $this.scrollTop(0);
                return prevent();
            }
        });

        /*############################################################################################################################################*/
        });

        /***********************************************************************************************************************************************
                                                    REGISTER FORM - NEEDS TO BE IN MAIN TO BE CALLED
        ***********************************************************************************************************************************************/

            function ajaxForm() {

                $('#secondRegister').on('submit', function() {
                    var url3 = "/laravel/public/auth/secondregister";
                    $('#secondRegister').prepend('<input type="hidden" name="email" value="'+ userRegEmail +'"></input>');
                    $('.signup-contain').fadeOut(500, function() {
                        $('.above-signup').html('<img src="images/loading-star.png" class="loader"></img>').fadeIn(250);
                        $.ajax({
                            type: "POST",
                            url: url3,
                            data: $('#secondRegister').serialize(),
                            success: function(data) {
                                if (data == "success") {
                                    $('.above-signup').fadeOut(250, function() {
                                        var halfLoginHeightAg = ($('.front').innerHeight()) * -0.5;
                                        $('.flipper').css('top', halfLoginHeightAg);
                                        $('.signup-contain').html('<p style="text-align:center;width:100%;font-weight:bold;">You have registered!</p><p style="text-align:center;width:100%;">Please check your email and verify your account.</p>');
                                        $('.signup-contain').fadeIn(500);
                                    });
                                } else {
                                    setTimeout(function() {
                                       $('.above-signup').fadeOut(250, function() {
                                            $('.register-two-submit-error').html(data);
                                            $('.register-two-submit-error').removeClass('hide');
                                            $('.signup-contain').fadeIn(500);
                                       });
                                    }, 250);
                                }
                            }
                        });
                    });
                    $("#secondRegister").unbind('submit');
                    return false;
                });
            }

        /*############################################################################################################################################*/

        $(function() {
            ajaxForm();
        });
    </script>
</head>