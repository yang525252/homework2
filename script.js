let mediaRecorder;
let chunks = [];
let recordingIndex = 1;
let recordingInterval;

document.getElementById('startBtn').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        chunks = [];
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'block';
        a.href = url;
        a.download = `recording_${recordingIndex}.webm`;
        a.textContent = `下載影片 ${recordingIndex}`;
        document.getElementById('recordings').appendChild(a);
        recordingIndex++;
    };

    mediaRecorder.start();
    document.getElementById('startBtn').disabled = true;
    document.getElementById('stopBtn').disabled = false;

    // 每 5 分鐘停止並重新啟動錄製
    recordingInterval = setInterval(() => {
        mediaRecorder.stop();
        mediaRecorder.start();
    }, 5 * 60 * 1000); // 5 分鐘
});

document.getElementById('stopBtn').addEventListener('click', () => {
    clearInterval(recordingInterval);
    mediaRecorder.stop();
    document.getElementById('startBtn').disabled = false;
    document.getElementById('stopBtn').disabled = true;
});
