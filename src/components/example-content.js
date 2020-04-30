const $nameInput = document.getElementById('input-name');
const $helloButton = document.getElementById('button-say-hello');
const $greeting = document.getElementById('greeting');

$helloButton.addEventListener('click', () => {
  const name = $nameInput.value || 'whoever you are. Enter a name for a personalised greeting';
  const greeting = `Hello, ${name}.`;
  $greeting.innerText = greeting;
});

$nameInput.focus();