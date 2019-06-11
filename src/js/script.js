// =========
//
// UTILITIES SECTION
//
// =========

const framer = (cb, time) => {
    let timer = setTimeout(() => {
        clearTimeout(timer);
        cb(() => framer(cb, time));
    }, time);
};


// =========
//
// TITLE SECTION
//
// =========
const titleSpans = document.querySelectorAll('.title span');
let titleIndex = 0;

const titleIncrement = (end = () => {}) => {
  for (let i = 0; i < titleSpans.length; i++) {
    titleSpans[i].style.display = titleIndex == i ? 'block' : 'none';
  }

  titleIndex++;

  if (titleIndex >= titleSpans.length) {
    titleIndex = 0;
  }

  end();
};

titleIncrement();
framer(titleIncrement, 500);

// =========
//
// SCREENS SECTION
//
// =========
const screensImg = document.querySelector('.screens img');
let screenIndex = 0;

const screenImages = [
  require('../images/screens/01.jpg'),
  require('../images/screens/02.jpg'),
  require('../images/screens/03.jpg'),
  require('../images/screens/04.jpg'),
];

const downloader = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ img, src });
    img.src = src;
  });
};

const screenIncrement = (end = () => {}) => {
  screensImg.src = screenImages[screenIndex];

  screenIndex++;

  if (screenIndex >= screenImages.length) {
    screenIndex = 0;
  }

  end();
};

Promise.all(screenImages.map(downloader))
  .then(images => {
    screenIncrement();
    framer(screenIncrement, 1500);
  });



// =========
//
// GIFS SECTION
//
// =========
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function random(min, max) {
  return (Math.random() * (max - min)) + min;
}

const gifsWrapper = document.querySelector('.gifs');
const gifs = shuffle([
  'https://media.giphy.com/media/W5pJzrCZ8mWoo/giphy-downsized.gif',
  'https://media.giphy.com/media/b0sufgAxmcoYU/200w_d.gif',
  'https://media.giphy.com/media/8Ry7iAVwKBQpG/200w_d.gif',
  'https://media.giphy.com/media/pO4UHglOY2vII/200w_d.gif',
  'https://media.giphy.com/media/jUwpNzg9IcyrK/giphy-downsized.gif',
  'https://media.giphy.com/media/3ornjSBhRWTaL3l2X6/giphy-downsized.gif',
  'https://media.giphy.com/media/10jBPVms8GkWS4/giphy-downsized.gif',
  'https://media.giphy.com/media/pSpmpxFxFwDpC/200w_d.gif',
  'https://media.giphy.com/media/fdzYnnjwPBlGPeqCL6/200w_d.gif',
  'https://media.giphy.com/media/3ohs7MXRRtMcKI99K0/200w_d.gif',
  'https://media.giphy.com/media/2rBUTRvX3FCHS/200w_d.gif',
  'https://media.giphy.com/media/nBWhJwDW3sWyc/200w_d.gif',
]);
let gifAmount = 0;

function addGif(gif) {
  const el = new Image();
  el.src = gif;

  let width = random(1, 3);
  let top = random(0, 90);
  let left = gifAmount % 2 ? random(-10, 25 - width) : random(75, 110 - width);

  if (left > 25 && left < 75) {
    addGif(gif);
    return;
  }

  el.setAttribute('style', `top: ${top}%; left: ${left}%; --width-modifier: ${ width}`);

  gifsWrapper.appendChild(el);
  gifAmount++;
}

const gifIncrement = () => {
  if (gifs.length && gifAmount < 10) {
    const gif = gifs.pop();

    downloader(gif)
      .then(() => {
        addGif(gif);
        setTimeout(gifIncrement, random(1000, 2500));
      });
  }
};

gifIncrement();




// =========
//
// LINKS SECTION
//
// =========

const downloadBtn = document.querySelector('.download');

if (navigator.share) {
  downloadBtn.innerText = 'Share';
  downloadBtn.addEventListener('click', e => {
    e.preventDefault();
    navigator.share({
        title: document.title,
        text: document.querySelector('meta[name=description]').content,
        url: document.location.origin,
    })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
  }, false);
}

const getLatestBinary = () => {
  fetch('https://api.github.com/repos/creativetechnologylab/web-kiosk/releases/latest')
    .then(resp => resp.json())
    .then(json => {
      const downloadBinary = json.assets[0].browser_download_url;
      const downloadDate = json.assets[0].updated_at;

      const overlayBtn = document.querySelector('.overlay a');
      const overlaySpan = document.querySelector('.overlay span');

      overlayBtn.href = downloadBinary;
      overlaySpan.innerText = `Mac OS – ${ getDate(downloadDate) }`;

      if (!navigator.share) {
        downloadBtn.href = downloadBinary;
      }
    });
}

const getDate = (d) => {
  let _d = new Date(d);
  let months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return `${ months[_d.getUTCMonth() ]} ${_d.getUTCFullYear()}`
}

getLatestBinary();
