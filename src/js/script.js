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

const downloader = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ img, src });
    img.src = src;
  });
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
  'https://media.giphy.com/media/l41Yh1olOKd1Tgbw4/200w_d.gif',
  'https://media.giphy.com/media/l3fQsAQUKggBos9IQ/200w_d.gif',
  'https://media.giphy.com/media/IhgPvZQWuhuDpKOmhB/200w_d.gif',
  'https://media.giphy.com/media/xTiTnw6Yg5nzWwQh5C/200w_d.gif',
  'https://media.giphy.com/media/gg4VHcTCsey8U/200w_d.gif',
  'https://media.giphy.com/media/xT8qBijzKv3vzx9Kvu/200w_d.gif',
  'https://media.giphy.com/media/3o6nUQgYhSBUAXBOQo/200w_d.gif',
]);
let gifAmount = 0;

let sides = {0: [], 1: []};

function getTop(side) {
  let top = Math.round(random(0, 8)) * 10;

  if (sides[side].indexOf(top) >= 0) {
    return getTop(side);
  } else {
    sides[side].push(top);
    return top;
  }
}

function addGif(gif) {
  const el = new Image();
  el.src = gif;

  let side = gifAmount % 2;

  let width = random(1, 3);
  let top = getTop(side);
  let left = side ? random(-10, 25 - width) : random(75, 110 - width);

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
  fetch('https://api.github.com/repos/jthawme/stacc/releases/latest')
    .then(resp => resp.json())
    .then(json => {
      const downloadBinary = json.assets[0].browser_download_url;
      const downloadDate = json.assets[0].updated_at;
      const downloadTag = json.tag_name;

      const overlayBtn = document.querySelector('.overlay a');
      const overlaySpan = document.querySelector('.overlay span');

      overlayBtn.href = downloadBinary;
      overlayBtn.innerText = `Download ${downloadTag}`;
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




// =========
//
// PRODUCTHUNT SECTION
//
// =========

function checkProductHunt() {
  const d = new Date();
  const today = `${d.getUTCDate()}-${d.getUTCMonth()}-${d.getUTCFullYear()}`;

  if (window.location.search.includes('producthunt') || today == '25-5-2019') {
    document.body.classList.add('producthunt');
  }
}

checkProductHunt();
