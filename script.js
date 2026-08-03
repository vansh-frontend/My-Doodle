const searchInput = document.getElementById('searchInput');
const micBtn = document.getElementById('micBtn');
const lensBtn = document.getElementById('lensBtn');

function handleSearch(query) {
  if (!query || query.trim() === '') {
    return;
  }

  const searchURL = 'https://www.google.com/search?q=' + encodeURIComponent(query);
  window.open(searchURL, '_self');
}

searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    handleSearch(searchInput.value);
  }
});

micBtn.addEventListener('click', () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition is not supported in your browser. Please try Chrome.');
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      const recognition = new window.webkitSpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      micBtn.style.backgroundColor = 'rgba(234, 67, 53, 0.1)';

      recognition.start();

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        searchInput.value = speechToText;
        handleSearch(speechToText);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        micBtn.style.backgroundColor = 'transparent';
      };

      recognition.onend = () => {
        stream.getTracks().forEach((track) => track.stop());
        micBtn.style.backgroundColor = 'transparent';
      };
    })
    .catch((err) => {
      console.error('Error accessing the microphone:', err);
      alert('Please allow microphone access to use voice search.');
    });
});



if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}
