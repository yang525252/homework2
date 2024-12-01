let mediaRecorder;
let chunks = [];
let recordingInterval;

async function startScreenRecording() {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false // 可根據需求啟用音訊
        });

        mediaRecorder = new MediaRecorder(screenStream);

        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = saveRecording;

        mediaRecorder.start();
        alert("Screen recording started!");

        // 每 5 分鐘自動分段保存，防止記憶體過載
        recordingInterval = setInterval(() => {
            mediaRecorder.stop();
            mediaRecorder.start();
        }, 5 * 60 * 1000); // 5 分鐘

    } catch (error) {
        console.error("Error accessing display media:", error);
    }
}

function stopScreenRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        clearInterval(recordingInterval); // 清除定時分段
        mediaRecorder.stop(); // 完整停止錄製
        alert("Screen recording stopped!");
    } else {
        alert("No recording in progress.");
    }
}

function saveRecording() {
    const blob = new Blob(chunks, { type: 'video/webm' });
    chunks = []; // 清空快取，釋放記憶體

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recorded-screen-${Date.now()}.webm`;
    a.click();
}
