let mediaRecorder;
let chunks = [];
let recordingInterval;

async function getAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    console.log(audioDevices); // 列出所有麥克風
}

// 列出音訊裝置後，讓用戶選擇一個特定的音源
async function selectAudioInput(deviceId) {
    const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
            deviceId: deviceId // 選定的麥克風 ID
        }
    });
    return audioStream;
}

async function startScreenRecording() {
    try {
        // 僅錄製螢幕畫面與系統音效（注意 audio: true）
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true // 僅啟用系統音效
        });

        // 初始化 MediaRecorder
        mediaRecorder = new MediaRecorder(screenStream);

        // 處理錄製的數據
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        // 停止錄製時保存檔案
        mediaRecorder.onstop = saveRecording;

        mediaRecorder.start();
        alert("Screen recording started!");

        // 每 5 分鐘自動分段保存
        recordingInterval = setInterval(() => {
            mediaRecorder.stop();
            mediaRecorder.start();
        }, 5 * 60 * 1000); // 每 5 分鐘

    } catch (error) {
        console.error("Error accessing media devices:", error);
    }
}

function stopScreenRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        clearInterval(recordingInterval); // 清除定時器
        mediaRecorder.stop(); // 停止錄製
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
