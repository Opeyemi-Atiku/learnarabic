$('.visibility').click(function() {
    alert('hello');
    let id = $(this).attr('theId');
    let type = $(this).attr('theType');
    alert(id);
    if ($(this).hasClass('fa-eye-slash')) {
        $(type + 's' + id).css('display', 'inline');
        $(type + 'h' + id).css('display', 'none');
        $(this).removeClass('fa-eye-slash');
        $(this).addClass('fa-eye');
    } else {
        $(type + 's' + id).css('display', 'none');
        $(type + 'h' + id).css('display', 'inline');
        $(this).removeClass('fa-eye');
        $(this).addClass('fa-eye-slash');
    }




});