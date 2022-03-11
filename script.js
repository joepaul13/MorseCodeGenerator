const morseTable = [
  { char: "A", code: ".-" },
  { char: "B", code: "-..." },
  { char: "C", code: "-.-." },
  { char: "D", code: "-.." },
  { char: "E", code: "." },
  { char: "F", code: "..-." },
  { char: "G", code: "--." },
  { char: "H", code: "...." },
  { char: "I", code: ".." },
  { char: "J", code: ".---" },
  { char: "K", code: "-.-" },
  { char: "L", code: ".-.." },
  { char: "M", code: "--" },
  { char: "N", code: "-." },
  { char: "O", code: "---" },
  { char: "P", code: ".--." },
  { char: "Q", code: "--.-" },
  { char: "R", code: ".-." },
  { char: "S", code: "..." },
  { char: "T", code: "-" },
  { char: "U", code: "..-" },
  { char: "V", code: "...-" },
  { char: "W", code: ".--" },
  { char: "X", code: "-..-" },
  { char: "Y", code: "-.--" },
  { char: "Z", code: "--.." },
  { char: "0", code: "-" },
  { char: "1", code: ".-" },
  { char: "2", code: "..-" },
  { char: "3", code: "...-" },
  { char: "4", code: "....-" },
  { char: "5", code: "....." },
  { char: "6", code: "-...." },
  { char: "7", code: "-..." },
  { char: "8", code: "-.." },
  { char: "9", code: "-." },
  { char: ".", code: ".-.-.-" },
  { char: ",", code: "-..-" },
  { char: "?", code: "..-.." },
  { char: "=", code: "-...-" },
  { char: " ", code: " " },
];

const textToMorse = (text) =>
  text
    .split("")
    .map((char) => {
      const entry = morseTable.find(
        (morse) => morse.char.toLowerCase() === char.toLowerCase()
      );
      return entry ? entry.code : "";
    })
    .join(" ");

const morseToText = (morse) => {
  const words = morse.split(/\s{2,}/g);
  return words
    .map((word) =>
      word
        .split(" ")
        .map((code) => {
          const entry = morseTable.find((morse) => morse.code === code);
          return entry ? entry.char : "";
        })
        .join("")
    )
    .join(" ");
};

const text = document.querySelector("#input");
const out = document.querySelector("#output");
let convButton = document.querySelector(".convert");
const playButton = document.querySelector(".play");

const handleClick = () => {
  const morse = textToMorse(text.value);
  // console.log(morse);
  out.value = morse;
};

text.addEventListener("keyup", handleClick);
convButton.addEventListener("click", handleClick);

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const oscillator = audioCtx.createOscillator();
oscillator.type = "square";
oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime); // value in hertz
// oscillator.connect(audioCtx.destination);
oscillator.start(0);
console.log(audioCtx);
console.log(oscillator);

var connect = () => {
  oscillator.connect(audioCtx.destination);
  playButton.innerHTML = "Pause";
};

var disconnect = () => {
  oscillator.disconnect(0);
};

playButton.addEventListener("click", () => {
  const morse = [...out.value];

  let i = 0;
  let unit = 200;
  let m = "";
  let offset = 0;
  const loop = () => {
    offset = 0;
    if (i < morse.length) {
      out.innerHTML.replace(
        out.value[i],
        '<span style="color: blue;">' + out.value[i] + "</span>"
      );

      m = morse[i];
      setTimeout(connect, 100);
      // connect();
      offset = m === "." ? 300 : m === "-" && 700;
      setTimeout(() => {
        disconnect();
        i++;
        if (offset === 0) {
          setTimeout(loop, 1000);
        } else {
          loop();
        }
      }, offset);
    } else playButton.innerHTML = "Play";
  };
  loop();
});
