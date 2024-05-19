import alphanumcodes from './morse_alphanum.json';
import puncutation from './morse_punc.json';

let playing = false;


function beep(length: number) {
  return new Promise((resolve) => {
    const context = new AudioContext();
    const oscillator = context.createOscillator()
    /*if you want to beep without using a wave file*/
    oscillator.type = "sine";
    oscillator.frequency.value = 1000;
    oscillator.connect(context.destination);
    oscillator.start();

    setTimeout(() => {
      oscillator.stop();
      resolve(undefined);
    }, length);
  });
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const input = document.getElementById('morse_text') as HTMLInputElement;
const play_button = document.getElementById('play_button') as HTMLButtonElement;
const output = document.getElementById('output') as HTMLDivElement;

play_button.addEventListener('click', async () => {
  if (playing) return;

  const text = input.value;

  if (!text.length) return

  output.innerText = '';
  output.style.display = 'block';
  playing = true;

  const morse = text.split('').map((char) => {
    if (char === ' ') {
      return ' ';
    }

    if (char.match(/[a-zA-Z0-9]/)) {
      // @ts-ignore
      return alphanumcodes[char.toUpperCase()];
    }

    // @ts-ignore
    if (!puncutation[char]) return ' ';

    // @ts-ignore
    return puncutation[char];
  }).join(' ');

  for (const char of morse.split('')) {
    if (char === '.') {
      await beep(100);
      output.innerText += '.';
      await sleep(100);
    } else if (char === '-') {
      await beep(300);
      output.innerText += '-';
      await sleep(100);
    } else if (char === ' ') {
      output.innerText += ' ';
      await sleep(300);
    }
  }

  playing = false;
});


