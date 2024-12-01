let mediaRecorder;
let chunks = [];

// 開始錄製
async function startScreenRecording() {
    try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false // 可根據需求啟用音訊
        });

        mediaRecorder = new MediaRecorder(screenStream);

        // 當有錄製資料時，儲存到 `chunks`
        mediaRecorder.ondataavailable = event => chunks.push(event.data);

        // 停止錄製時生成影片檔案
        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'recorded-screen.webm';
            a.click();
        };

        mediaRecorder.start();
        alert("Screen recording started!");

    } catch (error) {
        console.error("Error accessing display media:", error);
    }
}

// 停止錄製
function stopScreenRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        alert("Screen recording stopped!");
    } else {
        alert("No recording in progress.");
    }
}
