document.addEventListener('DOMContentLoaded', () => {
    // 1. Создаем структуру модального окна прямо в коде и добавляем в body
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = '<img class="lightbox-image" src="" alt="Увеличенный скриншот">';
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('.lightbox-image');

    // 2. Отслеживаем клики по картинкам в галерее логов
    document.addEventListener('click', (e) => {
        // Проверяем, что кликнули именно по картинке внутри галереи проекта
        if (e.target.closest('.project-view-gallery img')) {
            const clickedImgSrc = e.target.src;
            lightboxImg.src = clickedImgSrc; // Подсовываем путь к картинке в модалку
            overlay.classList.add('custom-open'); // Плавно открываем окно
        }
    });

    // 3. Закрываем окно при клике в любое место темного фона
    overlay.addEventListener('click', () => {
        overlay.classList.remove('custom-open');
    });
});
