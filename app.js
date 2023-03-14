// Создаем массив изображений
const images = [];
const imgcount= 14
for (let i = 1; i <= 14; i++) {
  images.push(`img/${i}.jpeg`);
}

// Получаем элементы DOM
const randomImage = document.getElementById('random-image');
const showImageButton = document.getElementById('show-image-button');
const timerContainer = document.querySelector('.timer-container');
const timerDisplay = document.getElementById('timer');

// Функция для генерации случайного числа
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Функция для показа изображения
function showImage() {
  // Получаем случайное изображение
  const randomIndex = getRandomNumber(0, images.length - 1);
  const randomImagePath = images[randomIndex];
  randomImage.src = randomImagePath;
  
  // Показываем изображение
  randomImage.parentElement.style.display = 'block';
  
  // Скрываем кнопку
 // showImageButton.style.display = 'none';
  
  // Запускаем таймер на 5 секунд
  let timeLeft = 20;
  timerContainer.style.display = 'block';
  timerDisplay.textContent = timeLeft;
  const countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft === 0) {
      clearInterval(countdown);
      randomImage.parentElement.style.display = 'none';
      // Запускаем таймер на 3 секунды
      let delay = 10;
      const delayTimer = setInterval(() => {
        delay--;
        timerDisplay.textContent = delay;
        if (delay === 0) {
          clearInterval(delayTimer);
          randomImage.parentElement.style.display = 'block';
          
        }
      }, 1000);
    }
  }, 1000);
}

// Добавляем обработчик события на кнопку
showImageButton.addEventListener('click', showImage);
