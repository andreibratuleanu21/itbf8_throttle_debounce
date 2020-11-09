let counter = 0;
setInterval(function () {
  document.querySelector('#counter').textContent = counter;
}, 500);

const socket = new WebSocket('ws://localhost:8080');

// RAW MOVE EV
// document.querySelector('#content').addEventListener('mousemove', function(event) {
//  socket.send(`${event.x}:${event.y - 80}`);
//  counter++;
// });

function processMoveEv(ev) {
  socket.send(`${ev.x}:${ev.y - 80}`);
  counter++;
}

document.querySelector('#content').addEventListener('mousemove', processMoveEv);

// Debounced MOVE EV
/**
document.querySelector('#content').addEventListener('mousemove', function(event) {
  debounce(processMoveEv, 1000)(event);
});
*/

// document.querySelector('#content').addEventListener('mousemove', debounce(processMoveEv, 1000));


// Throttled MOVE EV
// document.querySelector('#content').addEventListener('mousemove', throttle(processMoveEv, 100));

// Debounce & Throttle
function debounce(func, delay) {
  var timeoutId
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(context, args), delay);
  };
};

function throttle(func, limit) {
  var inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

socket.onmessage = function (event) {
  // an id : x : y;
  const data = event.data.split(':');
  const element = document.querySelector(`#content > #${data[0]}`);
  if (element) {
    element.style.left = `${data[1]}px`;
    element.style.top = `${data[2]}px`;
  } else {
    const newElement = document.createElement("div");
    newElement.id = data[0];
    newElement.style.position = 'absolute';
    newElement.style.display = 'block';
    newElement.style.width = '16px';
    newElement.style.height = '16px';
    newElement.style.background = '#'+Math.random().toString(16).substr(2,6);
    newElement.style.left = `${data[1]}px`;
    newElement.style.top = `${data[2]}px`;
    document.querySelector(`#content`).appendChild(newElement);
  }
};
