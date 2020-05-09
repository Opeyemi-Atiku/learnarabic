// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
var videoState;
var loop = false;
var iframe = $('#player');


function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {

        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function playFullscreen() {
    // console.log('full screen mode');
    // var $ = document.querySelector.bind(document);
    // let iframe = $('#player');
    // player.playVideo(); //won't work on mobile

    // var requestFullScreen = iframe.requestFullScreen || iframe.mozRequestFullScreen || iframe.webkitRequestFullScreen;
    // if (requestFullScreen) {
    //     requestFullScreen.bind(iframe)();
    // }

    // $('#player').attr('width', $(window).width());
    // $('#player').attr('height', $(window).height());

    $("#modalBox").toggleClass('fullScreen');
}

function showTranscription() {



    var type = $("#transcriptionTypes").val();

    var texts = [{
        type: 'arabic',
        startTime: 0,
        stopTime: 9,
        text: "First Transcription",
        meaning: "The meaning of the first transcription"
    }, {
        type: 'msa',
        startTime: 10,
        stopTime: 19,
        text: "Second Transcription",
        meaning: "The meaning of the second transcription"
    }, {
        type: 'transcript',
        startTime: 20,
        stopTime: 29,
        text: "Third Transcription",
        meaning: "The meaning of the third transcription"

    }, {
        type: 'transliteration',
        startTime: 30,
        stopTime: 39,
        text: "Fourth Transcription",
        meaning: "The meaning of the fourth transcription"
    }];


    if (type != null) {


        setInterval(function() {
            $.each(texts, function(index, obj) {

                if (obj.startTime < player.getCurrentTime() && obj.stopTime > player.getCurrentTime()) {
                    sentence = obj.text;
                }

            });
            $('#transcription').text(sentence);

        }, 1000);

    }
}






function increaseSpeed() {
    let currentSpeed = player.getPlaybackRate();
    if (currentSpeed < 2) {
        var newSpeed = currentSpeed + 0.25;
        player.setPlaybackRate(newSpeed);
    }
    $("#speed").text(newSpeed);
}

function changeSpeed(speed) {
    player.setPlaybackRate(parseFloat(speed));

}

$('#myModal').on('hidden.bs.modal', function(e) {

    alert('hello');
    player.pauseVideo();
})

function decreaseSpeed() {
    let currentSpeed = player.getPlaybackRate();
    if (currentSpeed > 0) {
        var newSpeed = currentSpeed - 0.25;
        player.setPlaybackRate(newSpeed);
    }
    $("#speed").text(newSpeed);
}

function setLoop() {
    if (loop == false) {
        loop = true;
        $('#loop').css({
            color: 'red'
        });
    } else {
        loop = false;
        $('#loop').css({
            color: 'black'
        });
    }
}

function next() {
    let videos = JSON.parse(localStorage.getItem('recommendedVideos'));
    console.log("All videos " + videos);
    let videoId = player.getVideoData()['video_id'];
    console.log(videoId);
    let index = videos.indexOf(videoId);
    console.log("index = " + index);
    console.log("next video " + videos[index + 1]);
    console.log(videos[index + 1]);

    player.loadVideoById(videos[index + 1]);
}

function prev() {
    let videos = JSON.parse(localStorage.getItem('recommendedVideos'));
    console.log("All videos " + videos);
    let videoId = player.getVideoData()['video_id'];
    console.log(videoId);
    let index = videos.indexOf(videoId);
    console.log("index = " + index);
    console.log("next video " + videos[index + 1]);
    console.log(videos[index + 1]);

    player.loadVideoById(videos[index - 1]);
}

function forward() {
    var currentTime = player.getCurrentTime();
    var seekTime = currentTime + 10;
    player.seekTo(seekTime, true);

}

function rewind() {
    var currentTime = player.getCurrentTime();
    var seekTime = currentTime - 10;
    player.seekTo(seekTime, true);

}

function rewindFive() {
    var currentTime = player.getCurrentTime();
    var seekTime = currentTime - 5;
    player.seekTo(seekTime, true);
}

function exit() {
    player.stopVideo();
}

function pauseOrPlay() {

    // $(".ytp-pause-overlay").css({
    //     display: 'none'
    // });
    // var state = player.getPlayerState();
    // console.log(state);
    // if (state == 1) {
    //     $('#playButton').removeClass("fa-pause")
    //     $('#playButton').addClass("fa-play");
    //     player.pauseVideo();
    // }
    // if (state == 2) {
    //     $('#playButton').removeClass("fa-play");
    //     $('#playButton').addClass("fa-pause")
    //     player.playVideo();
    // }






}

function setVolume() {
    var volume = $("#volume").val();
    console.log(volume);
    player.setVolume(volume);
}



// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    // bind events
    event.target.pauseVideo();
    player.pauseVideo();
    var playButton = document.getElementById("playButton");


    playButton.addEventListener("click", function() {
        event.target.playVideo();
        player.playVideo();
        // $('#playButton').removeClass("fa-play");
        // $('#playButton').addClass("fa-pause");
        var state = player.getPlayerState();

        if (state == 1) {

            event.target.pauseVideo();
            player.pauseVideo();
        }
        if (state == 2) {

            event.target.playVideo();
            player.playVideo();
        }

        $('#time').css('display', 'block');

        startTimer();




    });

    // var pauseButton = document.getElementById("pauseButton");
    // pauseButton.addEventListener("click", function() {
    //     player.pauseVideo();
    // });




}

function seekVideo() {
    let value = $('#videoScroll').val();




    player.seekTo(value, true);



}

function startTimer() {


    let duration = player.getDuration();

    $('#videoScroll').attr('max', duration);

    console.log($('#videoScroll').attr('max'));


    let min = Math.floor(duration / 60);
    if (min < 10) {
        min = '0' + min;
    }
    let sec = parseInt(duration) % 60;
    if (sec < 10) {
        sec = '0' + sec;
    }

    $('#dMinute').text(min);
    $('#dSeconds').text(sec);

    setInterval(function() {
        let progress = player.getCurrentTime();



        min = Math.floor(progress / 60);
        if (min < 10) {
            min = '0' + min;
        }
        sec = parseInt(progress) % 60;
        if (sec < 10) {
            sec = '0' + sec;
        }

        $('#pMinute').text(min);
        $('#pSeconds').text(sec);



        $('#videoScroll').val(Math.ceil(progress));

    }, 1000);
}

function fullScreen() {
    $('#videoSection').css('width', '100%');
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

function onPlayerStateChange(event) {
    // console.log(YT.PlayerState);
    videoState = YT.PlayerState.PLAYING;
    $(".ytp-pause-overlay").css({
        display: 'none'
    });
    console.log(player.getOption('captions'));
    if (event.data == YT.PlayerState.PLAYING && !done) {
        // setTimeout(stopVideo, 6000);
        done = true;
    }
    if (event.data == YT.PlayerState.ENDED) {
        if (loop == true) {
            player.playVideo();
        }

    }



    if (event.data == YT.PlayerState.PLAYING) {
        $('#playButton').removeClass("fa-play");
        $('#playButton').addClass("fa-pause");

    } else {
        $('#playButton').removeClass("fa-pause");
        $('#playButton').addClass("fa-play");

    }





}

function stopVideo() {
    player.stopVideo();
}