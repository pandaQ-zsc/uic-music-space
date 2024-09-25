// setTimeout(()=>{
//   document.body.click();
// },500)
document.addEventListener('DOMContentLoaded', function() {
  // 创建音频元素
  var audio = new Audio('./audio/we_are_the_world.mp3');
  audio.src = './audio/we_are_the_world.mp3';
  audio.autoplay = true;
  audio.loop = true; // 如果需要循环播放

  // 初始化播放/暂停按钮
  let toggleButton = document.querySelector('.toggle-audio');

  // 设置音频播放状态
  // var isPlaying = true;
  var isPlaying = localStorage.getItem('audioIsPlaying') === 'true';
  // 初始化播放器
  initAudioPlayer(audio, toggleButton);

  function initAudioPlayer(audioElement, buttonElement) {
    // 静默播放音频
    audioElement.muted = true;
    audioElement.play().catch(function(error) {
      console.error('Audio playback failed:', error);
    });

    // 播放/暂停音频
    buttonElement.addEventListener('click', function() {
      if (isPlaying) {
        audioElement.pause();
        buttonElement.textContent = 'Play';
        isPlaying = false;
      } else {
        playAudio();
        buttonElement.textContent = 'Pause';
        isPlaying = true;
      }
      localStorage.setItem('audioIsPlaying', isPlaying);
    });

    // 在首次用户交互时恢复音量
    let firstInteraction = true;
    window.addEventListener('click', function() {
      if (firstInteraction) {
        firstInteraction = false;
        playAudio();
      }
    });

    // 恢复音量并播放音频
    function playAudio() {
      audioElement.muted = false;
      audioElement.volume = 1;
      audioElement.play().catch(function(error) {
        console.error('Audio playback failed:', error);
        // 尝试解决静音策略问题
        if (!audioElement.muted && !audioElement.paused) {
          // 播放无声的一小段音频，然后播放主音频
          audioElement.volume = 0;
          audioElement.play().then(function() {
            audioElement.volume = 1;
          });
        }
      });
    }
    // 页面加载时恢复播放状态
    if (isPlaying) {
      playAudio();
    }
  }
});
