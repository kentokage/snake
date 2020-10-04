const SPEEDS = {
  FAST: 30,
  NORMAL: 15,
};

let gameId;
let speed = SPEEDS.NORMAL;

let xDown = (yDown = null);

const canvas = document.getElementById("gc");
const ctx = canvas.getContext("2d");
const fastCheckbox = document.getElementById("fastCheckbox");
fastCheckbox.addEventListener("input", (e) => {
  e.stopPropagation();
  const checked = e.currentTarget.checked;
  speed = checked ? SPEEDS.FAST : SPEEDS.NORMAL;
  clearTimeout(gameId);
  gameId = setInterval(game, 1000 / speed);
});

window.addEventListener("load", () => {
  document.addEventListener("keydown", keyPush);
  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchmove", handleTouchMove);
  gameId = setInterval(game, 1000 / speed);
});

// player
let px = (py = 10);
const trail = [];
let tail = 5;

// grid size and tile count
let gs = (tc = 30);

// apple
let ax = (ay = 15);

// change
let xv = (yv = 0);

function game() {
  px += xv;
  py += yv;

  // wrapping
  if (px < 0) {
    px = tc - 1;
  }

  if (px > tc - 1) {
    px = 0;
  }

  if (py < 0) {
    py = tc - 1;
  }

  if (py > tc - 1) {
    py = 0;
  }

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "lime";
  for (let i = 0; i < trail.length; i++) {
    // -2 because border
    ctx.fillRect(trail[i].x * gs, trail[i].y * gs, gs - 2, gs - 2);
    // if hit itself
    if (trail[i].x === px && trail[i].y === py) {
      tail = 5;
    }
  }

  trail.push({ x: px, y: py });
  // if penalized from hitting itself (up there)
  while (trail.length > tail) {
    trail.shift();
  }

  if (ax === px && ay === py) {
    tail++;
    do {
      ax = Math.floor(Math.random() * tc);
      ay = Math.floor(Math.random() * tc);
    } while (trail.some((pos) => pos.x === ax && pos.y === ay));
  }

  ctx.fillStyle = "red";
  ctx.fillRect(ax * gs, ay * gs, gs - 2, gs - 2);
}

function keyPush(e) {
  switch (e.keyCode) {
    case 37:
      xv = -1;
      yv = 0;
      break;
    case 38:
      xv = 0;
      yv = -1;
      break;
    case 39:
      xv = 1;
      yv = 0;
      break;
    case 40:
      xv = 0;
      yv = 1;
      break;
    default:
      break;
  }
}

function handleTouchStart(e) {
  if (!e.touches?.[0]) return;
  const { clientX, clientY } = e.touches[0];
  xDown = clientX;
  yDown = clientY;
}

function handleTouchMove(e) {
  e.preventDefault();
  if (!xDown || !yDown || !e.touches?.[0]) return;

  const xDiff = xDown - e.touches[0].clientX;
  const yDiff = yDown - e.touches[0].clientY;

  if (Math.abs(xDiff) > Math.abs(yDiff)) {
    if (xDiff > 0) {
      // left swipe
      xv = -1;
      yv = 0;
    } else {
      // right swipe
      xv = 1;
      yv = 0;
    }
  } else {
    if (yDiff > 0) {
      // up swipe
      xv = 0;
      yv = -1;
    } else {
      // down swipe
      xv = 0;
      yv = 1;
    }
  }
}
