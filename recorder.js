let mediaRecorder;
let chunks = [];
let recordingInterval;

async function startScreenRecording() {
    try {
        // 獲取螢幕畫面
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true // 如果需要錄製系統音效，這裡必須為 true
        });

        // 獲取麥克風音訊
        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: true
        });

        // 合併音訊與螢幕影片
        const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
        ]);

        // 初始化錄製器
        mediaRecorder = new MediaRecorder(combinedStream);

        // 當有錄製資料時，儲存到 chunks
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        // 停止錄製時保存影片
        mediaRecorder.onstop = saveRecording;

        mediaRecorder.start();
        alert("Screen recording with audio started!");

        // 每 5 分鐘分段保存
        recordingInterval = setInterval(() => {
            mediaRecorder.stop();
            mediaRecorder.start();
        }, 5 * 60 * 1000); // 5 分鐘

    } catch (error) {
        console.error("Error accessing media devices:", error);
    }
}

function stopScreenRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        clearInterval(recordingInterval); // 停止定時分段
        mediaRecorder.stop(); // 完整停止錄製
        alert("Screen recording stopped!");
    } else {
        alert("No recording in progress.");
    }
}

function saveRecording() {
    const blob = new Blob(chunks, { type: 'video/webm' });
    chunks = []; // 清空快取，釋放記憶體

    // 生成下載鏈接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recorded-screen-with-audio-${Date.now()}.webm`;
    a.click();
}
