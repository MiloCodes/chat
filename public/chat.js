$(function () {

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function updateColor() {
        $('#m').css("color", yourColor);
        $('#type').css("border-color", yourColor);
        $('button').css("background-color", yourColor);
    }

    var socket = io();
    var yourColor = getRandomColor();
    updateColor();

    $('form').submit(function () {
        if ($('#m').val()) {
            if ($('#m').val().startsWith("/color ")) {
                yourColor = $('#m').val().split(' ')[1];
                updateColor();
            } else {
                socket.emit('chat message', $('#m').val(), yourColor);
            }

            $('#m').val('');
        }
        return false;
    });
    socket.on('chat message', function (msg, color) {
        $('#messages').append($('<div>').html(msg).css("color", color));
        $('html, body').scrollTop($(document).height());
    });

    socket.on('user count', function (count) {
        $('#m').attr('placeholder',"Message " + count +  " users... ");
        window.document.title = "Chat: " + count + " users";
    });

    socket.on('refresh', function (data) {
        console.log('refresh');
        location.reload();
    });
});
