document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('drawingCanvas');
    const drawingrules = canvas.getContext('2d');
    let drawing = false;

    function startDrawing(e) {
        drawing = true;
        draw(e);
    }

    function stopDrawing() {
        drawing = false;
        drawingrules.beginPath();
    }

    function draw(e) {
        if (!drawing) return;
        drawingrules.lineWidth = 3;
        drawingrules.lineCap = 'square';
        drawingrules.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        drawingrules.stroke();
        drawingrules.beginPath();
        drawingrules.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    document.getElementById('clearBtn').addEventListener('click', function() {
        drawingrules.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Adding event listener for the "Example" button
    document.getElementById('exampleBtn').addEventListener('click', function() {
        const img = document.getElementById('exampleImg');
        img.src = 'static/monalisa.jpg'; // Direct path
        img.style.display = 'block'; // Show the image
    });
});
