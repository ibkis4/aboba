// Создаем массив изображений
const images = [];
const imgcount= 14
for (let i = 1; i <= imgcount; i++) {
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
  showImageButton.classList.add('centered-button');

  // Показываем изображение
  randomImage.parentElement.style.display = 'block';
  
  showImageButton.style.display = 'none';
  
  // Запускаем первый таймер на 20 секунд
  let timeLeft = 20;
  let delay = 120;
  timerContainer.style.display = 'block';
  timerDisplay.textContent = timeLeft;
  const countdown = setInterval(() => {    
    if (timeLeft > 0){
      
      timeLeft--;
      timerDisplay.textContent = timeLeft;
    }
    console.log('time left' + timeLeft);
  if (timeLeft === 0) {
    clearInterval(countdown);
    
     // clearInterval(countdown);
      randomImage.parentElement.style.display = 'none';
      // Запускаем второй таймер на 2 минуты
      const delayTimer = setInterval(() => {
        console.log('delay' + delay);
        delay--;
        timerDisplay.textContent = delay;
        if (delay == 0) {
          clearInterval(delayTimer);
          randomImage.parentElement.style.display = 'block';
          showImageButton.style.display = 'block';
          
        }
      }, 1000);
    } 
  }, 1000);
  
}

// Добавляем обработчик события на кнопку
showImageButton.addEventListener('click', showImage);
