document.addEventListener("DOMContentLoaded", function() {
    const main = document.querySelector('main');
    
    function fadeIn() {
        main.classList.remove('fade-exit', 'fade-exit-active');
        main.classList.add('fade-enter');
        setTimeout(() => {
            main.classList.add('fade-enter-active');
        }, 10);

        setTimeout(() => {
            main.classList.remove('fade-enter', 'fade-enter-active');
        }, 500); // Длительность анимации появления
    }
    
    function fadeOut(callback) {
        main.classList.add('fade-exit');
        setTimeout(() => {
            main.classList.add('fade-exit-active');
            setTimeout(() => {
                callback();  // После завершения анимации исчезновения вызываем callback
            }, 500); // Длительность анимации исчезновения
        }, 10);
    }

    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const currentUrl = window.location.pathname;

            // Проверяем, если ссылка указывает на index.html, перезагружаем страницу
            if (href === "{% url 'index' %}" || href === '/' || currentUrl === '/') {
                return; // Не прерываем стандартное поведение, страница перезагрузится
            }
            
            if (!this.classList.contains('active')) {
                e.preventDefault();
                
                // Обновляем активную ссылку
                document.querySelectorAll('a').forEach(link => {
                    link.classList.remove('active', 'disabled');
                });
                this.classList.add('active', 'disabled');
                
                fadeOut(() => {
                    // Загружаем новый контент через AJAX
                    fetch(href, {
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest' // Указываем, что это AJAX-запрос
                        }
                    })
                    .then(response => response.text())
                    .then(data => {
                        // Извлекаем новый контент для блока <main>
                        const parser = new DOMParser();
                        const newDoc = parser.parseFromString(data, 'text/html');
                        const newMainContent = newDoc.querySelector('main').innerHTML;

                        // Обновляем содержимое блока <main>
                        main.innerHTML = newMainContent;

                        // Обновляем заголовок страницы
                        document.title = newDoc.title;

                        // Обновляем URL в истории браузера
                        window.history.pushState(null, null, href);

                        // Запускаем анимацию появления нового контента
                        fadeIn();
                    })
                    .catch(err => {
                        console.error('Ошибка загрузки страницы через AJAX:', err);
                    });
                });
            }
        });
    });

    // Обрабатываем нажатие кнопок "Назад" и "Вперед" в браузере
    window.addEventListener('popstate', function() {
        fetch(window.location.href, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(data, 'text/html');
            const newMainContent = newDoc.querySelector('main').innerHTML;

            main.innerHTML = newMainContent;
            document.title = newDoc.title;
            fadeIn();
        });
    });

    // Первоначальная анимация появления контента при загрузке страницы
    fadeIn();
});
