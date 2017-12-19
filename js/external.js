$(function(){

$('.d-a-i-lazy').on('load', function(){
     $(this).each(function(){
        var boop = $(this).closest('.d-a-i-cont');
        boop.attr('data-loading','loaded');
   });    
});

$('html, body').trigger('scroll');

/***********************************************************************************************************************************************
                                                  PRE-ON DOM READY STUFF
***********************************************************************************************************************************************/
    
    $('.post-reply-comments').mCustomScrollbar({
        scrollInertia: 200,
        mouseWheelPixels: 200
    });

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                          FIX POST USER DROPDOWN MENU (OVERFLOW ISSUE)
***********************************************************************************************************************************************/

    function postDropdownFix(element) {
        $(element).each(function(index){
            var that = $(this);
            var SURTest = that.find('.single-user-reply .dropdown-menu');
            var RepliesCount = that[0].childElementCount;
            var thePost = $('.single-user-reply:last-of-type .dropdown-menu', that);
            if (RepliesCount < 3) {
                if (RepliesCount < 2) {
                    thePost.addClass('commentFixing');
                } else {
                    SURTest.removeClass('commentFixing');
                    thePost.addClass('commentFixing');
                }
            } else {
                SURTest.removeClass('commentFixing');
                SURTest.css('top', '100%');
                thePost.css('top', '-100px');
            }
        });
    }

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                                SHOWDOWN() AND HIDEUP() FUNCTIONS
***********************************************************************************************************************************************/

    (function($) {
    'use strict';
        // Sort us out with the options parameters
        var getAnimOpts = function (a, b, c) {
                if (!a) { return {duration: 'normal'}; }
                if (!!c) { return {duration: a, easing: b, complete: c}; }
                if (!!b) { return {duration: a, complete: b}; }
                if (typeof a === 'object') { return a; }
                return { duration: a };
            },
            getUnqueuedOpts = function (opts) {
                return {
                    queue: false,
                    duration: opts.duration,
                    easing: opts.easing
                };
            };
            // Declare our new effects
            $.fn.showDown = function (a, b, c) {
                var slideOpts = getAnimOpts(a, b, c), fadeOpts = getUnqueuedOpts(slideOpts);
                $(this).hide().css('opacity', 0).slideDown(slideOpts).animate({ opacity: 1 }, fadeOpts);
            };
            $.fn.hideUp = function (a, b, c) {
                var slideOpts = getAnimOpts(a, b, c), fadeOpts = getUnqueuedOpts(slideOpts);
                $(this).show().css('opacity', 1).slideUp(slideOpts).animate({ opacity: 0 }, fadeOpts);
            };
        }(jQuery));

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                               READ MORE / READ LESS HIDE TEXT
***********************************************************************************************************************************************/

    $.fn.shorten = function (settings) {
        var config = {
            showChars: 400,
            ellipsesText: "...",
            moreText: "Read More",
            lessText: "Read Less"
        };
 
        if (settings) {
            $.extend(config, settings);
        }
         
        $(document).off("click", '.morelink');
         
        $(document).on({click: function () {
 
                var $this = $(this);
                if ($this.hasClass('less')) {
                    $this.removeClass('less');
                    $this.html(config.moreText);
                } else {
                    $this.addClass('less');
                    $this.html(config.lessText);
                }
                $this.parent().prev().toggle();
                $this.prev().toggle();
                return false;
            }
        }, '.morelink');
 
        return this.each(function () {
            var $this = $(this);
            if($this.hasClass("shortened")) return;
             
            $this.addClass("shortened");
            var content = $this.html();
            if (content.length > config.showChars) {
                var c = content.substr(0, config.showChars);
                var h = content.substr(config.showChars, content.length - config.showChars);
                var html = c + '<span class="moreellipses">' + config.ellipsesText + '</span><span class="morecontent"><span>' + h + '</span><a href="#" class="morelink">' + config.moreText + '</a></span>';
                $this.html(html);
                $(".morecontent span").hide();
            }
        });   
    }

    $(".s-w-user-post").shorten();

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                                   MARK AS SPAM FUNCTION
***********************************************************************************************************************************************/

    function postSpamCheck() {
        $('.markSpam').on('click', function(e){
            e.preventDefault();
            var that = $(this);
            var thatPar = that.closest('.single-user-reply');
            var postID = thatPar.data('postid');
            var userID = thatPar.data('userid');
            var url = "/laravel/public/utility/markasspam?id=" + postID + "&userid=" + userID;
            $.ajax({
                type: "GET",
                url: url,
                cache: false,
                success: function(data) {
                    thatPar.addClass('opacityOne').addClass('isSpam');
                }
            });
            thatPar.on('click', function() {
                thatPar.removeClass('isSpam').removeClass('opacityOne');
            });
        });

        $('.single-user-reply.isSpam').on('click', function(){
            $(this).removeClass('isSpam').removeClass('opacityOne');
        });
    }

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                                  STOP BODY SCROLL ON SCROLLABLE DIVS
***********************************************************************************************************************************************/

    function dontScrollBody() {
        $('.post-reply-comments.scrollb, #queue-o-cont.scrollb').on('DOMMouseScroll mousewheel', function(ev) {
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
    }

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                                  CHECK IF COMMENT DIV IS SCROLLABLE
***********************************************************************************************************************************************/

function toScrollCommentOrNotToScroll(elementx) {
        $(elementx).each(function(){
            var that = $(this);
            var thatmCSB = that.find('.mCSB_container');
            var thatMaster = that.next('.master-user-reply');
            if (!thatmCSB.hasClass('mCS_no_scrollbar')) {
                that.addClass('scrollb');
                thatMaster.addClass('shadow');
                dontScrollBody();
            } else {
                that.removeClass('scrollb').off('DOMMouseScroll mousewheel');
                thatMaster.removeClass('shadow');
            }
            that.mCustomScrollbar("scrollTo","bottom",{scrollInertia:200});
        });
    }

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                            QUEUE SORT AND QUEUE LOAD COVERS FUNCTION
***********************************************************************************************************************************************/

    
    //Making the queue sortable
    function queueSort() {
        $( "#queue-contain" ).sortable({
            revert: 300,
            delay: 100,
            axis: "x",
            start: function (e,ui) {
                $(ui.helper).addClass('dragging');
                $(ui.helper).css('opacity','1');
                $('#queue-contain .queue-item:not(.dragging)').each(function(){
                    $(this).css('opacity','0.4');
                });
            },
            stop: function (e,ui) {
                $('#queue-contain .queue-item:not(.dragging)').each(function(){
                    $(this).css('opacity','0.65');
                });
                $(ui.item).css({width:''}).removeClass('dragging');
                $(ui.item).css('opacity','0.65');
                $('#queue-contain').sortable('enable');
            }
        });
        $( "#queue-contain" ).disableSelection();

        //'Remove from queue' button
        $('.qi-close').on('click', function(e){
            e.preventDefault();
            var removeItem = $(this).parent().parent();
            setTimeout(function(){
                removeItem.remove();
                $('#queue-o-cont').mCustomScrollbar("update");
            }, 10);
        });
    }

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                            SHARE THOUGHTS AND SUB COMMENTS REFRESH FUNCTION
***********************************************************************************************************************************************/

    function commentCommon() {
        $('textarea').autosize();

        $('.likes-but').on('click', function(e){
            e.preventDefault();
            var likedButPar = $(this).parent();
            likedButPar.children('.likes-but').toggleClass('active');
        });

        $('.new-reply').on('propertychange keyup input cut paste focus blur', function(){
            var disablePostComment = $('~ .reply-buts', this).children('.reply-post-comment');
            if (!$.trim($(this).val())) {
                disablePostComment.attr('disabled', 'disabled');
            } else {
                disablePostComment.removeAttr('disabled');
            }
        });

        $(".new-reply").focus(function(){
            $(this).addClass('focused');
        });

        $(".new-reply").blur(function(){
            if (!$.trim($(this).val())) {
                $(this).removeClass('focused');
            } else {
                return false;
            }
        });
    }

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                                 SHARE THOUGHTS COMMENT REFRESH FUNCTION
***********************************************************************************************************************************************/

    function commentTop() {
        $('.master-user-reply.topone .new-reply').on('propertychange keyup input cut paste focus blur', function(){
            var disablePostComment = $('~ .new-reply-more-options > .reply-buts', this).children('.reply-post-comment');
            if (!$.trim($(this).val())) {
                disablePostComment.attr('disabled', 'disabled');
            } else {
                disablePostComment.removeAttr('disabled');
            }
        });

        $('.master-user-reply.topone .new-reply').on('focus', function(){
            var masterUR = $(this).parent().parent();
            masterUR.addClass('full');
        });
    }

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
                                                        SUB COMMENT REFRESH FUNCTION
***********************************************************************************************************************************************/

    function commentSub() {
        $('.reply-cancel').on('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).parent().prev('.new-reply').val('').blur().trigger('autosize.resize');
        });
    }

/*############################################################################################################################################*/


/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                             SHARE THOUGHTS
************************************************************************************************************************************************
***********************************************************************************************************************************************/

    function shareThoughtsSubmit() {
        $('.shareThoughts').on('submit', function() {

            var url = "/laravel/public/utility/submitcomment"; // the script where you handle the form input.
            var currentElement = $(this);
            var commentLoadIn = $('<div class="loader"></div>');
            var formData = currentElement.serialize();
            $('> .master-user-reply', currentElement).addClass('submitting');
            $('.reply-post-comment').attr('disabled', 'disabled');
            currentElement.append(commentLoadIn);
            var commentLoader = currentElement.find('.loader');
            commentLoader.fadeIn(250, function() {
             $.ajax({
                   type: "POST",
                   url: url,
                   dataType: "json",
                   data: formData, // serializes the form's elements.
                   success: function(response)
                   {
                        commentLoader.fadeOut(250, function() {
                            var commentPost = $('<li class="s-w-entry"><div class="initial-post"><div class="user-ava-cont"><a href="#" class="user-ava-a"><img src="../images/prof-dp.jpg"></a></div><div class="s-w-user-details"><a href="'+ response.userid +'" class="s-w-poster upop">'+ response.username +'</a><span class="s-w-timestamp">1 second ago</span><a href="#" class="likes-but notliked active">Like this</a><a href="#" class="likes-but liked">You like this</a><ul class="more-dropdown-cont" role="button"><li class="dropdown minidrop"><button class="more-dropdown dropdown-toggle" role="button" data-toggle="dropdown"><i class="icon down"></i></button><ul class="dropdown-menu" role="menu" aria-labelledby="people"><li role="presentation"><a class="u-a-a" role="menuitem" tabindex="-1" href="#">Block User</a></li><li role="presentation"><a class="u-a-a" role="menuitem" tabindex="-1" href="#">Report Abuse</a></li><li role="presentation"><a class="u-a-a markSpam" role="menuitem" tabindex="-1" href="#">Mark as Spam</a></li></ul></li></ul><div class="s-w-user-post">' + response.comment + '</div><div class="clear"></div></div></div><ul class="post-reply-comments"><li class="loader-comments"><div class="loader"></div></li></ul><div class="master-user-reply"><form name="subComment" method="post" class="subComment"><div class="user-ava-cont"><a href="#" class="user-ava-a"><img src="../images/prof-dp.jpg" class="s-w-user-ava-img-sm"></a></div><div class="reply-textarea-cont"><input value="'+ response.comment_parent +'" name="comment_parent" type="hidden"><input value="'+ response.comment_to_id +'" name="comment_to_id" type="hidden"><textarea class="new-reply" name="comment" placeholder="Leave a comment..."></textarea><div class="reply-buts"><button class="reply-post-comment" disabled="disabled">Post comment</button><button class="reply-cancel">Cancel</button></div></div><div class="clear"></form></div><div class="clear"></div></li>');
                            commentPost.hide();
                            $('.wall-feed-contain').prepend(commentPost.fadeIn(250));
                            $('.main-comment-class').val('');
                            $(".shareThoughts").unbind('submit');
                            commentCommon();
                            commentTop();
                            commentSub();
                            shareThoughtsSubmit();
                            postSpamCheck();
                            commentPost.find('.post-reply-comments').mCustomScrollbar("update");
                            currentElement.find('.master-user-reply').removeClass('submitting');
                            $('.reply-post-comment').removeAttr('disabled');
                            commentLoader.remove();
                        });
                   }
                 }); 
            });
             // Ensures it doesn't route the form the normal way, and ajax takes over
             // This was nested one function too deep, allowing the form to still submit and ajax to not take over
             return false;
        });
    }

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                              SUB COMMENTS
************************************************************************************************************************************************
***********************************************************************************************************************************************/
 
    function subCommentSubmit() {
        $('.subComment').on('submit', function() {

            var url = "/laravel/public/utility/submitsubcomment"; // the script where you handle the form input.
            // Submits the data with ajax, method type is POST
            var currentElement = $(this);
            var thatPar = currentElement.parent().prev();
            var commentLoader = $('.loader-comments > .loader', thatPar);
            var thatCommCont = thatPar.find('.l-a-c-cont-ul');
            var formData = currentElement.serialize();
            $('.new-reply', currentElement).val('').blur().trigger('autosize.resize');

            $('.reply-post-comment').attr('disabled', 'disabled');
            commentLoader.fadeIn(250, function() {
                $.ajax({
                       type: "POST",
                       url: url,
                       dataType: "json",
                       data: formData, // serializes the form's elements.
                       success: function(response)
                       {    
                            commentLoader.fadeOut(250, function() {
                                var commentPost = $('<li class="single-user-reply"><div class="user-ava-cont"><a href="'+ response.userid +'" class="user-ava-a"><img src="../images/avatest1.png"></a></div><div class="s-w-user-details"><a href="'+ response.userid +'" class="s-w-poster upop">'+ response.username +'</a><span class="s-w-timestamp">1 second ago</span><a href="#" class="likes-but notliked active">Like</a><a href="#" class="likes-but liked">Liked</a><ul class="more-dropdown-cont" role="button"><li class="dropdown minidrop"><button class="more-dropdown dropdown-toggle" role="button" data-toggle="dropdown"><i class="icon down"></i></button><ul class="dropdown-menu" role="menu" aria-labelledby="people"><li role="presentation"><a class="u-a-a" role="menuitem" tabindex="-1" href="#">Block User</a></li><li role="presentation"><a class="u-a-a" role="menuitem" tabindex="-1" href="#">Report Abuse</a></li><li role="presentation"><a class="u-a-a markSpam" role="menuitem" tabindex="-1" href="#">Mark as Spam</a></li></ul></li></ul><div class="s-w-user-post">'+ response.comment +'</div><div class="clear"></div></div></li>');
                                commentPost.hide();
                                thatCommCont.append(commentPost);
                                commentPost.fadeIn(250);
                                commentCommon();
                                subCommentSubmit();
                                postSpamCheck();
                                $(".s-w-user-post").shorten();
                                $('.reply-post-comment').removeAttr('disabled');
                                thatPar.mCustomScrollbar("update");
                                postDropdownFix(thatCommCont);
                                toScrollCommentOrNotToScroll(thatPar);
                                thatPar.mCustomScrollbar("scrollTo","bottom",{scrollInertia:200});
                            });
                       }
                }); 
            });
            // Ensures it doesn't route the form the normal way, and ajax takes over
            return false;

        });
    }

/*############################################################################################################################################*/


/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                    GET ALL COMMENTS FUNCTION
************************************************************************************************************************************************
***********************************************************************************************************************************************/

    $('.all-comments').on('click', function(e) {
        var url = '/laravel/public/utility/getallcomments';
        var that = $(this);
        var thisCommentSection = $('+ .post-reply-comments', that);
        var thisCommentsInsert = $('.l-a-c-cont-ul', thisCommentSection);
        var masterReply = $('+ .master-user-reply', thisCommentSection);
        var clickCounter = that.data('clickCounter') || 0;
        clickCounter++;
        that.data('clickCounter', clickCounter);
        if (clickCounter%2 !== 0) {
            $.ajax({
               type: "POST",
               url: url,
               data: $('.load-all-comments-form', that).serialize(), // serializes the form's elements.
               success: function(data)
               {    
                    thisCommentSection.addClass('scrollb showlots');
                    masterReply.addClass('shadow');
                    var storeData = $(data);
                    storeData.hide().prependTo(thisCommentsInsert).get().reverse();
                    storeData.slideDown(500, function(){
                        $(".s-w-user-post").shorten();
                        thisCommentSection.mCustomScrollbar("update");
                        toScrollCommentOrNotToScroll(thisCommentSection);
                        thisCommentSection.mCustomScrollbar("scrollTo","top",{scrollInertia:200});
                    });
                    that.find('.load-all-comments').text('Hide comments');
                    commentCommon();
               }
             });
        } else {
            var cc = thisCommentsInsert.children('.single-user-reply');
            var count = thisCommentsInsert[0].childElementCount;
            var newCount = count-3;
            thisCommentSection.mCustomScrollbar("scrollTo","top",{scrollInertia:200});
            for (var i=newCount; i<1; i--) {
                var closestSingle = thisCommentsInsert.closest('.single-user-reply');
                closestSingle.slideUp(200, function(){
                    thisCommentSection.removeClass('scrollb showlots').mCustomScrollbar("update");
                    masterReply.removeClass('shadow');
                    closestSingle.remove();
                    toScrollCommentOrNotToScroll(thisCommentSection);
                });
            }
            if (count == 1)
                that.find('.load-all-comments').text('Show 1 more comment');
            else
                that.find('.load-all-comments').text('Show ' + newCount + ' more comments');
        }
         return false; 
    });

/*############################################################################################################################################*/


/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                    GENERAL LOGIN/REGISTER FORM STUFF
************************************************************************************************************************************************
***********************************************************************************************************************************************/

    var form = $('.login-contain.itslogin');

    // Function to wipe animation class, after animation is finished
    function onAnimationEnd(){
      form.removeClass('shake');
    }

    function backOrFront (){
        if ($('.flipper').hasClass('itsback')) {
            var halfLoginHeightAg = ($('.back').innerHeight()) * -0.5;
            $('.flipper').css('top', halfLoginHeightAg);
        } else {
            var halfLoginHeightAg = ($('.front').innerHeight()) * -0.5;
            $('.flipper').css('top', halfLoginHeightAg);
        }

    }

    function backOrFrontMob (){
        if ($('.flipper').hasClass('itsback')) {
            $(this).addClass('controlheight');
        } else {
            $('.flipper').removeClass('controlheight');
        }
    }

    form.on('oanimationend webkitAnimationEnd animationend', onAnimationEnd);

    // On form submit - adding shake class
    form.on('submit', function(){
       var url = "/laravel/public/auth/login"; // the script where you handle the form input.
        // Submits the data with ajax, method type is POST
        $('.signup-login-contain').fadeOut(500, function() {
            $('.above-login-signup').html('<div class="loader"></div>').fadeIn(250);
             $.ajax({
                   type: "POST",
                   url: url,
                   data: $(".loginForm").serialize(), // serializes the form's elements.
                   success: function(data)
                   {
                        // If it gets a callback (there would be an error for this to happen) it will shake and show the error :)
                        if (data != 'Login Successful!') {      
                            $('.above-login-signup').fadeOut(250, function() { 
                                $('.signup-login-contain').fadeIn(250, function() {
                                    form.addClass("shake");
                                    $('.login-submit-error').html(data);
                                    $('.login-submit-error').removeClass('hide');
                                     var halfLoginHeightAgg = ($('.front').innerHeight()) * -0.5;
                                    $('.flipper').css('top', halfLoginHeightAgg);
                                });                        
                            });
                        } 
                        if (data == 'Login Successful!') {
                            location.reload();
                        }
                   }
                 }); 

        });
         // Ensures it doesn't route the form the normal way, and ajax takes over
        return false;
    });


    $('.switchem').on('click', function(e){
        $('.flipper').toggleClass('itsback');
        e.preventDefault();
        $('.login-submit-error').addClass('hide');
        $('.flip-container').toggleClass('flipit');
        backOrFront();
    });


    $('.login-close').on('click', function(){
        $('.login-total-cont').removeClass('slideover');
        $('.login-submit-error').addClass('hide');
        $('.main').removeClass('fixed');
        setTimeout(function(){
            $('.login-total-cont').addClass('hide');
        }, 500);
    });
    
    $('#loginregister-but, #loginregister-but-mobile').on('click', function(e){
        e.preventDefault();
        $('.login-total-cont').removeClass('hide');
        var halfLoginHeight = ($('.front').innerHeight()) * -0.5;
        $('.flipper').css('top', halfLoginHeight);
        $('.login-total-cont').addClass('slideover');
        $('body').removeClass('nav-opened');
        setTimeout(function(){
            $('.main').addClass('fixed');
        }, 500);
        setTimeout(function(){
            $('body').css('overflow','hidden');
        }, 1000);
        setTimeout(function(){
            $('body').css('overflow','visible');
        }, 1010);
        
    });

    $(document).keyup(function(e) {
      if (e.keyCode == 27) {
        $('.login-total-cont').removeClass('slideover');
        $('.login-submit-error').addClass('hide');
        $('.main').removeClass('fixed');
      }
    });

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                    MAIN SEARCH BAR STUFF
************************************************************************************************************************************************
***********************************************************************************************************************************************/

    var mainSearch = $('#main-search');
    var mainSearchClear = $('#main-search-clear');

    mainSearch.on('propertychange keyup input paste', function(){
        mainSearch.next(mainSearchClear).fadeIn(300);
    });

    mainSearchClear.on('click', function() {
        mainSearchClear.fadeOut(300);
        mainSearch.focus().val('');
    });

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                            TOOLTIPS
************************************************************************************************************************************************
***********************************************************************************************************************************************/
    
    $('.tt-w').tipsy({gravity: 'w'});
    $('.tt-n').tipsy({gravity: 'n'});
    $('.tt-s').tipsy({gravity: 's'});
    $('.tt-e').tipsy({gravity: 'e'});

/*############################################################################################################################################*/



    $('.follow-me').on('click', function(e){
        e.preventDefault();
        var likedButPar = $(this).parent();
        likedButPar.children('.follow-me').each(function(){
            $(this).toggleClass('active');
        });
    });

/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                ANIME/MANGA HOVER FAVE, ADD TO, RATING
************************************************************************************************************************************************
***********************************************************************************************************************************************/

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // FAVE
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

    $('.favorite-but').on('click', function(e){
        var itemFavePar = $(this).parent().parent().parent().parent().parent();
        $(this).toggleClass('faved');
        //itemFavePar.find('.badge-fave').toggleClass('true');
        e.preventDefault();
    });

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // ADD TO
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    


    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // RATING
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    
    $('.rate-it-panel').on('click', function(e){
        e.preventDefault();
    });

    $('.rate-but').on('click', function(e){
        var itemLink = $(this).parent().parent().parent().parent();
        $('.item-img-a ~ .clear-rating').fadeOut('fast');
        $('.item-img-a').removeClass('rate-open');
        itemLink.addClass('rate-open');
        $('~ .clear-rating', itemLink).fadeIn('fast');
        e.preventDefault();
    });

    $('.clear-rating').on('click', function(){
        $(this).fadeOut('fast');
        $('.item-img-a').removeClass('rate-open');
    });

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                              NOTIFICATIONS STUFF
************************************************************************************************************************************************
***********************************************************************************************************************************************/

    //Remove notifications icon from DOM
    $('#notifications, #messages').on('click', function(){
        var notifyRemove = $('> .notify-alert', this);
        setTimeout(function() {
            notifyRemove.remove();
        }, 100);
    });

    //Remove 'new' class from notification on click --> !!!!!!!! NOTE: preventDefault and stopPropagation must be removed when ready for live
    $('.dd-message-a.new').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $(this).removeClass('new');
    });

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                                    QUEUE STUFF
************************************************************************************************************************************************
***********************************************************************************************************************************************/
    
    //Initiate horizontal scrollbar
    $("#queue-o-cont").mCustomScrollbar({
        horizontalScroll: true,
        advanced:{
            autoExpandHorizontalScroll: true
        },
        scrollInertia: 200,
        mouseWheelPixels: 200
    });
    dontScrollBody();

    //'Clear queue' button
    $('.clear-queue').on('click', function(e){
        e.preventDefault();
        var queueCont = $('#queue-contain');
        queueCont.removeClass('opacityfull');
        setTimeout(function(){
            queueCont.empty();
            queueCont.css('display','block');
            $('#queue-o-cont').mCustomScrollbar("update");
        }, 500);
    });

    //Close queue on body click
    $(document).on('click', function() {
        $('body').removeClass('q-open');
    });

    //Toggle Anime/Manga buttons
    $('.q-a-or-m .sel-anime, .q-a-or-m .sel-manga').on('click', function(e){
        e.preventDefault();
        var newAct = $(this);
        $(this).parent().find('.active').removeClass('active');
        newAct.addClass('active');
        if (newAct.hasClass('sel-anime')) {
            var url = '/laravel/public/queue-anime';
            queueView(url);
        } else {
            var url = '/laravel/public/queue-manga';
            queueView(url);
        }
    });

    var i = 0;

    $("#queue-but").click(function(e) {
        var url = '../queue-anime.php';
        e.preventDefault();
        e.stopPropagation();
        i++;
        $('[data-toggle="dropdown"]').parent().removeClass('open');
        if ($('body').hasClass('q-open'))
            $('body').removeClass('q-open');
        else
            $('body').addClass('q-open');
        if (i == 1) {
            var url = '/laravel/public/queue-anime';
            queueView(url);
        } else { return false; }
    });

    $("#queue").on('click', function(e) {
        e.stopPropagation();
    });

     //'Close queue' button
    $('.close-queue').on('click', function(e){
        e.preventDefault();
        $('body').removeClass('q-open');
    });

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                    ON BROWSER RESIZE / BROWSER SIZE SPECIFIC JS
************************************************************************************************************************************************
***********************************************************************************************************************************************/

    var goPhone = function(){
    }

    var goTablet = function(){
    }

    var goDesktop = function(){
    }

    syze.sizes(320, 480, 600, 768, 1024, 1280).callback(
        function(currentSize) {
            if ((currentSize < 768))
                $('body').removeClass('q-open');
        }
    );

    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    // MOBILE
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  

    //Profile main nav mobile menu
    var booleanAni = 0;
    $('.hidden-prof-link').on('click', function(e){
        var hidProfLink = $(this);
        e.preventDefault();
        if (booleanAni > 0) {
            $('.profile-nav-li').removeClass('animate');
            hidProfLink.removeClass('open');
            booleanAni = 0;
        } else {
            $('.profile-nav-li').addClass('animate');
            hidProfLink.addClass('open');
            booleanAni = 1;
        }
    });

    //Mobile search button
    $('#search-mob').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('body').removeClass('nav-opened');
        setTimeout(function(){
            $('body').css('overflow','hidden');
        }, 1000);
        setTimeout(function(){
            $('body').css('overflow','visible');
        }, 1010);
        $('body').stop().toggleClass('mobile-search');
        $('[data-toggle="dropdown"]').parent().removeClass('open');
    });

    //Mobile menu button
    $('#toggle').on('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        $('.flipper').addClass('topnone');
        $('body').removeClass('mobile-search');
        $('body').stop().toggleClass('nav-opened');
        $('[data-toggle="dropdown"]').parent().removeClass('open');
    });

    // ! SOLUTION FOR THIS NEEDED vvvvvv
    //Close mobile nav on body click & mobile fix for webkit browsers  ::
    // When you open the menu and close it, you are able to scroll the website to the right, showing blank space, without this hack
    /*$(document).on('click', function() {
        $('body').removeClass('nav-opened');
        setTimeout(function(){
            $('body').css('overflow','hidden');
        }, 1000);
        setTimeout(function(){
            $('body').css('overflow','visible');
        }, 1010);
    }); */

    //Close mobile search on body click
    $(document).on('click', function() {
        $('body').removeClass('mobile-search');
    });

    //Prevent mobile nav from closing when clicking inside it
    $("#nav").on('click', function(e) {
        e.stopPropagation();
    });

    //Prevent mobile search from closing when clicking inside it
    $("#mobile-search-cont").on('click', function(e) {
        e.stopPropagation();
    });

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                               RANDOM GENERAL STUFF
************************************************************************************************************************************************
***********************************************************************************************************************************************/

    //'Close' button on dropdowns
    $('.head-all-a .delete').on('click', function(e){
        e.preventDefault();
    });

/*############################################################################################################################################*/



/***********************************************************************************************************************************************
************************************************************************************************************************************************
                                                    INITIATE UNINITIATED, NECESSARY FUNCTIONS
************************************************************************************************************************************************
***********************************************************************************************************************************************/
    
    commentCommon();
    commentTop();
    commentSub();
    shareThoughtsSubmit();
    subCommentSubmit();
    postDropdownFix('.l-a-c-cont-ul');
    postSpamCheck();
    toScrollCommentOrNotToScroll('.post-reply-comments');

/*############################################################################################################################################*/
    
    });