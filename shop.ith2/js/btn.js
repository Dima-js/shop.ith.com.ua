/**
 * Created by user on 29.12.2016.
 */
$(document).on('ready',function(){
    var $menu = $('#myPanelDefault');
    var $m=$('#overlay');

    $('#menu-btn-toggle').on('click',function(event){
        event.preventDefault();

        $(this).toggleClass('active');
        $menu.toggleClass('active');
        $m.toggleClass('active');

    });
});