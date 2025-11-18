// js/validation.js
document.addEventListener('DOMContentLoaded', function() {
    // Authorization form validation
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        initAuthValidation(authForm);
    }

    // Survey validation
    const surveySection = document.querySelector('.survey-section');
    if (surveySection) {
        initSurveyValidation(surveySection);
    }

    // Validation of ingredient analysis
    const analysisForm = document.querySelector('.analysis-container');
    if (analysisForm) {
        initAnalysisValidation(analysisForm);
    }
});

// Authorization form validation
function initAuthValidation(form) {
    const nameInput = document.getElementById('name');
    const surnameInput = document.getElementById('surname');
    const emailInput = document.getElementById('email');
    const confirmBtn = document.querySelector('.confirm-btn');

    if (confirmBtn) {
        confirmBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const nameValid = validateRequiredField(nameInput, 'Ім\'я обов\'язкове для заповнення');
            const surnameValid = validateRequiredField(surnameInput, 'Прізвище обов\'язкове для заповнення');
            const emailValid = validateEmail(emailInput);

            if (nameValid && surnameValid && emailValid) {
                // Survey review before transition
                if (validateSurvey()) {
                    window.location.href = this.getAttribute('href');
                }
            }
        });
    }

    // Real validation upon input
    [nameInput, surnameInput, emailInput].forEach(input => {
        if (input) {
            input.addEventListener('blur', function() {
                if (this.id === 'email') {
                    validateEmail(this);
                } else {
                    validateRequiredField(this, `Поле обов'язкове для заповнення`);
                }
            });

            input.addEventListener('input', function() {
                clearError(this);
            });
        }
    });
}

// Survey validation
function initSurveyValidation(surveySection) {
    const skinGroups = document.querySelectorAll('input[name="skin"]');
    const problemGroups = document.querySelectorAll('input[name="problem"]');
    const goalGroups = document.querySelectorAll('input[name="goal"]');

    // Adding handlers to track changes
    [...skinGroups, ...problemGroups, ...goalGroups].forEach(input => {
        input.addEventListener('change', function() {
            clearGroupError(this.closest('.survey-group'));
        });
    });
}

// Validation of ingredient analysis
function initAnalysisValidation(container) {
    const ingredientsTextarea = document.getElementById('ingredients');
    const analyzeBtn = container.querySelector('.confirm-btn');

    if (analyzeBtn && ingredientsTextarea) {
        // Replacing the original function
        const originalAnalyze = window.analyzeIngredients;
        
        window.analyzeIngredients = function() {
            if (validateIngredients(ingredientsTextarea)) {
                originalAnalyze.call(this);
            }
        };

        ingredientsTextarea.addEventListener('input', function() {
            clearError(this);
        });
    }
}

// Validation utilities
function validateRequiredField(field, errorMessage) {
    const value = field.value.trim();
    
    if (!value) {
        showError(field, errorMessage);
        return false;
    }
    
    if (value.length < 2) {
        showError(field, 'Поле повинно містити щонайменше 2 символи');
        return false;
    }
    
    clearError(field);
    return true;
}

function validateEmail(emailField) {
    const email = emailField.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
        showError(emailField, 'Email обов\'язковий для заповнення');
        return false;
    }
    
    if (!emailRegex.test(email)) {
        showError(emailField, 'Будь ласка, введіть коректний email');
        return false;
    }
    
    clearError(emailField);
    return true;
}

function validateIngredients(ingredientsField) {
    const ingredients = ingredientsField.value.trim();
    
    if (!ingredients) {
        showError(ingredientsField, 'Будь ласка, введіть інгредієнти для аналізу');
        return false;
    }
    
    if (ingredients.split(',').length < 2) {
        showError(ingredientsField, 'Будь ласка, введіть щонайменше 2 інгредієнти через кому');
        return false;
    }
    
    clearError(ingredientsField);
    return true;
}

function validateSurvey() {
    let isValid = true;
    
    // Skin type check
    const skinSelected = document.querySelector('input[name="skin"]:checked');
    if (!skinSelected) {
        showGroupError(document.querySelector('input[name="skin"]').closest('.survey-group'), 'Будь ласка, оберіть ваш тип шкіри');
        isValid = false;
    }
    
    // Check for problems
    const problemsSelected = document.querySelectorAll('input[name="problem"]:checked');
    if (problemsSelected.length === 0) {
        showGroupError(document.querySelector('input[name="problem"]').closest('.survey-group'), 'Будь ласка, оберіть принаймні одну проблему');
        isValid = false;
    }
    
    // Checking the purpose of care
    const goalSelected = document.querySelector('input[name="goal"]:checked');
    if (!goalSelected) {
        showGroupError(document.querySelector('input[name="goal"]').closest('.survey-group'), 'Будь ласка, оберіть вашу мету догляду');
        isValid = false;
    }
    
    return isValid;
}

// Functions for displaying errors
function showError(field, message) {
    clearError(field);
    
    field.style.borderColor = '#ff4444';
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.cssText = `
        color: #ff4444;
        font-size: 12px;
        margin-top: 5px;
        font-family: 'Montserrat', sans-serif;
    `;
    
    if (field.id === 'ingredients') {
        errorElement.style.textAlign = 'center';
        errorElement.style.width = '100%';
    }
    
    errorElement.textContent = message;
    
    field.parentNode.appendChild(errorElement);
}

function showGroupError(groupElement, message) {
    clearGroupError(groupElement);
    
    const errorElement = document.createElement('div');
    errorElement.className = 'group-error-message';
    errorElement.style.cssText = `
        color: #ff4444;
        font-size: 14px;
        margin-top: 10px;
        padding: 10px;
        background: #fff5f5;
        border: 1px solid #ff4444;
        border-radius: 4px;
        font-family: 'Montserrat', sans-serif;
    `;
    errorElement.textContent = message;
    
    groupElement.appendChild(errorElement);
}

function clearError(field) {
    field.style.borderColor = '#E6E6E6';
    
    const errorElement = field.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearGroupError(groupElement) {
    const errorElement = groupElement.querySelector('.group-error-message');
    if (errorElement) {
        errorElement.remove();
    }
}

// Export functions for global use
window.validateSurvey = validateSurvey;