(function () {
    var recorder;
    var mediaStream;
    var audioStream;
    var fileName;
    var connection;

    function getVideoStream() {
        var config = { video: true, audio: true };
        var userstream;
        return navigator.mediaDevices.getDisplayMedia({
            video: true,
        })
        // .then(function (stream) {
        //     mediaStream = stream;
        //     // document.getElementsByTagName('video')[0].srcObject = stream;
        //     getRecorder();
        // })
    };

    function getAudioStream() {
        return navigator.mediaDevices.getUserMedia({
            audio: true,
        });
    }

    function getRecorder() {
        // var options = { mimeType: 'video/webm', audioBitsPerSecond: 128000 };
        var options = {mimeType: 'video/webm;codecs=vp9'};
        var combinedStream = new MediaStream([mediaStream.getTracks()[0], audioStream.getTracks()[0]]);
        recorder = new MediaRecorder(combinedStream, options);
        recorder.ondataavailable = videoDataHandler;
    };

    function videoDataHandler(event) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(event.data);
        reader.onloadend = function (event) {
            connection.send(reader.result);
        };
    };

    function getWebSocket() {
        var websocketEndpoint = 'ws://localhost:7000';
        connection = new WebSocket(websocketEndpoint);
        connection.binaryType = 'arraybuffer';
        connection.onmessage = function (message) {
            fileName = message.data;
        }
    };

    function updateVideoFile() {
        var video = document.getElementById('recorded-video');
        var fileLocation = 'http://localhost:7000/uploads/'
            + fileName + '.webm';
        video.setAttribute('src', fileLocation);
    };

    var startButton = document.getElementById('record');
    startButton.addEventListener('click', async function (e) {
        mediaStream = await getVideoStream();
        audioStream = await getAudioStream();
        getRecorder();
        recorder.start(5000);
    });

    var stopButton = document.getElementById('stop');
    stopButton.addEventListener('click', function (e) {
        recorder.stop();
        updateVideoFile();
        const Http = new XMLHttpRequest();
        const url='http://localhost:7001/stop';
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange=(e)=>{
            console.log(Http.responseText)
        }
    });

    getWebSocket();
})();