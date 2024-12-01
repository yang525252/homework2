let mediaRecorder;
let chunks = [];

// 列出所有可用的音訊裝置
async function getAudioDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioDevices = devices.filter(device => device.kind === 'audioinput');
    
    // 動態生成選項清單
    const select = document.getElementById('audioSource');
    audioDevices.forEach(device => {
        const option = document.createElement('option');
        option.value = device.deviceId;
        option.textContent = device.label || `Audio Device ${device.deviceId}`;
        select.appendChild(option);
    });
}

// 選擇特定音訊裝置並開始錄製
async function startRecording() {
    try {
        const selectedDeviceId = document.getElementById('audioSource').value;
        const audioStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: selectedDeviceId // 使用者選擇的音訊裝置
            }
        });

        // 如果需要錄螢幕畫面，可以加入螢幕流
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false // 不錄系統音效
        });

        // 合併螢幕與音訊流
        const combinedStream = new MediaStream([
            ...screenStream.getVideoTracks(),
            ...audioStream.getAudioTracks()
        ]);

        // 初始化 MediaRecorder
        mediaRecorder = new MediaRecorder(combinedStream);
        mediaRecorder.ondataavailable = event => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        mediaRecorder.onstop = saveRecording;
        mediaRecorder.start();

        alert("Recording started!");
    } catch (error) {
        console.error("Error accessing media devices:", error);
    }
}

// 停止錄製並保存
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        alert("Recording stopped!");
    }
}

// 保存錄製的影片
function saveRecording() {
    const blob = new Blob(chunks, { type: 'video/webm' });
    chunks = []; // 清空快取

    // 生成下載鏈接
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recorded-video-${Date.now()}.webm`;
    a.click();
}

document.addEventListener('DOMContentLoaded', () => {
    getAudioDevices(); // 頁面載入後列出音訊裝置
});
