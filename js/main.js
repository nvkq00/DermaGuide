// js/main.js - Основний JavaScript файл для DermaGuide

document.addEventListener('DOMContentLoaded', function() {
    console.log('DermaGuide main.js loaded');

    // ===== 2.2. Динамічна зміна контенту =====
    // 2.2.1. Показ поточної дати у футері
    function updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            };
            
            let dateString = now.toLocaleDateString('uk-UA', options);
            
            // Робимо першу літеру дня великою
            const firstSpaceIndex = dateString.indexOf(' ');
            if (firstSpaceIndex > 0) {
                const dayName = dateString.substring(0, firstSpaceIndex);
                const restOfString = dateString.substring(firstSpaceIndex);
                dateString = dayName.charAt(0).toUpperCase() + 
                             dayName.slice(1).toLowerCase() + 
                             restOfString;
            }
            
            dateElement.textContent = dateString;
        }
    }

    // ===== 2.2. Динамічна зміна контенту =====
    // 2.2.2. Створення акордеона "Показати більше" через JS
    function createAccordion() {
        const mainElement = document.querySelector('main');
        if (!mainElement) return;
        
        // Перевіряємо, чи акордеон вже існує
        if (document.getElementById('accordion-section')) return;
        
        // Визначаємо текст для різних сторінок
        let accordionTitle = 'Корисна інформація';
        let accordionContent = `
            <p>DermaGuide допомагає зрозуміти склад косметики та отримати персоналізовані рекомендації.</p>
            <p>Зберігайте свої дані для отримання більш точних порад та використовуйте аналізатор для перевірки продуктів.</p>
        `;
        
        // Визначаємо поточну сторінку
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        if (currentPage.includes('index') || currentPage === '' || currentPage === '/') {
            accordionTitle = 'Детальніше про DermaGuide';
            accordionContent = `
                <p><strong>DermaGuide</strong> - це інноваційна платформа, яка поєднує наукові знання про шкіру з сучасними технологіями. Наша місія - зробити догляд за шкірою доступним, зрозумілим та ефективним для кожного.</p>
                
                <p><strong>Наші переваги:</strong></p>
                <ul class="accordion-list">
                    <li>Аналіз понад 5,000+ інгредієнтів на основі наукових досліджень</li>
                    <li>Персоналізовані рекомендації відповідно до вашого типу шкіри</li>
                    <li>Просте пояснення складних косметичних термінів</li>
                    <li>Постійне оновлення бази даних з новими дослідженнями</li>
                </ul>
                
                <p><strong>Як це працює?</strong> Ми аналізуємо склад ваших косметичних засобів, оцінюємо їх безпеку та ефективність, а потім надаємо персоналізовані рекомендації з урахуванням ваших потреб.</p>
            `;
        } 
        
        // Створюємо акордеон
        const accordionSection = document.createElement('section');
        accordionSection.id = 'accordion-section';
        accordionSection.className = 'accordion-section';
        
        accordionSection.innerHTML = `
            <button id="show-more-btn" class="btn-nav">Показати більше</button>
            <div id="hidden-content">
                <h3>${accordionTitle}</h3>
                ${accordionContent}
            </div>
        `;
        
        // Додаємо акордеон в кінець main
        mainElement.appendChild(accordionSection);
        
        // Ініціалізуємо роботу акордеона
        initAccordion();
    }

    // Функція для ініціалізації роботи акордеона
    function initAccordion() {
        const accordionBtn = document.getElementById('show-more-btn');
        const hiddenContent = document.getElementById('hidden-content');
        
        if (accordionBtn && hiddenContent) {
            // Спочатку ховаємо контент
            hiddenContent.style.display = 'none';
            
            accordionBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                if (hiddenContent.style.display === 'none' || hiddenContent.style.display === '') {
                    hiddenContent.style.display = 'block';
                    accordionBtn.textContent = 'Показати менше';
                    accordionBtn.classList.add('active');
                } else {
                    hiddenContent.style.display = 'none';
                    accordionBtn.textContent = 'Показати більше';
                    accordionBtn.classList.remove('active');
                }
            });
        }
    }

    // ===== 3.1. Робота з кліками =====
    // 3.1.1. Кнопка "Змінити тему"
    function initThemeToggle() {
        const themeBtn = document.getElementById('theme-toggle');
        
        if (themeBtn) {
            themeBtn.addEventListener('click', function() {
                document.body.classList.toggle('dark-theme');
                const isDark = document.body.classList.contains('dark-theme');
                localStorage.setItem('dermaGuide-theme', isDark ? 'dark' : 'light');
                
                // Оновлення тексту кнопки
                themeBtn.textContent = isDark ? 'Світла тема' : 'Темна тема';
            });
            
            // Завантаження теми з LocalStorage
            const savedTheme = localStorage.getItem('dermaGuide-theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-theme');
                themeBtn.textContent = 'Світла тема';
            }
        }
    }

    // ===== 3.2. Події миші та клавіатури =====
    // 3.2.1. Підсвітка меню наведенням миші
    function initMenuHover() {
        const menuItems = document.querySelectorAll('.main-nav a, .btn-nav, .simple-nav a');
        
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.classList.add('menu-highlight');
            });
            
            item.addEventListener('mouseleave', function() {
                this.classList.remove('menu-highlight');
            });
        });
    }

    // 3.2.2. Зміна розміру шрифту клавішами
    function initFontSizeControls() {
        let fontSize = 100;
        
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'ArrowUp' || e.key === '+' || e.key === '=') {
                    e.preventDefault();
                    fontSize = Math.min(fontSize + 10, 150);
                    updateFontSize();
                } else if (e.key === 'ArrowDown' || e.key === '-') {
                    e.preventDefault();
                    fontSize = Math.max(fontSize - 10, 70);
                    updateFontSize();
                }
            }
        });
        
        function updateFontSize() {
            document.body.style.fontSize = fontSize + '%';
            localStorage.setItem('dermaGuide-fontSize', fontSize);
        }
        
        const savedFontSize = localStorage.getItem('dermaGuide-fontSize');
        if (savedFontSize) {
            fontSize = parseInt(savedFontSize);
            updateFontSize();
        }
    }

    // ===== 4. Робота з формами та валідацією =====
    function initFormHandling() {
        const authForm = document.querySelector('.auth-form');
        if (!authForm) return;
        
        const confirmBtn = document.querySelector('.confirm-btn');
        if (!confirmBtn) return;
        
        // Створюємо блок для успішних повідомлень
        const successContainer = document.createElement('div');
        successContainer.id = 'form-success-message';
        successContainer.className = 'form-success-message';
        
        // Додаємо повідомлення в правильне місце
        const surveySection = document.querySelector('.survey-section');
        if (surveySection && confirmBtn) {
            surveySection.insertBefore(successContainer, confirmBtn);
        }
        
        // 1. ДОДАЄМО ОБРОБНИК ПОДІЇ SUBMIT ДО ФОРМИ
        authForm.addEventListener('submit', function(e) {
            console.log('Форма відправляється!');
            e.preventDefault(); // Забороняємо стандартну відправку форми
            
            // Очищаємо всі попередні повідомлення про помилки
            clearAllErrors();
            
            let hasErrors = false;
            
            // 2. Зчитуємо всі дані з форми
            const formData = {
                name: document.getElementById('name')?.value.trim() || '',
                surname: document.getElementById('surname')?.value.trim() || '',
                email: document.getElementById('email')?.value.trim() || '',
                skinType: document.querySelector('input[name="skin"]:checked')?.value || '',
                problems: Array.from(document.querySelectorAll('input[name="problem"]:checked')).map(cb => cb.value),
                goal: document.querySelector('input[name="goal"]:checked')?.value || ''
            };
               
            // Перевірка імені
            if (!formData.name) {
                showFieldError('name', 'Введіть, будь ласка, ім\'я');
                hasErrors = true;
            } else if (formData.name.length < 3) {
                showFieldError('name', 'Імʼя повинно містити щонайменше 3 символи');
                hasErrors = true;
            }
            
            // Перевірка прізвища
            if (!formData.surname) {
                showFieldError('surname', 'Введіть, будь ласка, прізвище');
                hasErrors = true;
            } else if (formData.surname.length < 3) {
                showFieldError('surname', 'Прізвище повинно містити щонайменше 3 символи');
                hasErrors = true;
            }
            
            // Перевірка email
            if (!formData.email) {
                showFieldError('email', 'Введіть, будь ласка, email');
                hasErrors = true;
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(formData.email)) {
                    showFieldError('email', 'Введіть, будь ласка, коректний email');
                    hasErrors = true;
                }
            }
            
            // Перевірка типу шкіри
            if (!formData.skinType) {
                showSurveyGroupError('skin', 'Оберіть, будь ласка, тип шкіри');
                hasErrors = true;
            }
            
            // Перевірка проблем
            if (formData.problems.length === 0) {
                showSurveyGroupError('problem', 'Оберіть, будь ласка, принаймні одну проблему');
                hasErrors = true;
            }
            
            // Перевірка мети
            if (!formData.goal) {
                showSurveyGroupError('goal', 'Оберіть, будь ласка, мету догляду');
                hasErrors = true;
            }
            
            // Якщо є помилки - зупиняємо відправку
            if (hasErrors) {
                console.log('Знайдено помилки валідації');
                return;
            }
            
            // 4. Виводимо дані у консоль (для перевірки)
            console.log('=== Дані форма ===');
            console.log('Ім\'я:', formData.name);
            console.log('Прізвище:', formData.surname);
            console.log('Email:', formData.email);
            console.log('Тип шкіри:', formData.skinType);
            console.log('Проблеми:', formData.problems);
            console.log('Мета догляду:', formData.goal);
            console.log('=======================================');
            
            // 5. Показуємо повідомлення про успіх
            showSuccessMessage(' Реєстрація успішна! Зачекайте, ми переносимо вас на сторінку рекомендацій');
            
            // 6. Очищаємо форму при успіху
            setTimeout(() => {
                // Очищаємо текстові поля
                document.getElementById('name').value = '';
                document.getElementById('surname').value = '';
                document.getElementById('email').value = '';
                
                // Знімаємо всі radio кнопки
                document.querySelectorAll('input[type="radio"]').forEach(radio => {
                    radio.checked = false;
                });
                
                // Знімаємо всі checkbox
                document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                });
                
                console.log('Форму очищено!');
                
                // 7. Перенаправляємо на наступну сторінку через 2 секунди
                setTimeout(() => {
                    console.log('Перенаправляємо на recommendations.html');
                    window.location.href = 'recommendations.html';
                }, 2000);
            }, 1000);
        });
        
        // Функція для показу помилок
        
        // Для текстових полів (ім'я, прізвище, email)
        function showFieldError(fieldId, message) {
            const field = document.getElementById(fieldId);
            if (!field) return;
            
            // Додаємо клас помилки
            field.classList.add('field-error');
            
            // Створюємо елемент для повідомлення про помилку
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error-message';
            errorElement.textContent = message;
            
            // Знаходимо батьківський контейнер поля
            const inputGroup = field.closest('.input-group');
            if (inputGroup) {
                // Видаляємо стару помилку, якщо вона є
                const oldError = inputGroup.querySelector('.field-error-message');
                if (oldError) oldError.remove();
                
                // Додаємо нову помилку після поля
                inputGroup.appendChild(errorElement);
            }
        }
        
        // Для груп опитування (тип шкіри, проблеми, мета)
        function showSurveyGroupError(groupName, message) {
            // Знаходимо перший input в групі
            const firstInput = document.querySelector(`input[name="${groupName}"]`);
            if (!firstInput) return;
            
            // Знаходимо батьківський контейнер групи
            const groupContainer = firstInput.closest('.survey-group');
            if (!groupContainer) return;
            
            // Створюємо повідомлення про помилку
            const errorElement = document.createElement('div');
            errorElement.className = 'survey-error-message';
            errorElement.textContent = message;
            
            // Видаляємо стару помилку, якщо вона є
            const oldError = groupContainer.querySelector('.survey-error-message');
            if (oldError) oldError.remove();
            
            // Додаємо нову помилку в кінець групи
            groupContainer.appendChild(errorElement);
        }
        
        // Очищення всіх помилок
        function clearAllErrors() {
            // Очищаємо повідомлення про помилки
            document.querySelectorAll('.field-error-message, .survey-error-message').forEach(el => el.remove());
            
            // Скидаємо класи помилок
            document.querySelectorAll('#name, #surname, #email').forEach(field => {
                field.classList.remove('field-error');
            });
            
            // Ховаємо повідомлення про успіх
            successContainer.style.display = 'none';
        }
        
        // Функція для показу успішного повідомлення
        function showSuccessMessage(text) {
            successContainer.textContent = text;
            successContainer.style.display = 'block';
        }
        
        // Для текстових полів
        ['name', 'surname', 'email'].forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.addEventListener('input', function() {
                    // Очищаємо клас помилки
                    this.classList.remove('field-error');
                    
                    // Очищаємо повідомлення про помилку
                    const inputGroup = this.closest('.input-group');
                    if (inputGroup) {
                        const errorElement = inputGroup.querySelector('.field-error-message');
                        if (errorElement) errorElement.remove();
                    }
                });
            }
        });
        
        // Для груп опитування
        ['skin', 'problem', 'goal'].forEach(groupName => {
            document.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
                input.addEventListener('change', function() {
                    // Очищаємо повідомлення про помилку в групі
                    const groupContainer = this.closest('.survey-group');
                    if (groupContainer) {
                        const errorElement = groupContainer.querySelector('.survey-error-message');
                        if (errorElement) errorElement.remove();
                    }
                });
            });
        });
        
        // Також додаємо обробник кліку на кнопку для сумісності
        confirmBtn.addEventListener('click', function(e) {
            // Викликаємо submit форми при кліку на кнопку
            authForm.dispatchEvent(new Event('submit'));
        });
        
        console.log('Обробник submit додано до форми');
    }
   
    // ===== 2.1. Маніпуляція елементами =====
    function initElementManipulation() {
        // 2.1.1. Знайти всі елементи з класом .benefit-text і змінити їм стиль
        const benefitTexts = document.querySelectorAll('.benefit-text');
        benefitTexts.forEach(text => {
            text.style.transition = 'color 0.3s ease';
            text.addEventListener('mouseenter', function() {
                this.classList.add('benefit-highlight');
            });
            text.addEventListener('mouseleave', function() {
                this.classList.remove('benefit-highlight');
            });
        });
        
        // 2.1.2. Додати новий елемент (наприклад, <p>) у кінець основного контейнера <main>
        const mainElement = document.querySelector('main');
        if (mainElement && !document.getElementById('js-dynamic-element')) {
            const demoElement = document.createElement('div');
            demoElement.id = 'js-dynamic-element';
            demoElement.className = 'js-dynamic-element disclaimer-style';
            demoElement.innerHTML = `
                <div class="disclaimer-content">
                    <h3>Важливий дисклеймер</h3>
                    <p><strong>Інформація, надана на цій сторінці, є виключно ознайомчою і не замінює консультації лікаря-дерматолога.</strong></p>
                    <p>Перед використанням будь-яких косметичних засобів або зміною рутини догляду, обов'язково проконсультуйтеся з професійним фахівцем.</p>
                    <p>Ви можете користуватися нашими функціями: змінювати тему (темна/світла), змінювати розмір шрифту (Ctrl + ↑/↓), отримувати персоналізовані рекомендації.</p>
                </div>
            `;
            mainElement.appendChild(demoElement);
        }
    }

    // ===== 5. Робота з LocalStorage =====
    function initLocalStorageFeatures() {
        // Зберігаємо останній переглянутий продукт
        const productLinks = document.querySelectorAll('a[href*="product"]');
        productLinks.forEach(link => {
            link.addEventListener('click', function() {
                const productName = this.querySelector('h3')?.textContent || this.textContent;
                localStorage.setItem('dermaGuide-lastViewed', JSON.stringify({
                    url: this.href,
                    name: productName,
                    timestamp: new Date().toISOString()
                }));
            });
        });
    }


  // ===== Аналізатор інгредієнтів =====
  function initIngredientAnalyzer() {
    const analyzeBtn = document.querySelector('.analysis-container .confirm-btn');
    const ingredientsTextarea = document.getElementById('ingredients');
    
    if (!analyzeBtn || !ingredientsTextarea) return;
    
    // Перевіряємо, чи вже є обробник
    if (analyzeBtn.hasAttribute('data-analyzer-initialized')) return;
    
    analyzeBtn.addEventListener('click', analyzeIngredients);
    analyzeBtn.setAttribute('data-analyzer-initialized', 'true');
    
    // Валідація при введенні
    ingredientsTextarea.addEventListener('input', function() {
      clearIngredientError(this);
    });
  }

  function analyzeIngredients() {
    const ingredientsTextarea = document.getElementById('ingredients');
    const ingredientsText = ingredientsTextarea.value.trim();
    
    // Валідація
    if (!ingredientsText) {
      showIngredientError(ingredientsTextarea, 'Будь ласка, введіть інгредієнти для аналізу');
      return;
    }
    
    if (ingredientsText.split(',').length < 2) {
      showIngredientError(ingredientsTextarea, 'Будь ласка, введіть щонайменше 2 інгредієнти через кому');
      return;
    }
    
    clearIngredientError(ingredientsTextarea);
    
    const ingredients = ingredientsText.split(',').map(ing => ing.trim()).filter(ing => ing);
    const resultsTable = document.getElementById('results-table')?.getElementsByTagName('tbody')[0];
    
    if (!resultsTable) return;
    
    resultsTable.innerHTML = '';
    
    ingredients.forEach(ingredient => {
      const row = resultsTable.insertRow();
      const cell1 = row.insertCell(0);
      const cell2 = row.insertCell(1);
      const cell3 = row.insertCell(2);
      
      cell1.textContent = ingredient;
      
      // Визначаємо рівень безпеки
      let safetyLevel = 'safe';
      let safetyText = 'Безпечний';
      let description = 'Нейтральний інгредієнт, добре переноситься більшістю типів шкіри';
      
      const ingredientLower = ingredient.toLowerCase();
      
      if (ingredientLower.includes('alcohol')) {
        safetyLevel = 'danger';
        safetyText = 'Небезпечний';
        description = 'Викликає сильні подразнення та почервоніння';
      } else if (ingredientLower.includes('parfum') || ingredientLower.includes('fragrance')) {
        safetyLevel = 'warning';
        safetyText = 'Потенційно небезпечний';
        description = 'Може викликати сухість або подразнення у чутливої шкіри';
      } else if (ingredientLower.includes('salicylic') || ingredientLower.includes('niacinamide') || 
                 ingredientLower.includes('hyaluronic') || ingredientLower.includes('glycerin')) {
        safetyLevel = 'safe';
        safetyText = 'Безпечний';
        description = 'Ефективний для проблемної шкіри, допомагає боротися з висипаннями';
      }
      
      // Використовуємо CSS класи замість inline-стилів
      cell2.innerHTML = `<span class="ingredient-safety ${safetyLevel}">${safetyText}</span>`;
      cell3.textContent = description;
    });
    
    document.getElementById('results').style.display = 'block';
    
    // Прокручуємо до результатів
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  }

  function showIngredientError(field, message) {
    clearIngredientError(field);
    
    field.classList.add('ingredient-error');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'ingredient-error-message';
    errorElement.textContent = message;
    
    const container = field.closest('.input-group') || field.parentNode;
    container.appendChild(errorElement);
  }

  function clearIngredientError(field) {
    field.classList.remove('ingredient-error');
    
    const container = field.closest('.input-group') || field.parentNode;
    const errorElement = container.querySelector('.ingredient-error-message');
    if (errorElement) {
      errorElement.remove();
    }
  }

    // ===== Ініціалізація всіх функцій =====
    function initAll() {
        updateCurrentDate();
        createAccordion();
        initThemeToggle();
        initMenuHover();
        initFontSizeControls();
        initFormHandling();
        initLocalStorageFeatures();
        initElementManipulation();
        initIngredientAnalyzer();
        
        console.log('All main.js features initialized');
    }

    // Запускаємо все
    initAll();
});