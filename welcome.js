function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Event listener when the DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    const name = getQueryParam('name');
    const welcomeMessage = document.getElementById('welcome-message');
    const userInitial = document.getElementById('user-initial');
    
    if (name) {
        welcomeMessage.textContent = `Welcome, ${name}!`;
        if (userInitial) {
            userInitial.textContent = name.charAt(0).toUpperCase();
        }
    } else {
        welcomeMessage.textContent = 'Welcome to the QuizTion App!';
    }

    document.querySelector('.exit-btn').addEventListener('click', function() {
        console.log('Exit button clicked');
        if (confirm('Are you sure you want to exit the quiz?')) {
            window.location.href = "index.html"; 
        }
    });

    document.querySelector('.continue-btn').addEventListener('click', function() {
        console.log('Continue button clicked');
        startQuiz(); 
    });     
    
    const tryAgainBtn = document.querySelector('.tryAgain-btn');
    if (tryAgainBtn) {
        tryAgainBtn.addEventListener('click', function() {
            resetQuiz(); 
        });
    }

    const goHomeBtn = document.querySelector('.goHome-btn');
    if (goHomeBtn) {
        goHomeBtn.addEventListener('click', function() {
            window.location.href = "index.html";
        });
    }
});

function startQuiz() {
    console.log('Starting quiz...');
    const quizContainer = document.querySelector('#quiz-container');
    const guideImage = document.querySelector('.guide'); 

    if (guideImage) guideImage.style.display = 'none';
    showElement(quizContainer);
    hideElements(['.card', '.guides-wrapper', '.button-wrapper', '.welcome-screen']);
    
    document.body.classList.add('quiz-active');
    
    const quizData = {
        "questions": [
            {
                "id": 1,
                "question": "What is JavaScript?",
                "questionType": "MULTIPLE_CHOICE",
                "options": [
                    "A markup language used to structure web pages",
                    "A programming language used to add interactivity to web pages",
                    "A stylesheet language used to style web pages",
                    "A database management system"
                ],
                "correctAnswer": ["A programming language used to add interactivity to web pages"],
                "points": 1
            },
            {
                "id": 2,
                "question": "The __________ method is used to add an element to the end of an array.<br><small>(Press Enter after answering)</small>",
                "questionType": "FILL_IN_THE_BLANK",
                "correctAnswer": ["push()", "push"],
                "points": 2  
            },
            {
                "id": 3,
                "question": "Which symbol is used to comment a single line in JavaScript?",
                "questionType": "MULTIPLE_CHOICE",
                "options": [
                    "//",
                    "/* */",
                    "#",
                    "--"
                ],
                "correctAnswer": ["//"],
                "points": 1
            },
            {
                "id": 4,
                "question": "Which of the following are valid JavaScript loop constructs? <b>(Select two)</b>",
                "questionType": "CHECKBOX",
                "options": [
                    "for",
                    "if",
                    "while",
                    "switch",
                    "try"
                ],
                "correctAnswer": ["for", "while"], 
                "points": 2
            },
            {
                "id": 5,
                "question": "Which of the following is a JavaScript data type used to represent a collection of key-value pairs?",
                "questionType": "MULTIPLE_CHOICE",
                "options": [
                    "Array",
                    "Object",
                    "String",
                    "Number"
                ],
                "correctAnswer": ["Object"],
                "points": 1
            },
            {
                "id": 6,
                "question": "The __________  keyword is used to declare a constant value in JavaScript.<br><small>(Press Enter after answering)</small>",
                "questionType": "FILL_IN_THE_BLANK",
                "correctAnswer": ["const"],
                "points": 1  
            },
            {
                "id": 7,
                "question": "Which of the following data types is used to store true or false values in JavaScript?",
                "questionType": "MULTIPLE_CHOICE",
                "options": [
                    "String",
                    "Boolean",
                    "Integer",
                    "Object"
                ],
                "correctAnswer": ["Boolean"],
                "points": 1
            },
            {
                "id": 8,
                "question": "Which of the following are JavaScript logical operators? <b>(Select two)</b>",
                "questionType": "CHECKBOX",
                "options": [
                    "&& (AND)",
                    "|| (OR)",
                    "! (NOT)",
                    "+ (Addition)",
                    "- (Subtraction)"
                ],
                "correctAnswer": ["&& (AND)", "|| (OR)"], 
                "points": 2
            }
        ]
    };

    console.log('Quiz Data:', quizData); 

    let currentQuestionIndex = 0;
    let score = 0;
    const totalPoints = quizData.questions.reduce((total, question) => total + question.points, 0); 

    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
    }

    function updateScoreTracker() {
        const scoreValue = document.getElementById('current-score');
        if (scoreValue) {
            scoreValue.textContent = score;
        }
    }

    function getQuestionTypeName(type) {
        const typeNames = {
            'MULTIPLE_CHOICE': 'Multiple Choice',
            'CHECKBOX': 'Multiple Select',
            'FILL_IN_THE_BLANK': 'Fill in the Blank'
        };
        return typeNames[type] || type;
    }

    function loadQuestion(index) {
        console.log(`Loading question ${index}`);
        const question = quizData.questions[index];
        console.log('Question:', question); 
        
        const questionTypeBadge = document.getElementById('question-type-badge');
        if (questionTypeBadge) {
            questionTypeBadge.textContent = getQuestionTypeName(question.questionType);
        }

        const questionElement = createQuestionElement(question, index);
        const questionContent = document.querySelector('#question-content');
        
        if (questionContent) {
            questionContent.innerHTML = ''; 
            questionContent.appendChild(questionElement);
        }
        
        hideNextButton();
    
        const nextButton = createNextButton();
        nextButton.addEventListener('click', handleNextButtonClick);
        questionContent.appendChild(nextButton);
    
        const progressElement = document.querySelector('#question-progress');
        if (progressElement) {
            progressElement.textContent = `Question ${index + 1} of ${quizData.questions.length}`;
        }

        updateProgressBar();
        updateScoreTracker();
    
        const quizContainer = document.querySelector('#quiz-container');
        quizContainer.style.display = 'block'; 
    }
    
    function handleNextButtonClick() {
        const question = quizData.questions[currentQuestionIndex];
        let isCorrect = false;

        console.log(`Processing question ${question.id}: ${question.question}`);

        if (question.questionType === 'CHECKBOX') {
            const selectedOptions = Array.from(document.querySelectorAll(`#question-${question.id} input:checked`))
                .map(input => input.value);

            console.log(`Selected options: ${selectedOptions}`);
            console.log(`Correct answers: ${question.correctAnswer}`);

            isCorrect = checkCheckboxAnswer(selectedOptions, question.correctAnswer);
            
            // Visual feedback for checkboxes
            const allCheckboxes = document.querySelectorAll(`#question-${question.id} .option-box`);
            allCheckboxes.forEach(box => {
                const checkbox = box.querySelector('input[type="checkbox"]');
                const value = checkbox.value;
                
                if (question.correctAnswer.includes(value)) {
                    box.style.background = 'rgba(76, 175, 80, 0.15)';
                    box.style.borderColor = '#4CAF50';
                } else if (checkbox.checked) {
                    box.style.background = 'rgba(231, 76, 60, 0.15)';
                    box.style.borderColor = '#e74c3c';
                }
                checkbox.disabled = true;
            });
            
        } else if (question.questionType === 'FILL_IN_THE_BLANK') {
            const userAnswer = document.querySelector(`#question-${question.id} input`).value.trim();
            console.log(`User answer: ${userAnswer}`);
            console.log(`Correct answers: ${question.correctAnswer}`);

            isCorrect = checkFillInTheBlankAnswer(userAnswer, question.correctAnswer, question);
        } else if (question.questionType === 'MULTIPLE_CHOICE') {
            const selectedOption = document.querySelector(`#question-${question.id} .option-box.selected`);
            const selectedValue = selectedOption ? selectedOption.dataset.selectedValue : null;

            console.log(`Selected option: ${selectedValue}`);
            console.log(`Correct answer: ${question.correctAnswer[0]}`);

            isCorrect = selectedValue === question.correctAnswer[0];
        }

        if (isCorrect) {
            score += question.points;
            console.log(`Correct answer for question ${question.id}! Points awarded: ${question.points}`);
        } else {
            console.log(`Incorrect answer for question ${question.id}.`);
        }

        console.log(`Current score: ${score}`);
        updateScoreTracker();

        currentQuestionIndex++;
        if (currentQuestionIndex < quizData.questions.length) {
            setTimeout(() => {
                loadQuestion(currentQuestionIndex);
            }, 1500);
        } else {
            setTimeout(() => {
                const quizContainer = document.querySelector('#quiz-container');
                quizContainer.innerHTML = ''; 
                quizContainer.style.display = 'none';

                const resultBox = document.querySelector('.result-box');
                resultBox.style.display = 'block'; 

                showResultBox(score, totalPoints);
                hideElement('.next-btn'); 
            }, 1500);
        }
    }
    
    loadQuestion(currentQuestionIndex);
}

function resetQuiz() {
    const quizContainer = document.querySelector('#quiz-container');
    const resultBox = document.querySelector('#result-box');

    if (resultBox) {
        resultBox.style.display = 'none'; 
    }

    if (quizContainer) {
        quizContainer.innerHTML = `
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
                <div id="question-progress" class="question-progress"></div>
            </div>

            <div class="question-display">
                <div class="question-header">
                    <img src="ques.png" alt="Question Icon" class="question-icon">
                    <span class="question-type-badge" id="question-type-badge"></span>
                </div>
                <div id="question-content"></div>
            </div>

            <div class="score-tracker">
                <span class="score-label">Current Score:</span>
                <span class="score-value" id="current-score">0</span>
                <span class="score-total">/ 10</span>
            </div>
        `;
    }

    startQuiz(); 
}

function showResultBox(score, totalPoints) {
    const resultBox = document.querySelector('.result-box');
    const progressValue = document.querySelector('.progress-value');
    const scoreText = document.querySelector('.score-text');
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const performanceBadge = document.getElementById('performance-badge');

    if (resultBox) {
        resultBox.style.display = 'block'; 
    }
    
    const percentage = Math.round((score / totalPoints) * 100);
    
    // Animate progress
    if (progressValue) {
        let currentPercentage = 0;
        const increment = percentage / 50;
        const timer = setInterval(() => {
            currentPercentage += increment;
            if (currentPercentage >= percentage) {
                currentPercentage = percentage;
                clearInterval(timer);
            }
            progressValue.textContent = `${Math.round(currentPercentage)}%`;
        }, 20);
    }
    
    // Animate circular progress
    const progressCircle = document.getElementById('progress-circle');
    if (progressCircle) {
        const circumference = 2 * Math.PI * 80;
        const offset = circumference - (percentage / 100) * circumference;
        setTimeout(() => {
            progressCircle.style.strokeDashoffset = offset;
        }, 100);
        
        // Change color based on percentage
        if (percentage >= 80) {
            progressCircle.style.stroke = '#4CAF50';
        } else if (percentage >= 60) {
            progressCircle.style.stroke = '#FFC107';
        } else {
            progressCircle.style.stroke = '#e74c3c';
        }
    }
    
    if (scoreText) {
        scoreText.textContent = `Your score: ${score} out of ${totalPoints}`; 
    }
    
    // Customize message based on performance
    if (percentage >= 90) {
        if (resultIcon) resultIcon.textContent = '🏆';
        if (resultTitle) resultTitle.textContent = 'Outstanding!';
        if (resultMessage) resultMessage.textContent = 'You are a JavaScript master!';
        if (performanceBadge) {
            performanceBadge.textContent = 'Excellent';
            performanceBadge.style.background = '#4CAF50';
            performanceBadge.style.color = 'white';
        }
    } else if (percentage >= 70) {
        if (resultIcon) resultIcon.textContent = '🎉';
        if (resultTitle) resultTitle.textContent = 'Great Job!';
        if (resultMessage) resultMessage.textContent = 'You did really well!';
        if (performanceBadge) {
            performanceBadge.textContent = 'Good';
            performanceBadge.style.background = '#8BC34A';
            performanceBadge.style.color = 'white';
        }
    } else if (percentage >= 50) {
        if (resultIcon) resultIcon.textContent = '👍';
        if (resultTitle) resultTitle.textContent = 'Not Bad!';
        if (resultMessage) resultMessage.textContent = 'Keep practicing!';
        if (performanceBadge) {
            performanceBadge.textContent = 'Average';
            performanceBadge.style.background = '#FFC107';
            performanceBadge.style.color = 'white';
        }
    } else {
        if (resultIcon) resultIcon.textContent = '📚';
        if (resultTitle) resultTitle.textContent = 'Keep Learning!';
        if (resultMessage) resultMessage.textContent = "Don't give up, try again!";
        if (performanceBadge) {
            performanceBadge.textContent = 'Needs Improvement';
            performanceBadge.style.background = '#e74c3c';
            performanceBadge.style.color = 'white';
        }
    }
}

function checkCheckboxAnswer(selectedOptions, correctAnswers) {
    if (selectedOptions.length !== correctAnswers.length) {
        return false;
    }
    
    const sortedSelected = [...selectedOptions].sort();
    const sortedCorrect = [...correctAnswers].sort();
    
    return sortedSelected.every((option, index) => option === sortedCorrect[index]);
}

function createQuestionElement(question, index) {
    const questionElement = document.createElement('div');
    questionElement.className = 'question-box';
    questionElement.id = `question-${question.id}`;
    questionElement.innerHTML = `<span>${index + 1}. ${question.question}</span>`;

    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';

    if (question.questionType === 'FILL_IN_THE_BLANK') {
        const inputElement = document.createElement('input');
        inputElement.type = 'text';
        inputElement.className = 'fill-blank-input';
        inputElement.placeholder = "Type your answer here...";
        inputElement.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                checkFillInTheBlankAnswer(inputElement.value, question.correctAnswer, question);
            }
        });
        optionsContainer.appendChild(inputElement);
        setTimeout(() => inputElement.focus(), 100);
    } else if (question.questionType === 'CHECKBOX') {
        question.options.forEach(option => {
            const optionElement = createOptionElement(option, question.id, question.correctAnswer, question.questionType);
            optionsContainer.appendChild(optionElement);
        });
    } else {
        question.options.forEach(option => {
            const optionElement = createOptionElement(option, question.id, question.correctAnswer, question.questionType);
            optionsContainer.appendChild(optionElement);
        });
    }

    questionElement.appendChild(optionsContainer);

    return questionElement;
}

function checkFillInTheBlankAnswer(userAnswer, correctAnswers, question) {
    const trimmedAnswer = userAnswer.trim().toLowerCase();
    const inputElement = document.querySelector(`#question-${question.id} input`);

    if (inputElement) {
        inputElement.disabled = true;
    }

    const isCorrect = correctAnswers.some(ans => ans.toLowerCase() === trimmedAnswer);

    if (isCorrect) {
        console.log('Correct answer for Fill in the Blank question!');
        if (inputElement) {
            inputElement.classList.add("correctfill");
        }
    } else {
        console.log('Incorrect answer for Fill in the Blank question.');
        if (inputElement) {
            inputElement.classList.add("incorrectfill");
            inputElement.value = `Incorrect. Correct answer: ${correctAnswers[0]}`;
        }
    }

    showNextButton();
    return isCorrect;
}

function createOptionElement(option, questionId, correctAnswer, questionType) {
    const optionElement = document.createElement('div');
    optionElement.className = 'option-box';

    if (questionType === 'MULTIPLE_CHOICE') {
        optionElement.innerHTML = `<span class="custom-option">${option}</span>`;
        
        optionElement.addEventListener('click', function () {
            console.log('Clicked option:', option);

            const allOptions = document.querySelectorAll(`#question-${questionId} .option-box`);

            allOptions.forEach(el => {
                el.classList.remove('selected');
                el.style.backgroundColor = ''; 
                el.style.borderColor = '#e0e0e0';
            });

            this.classList.add('selected');

            if (option === correctAnswer[0]) {
                this.style.backgroundColor = 'rgba(76, 175, 80, 0.15)';
                this.style.borderColor = '#4CAF50';
            } else {
                this.style.backgroundColor = 'rgba(231, 76, 60, 0.15)';
                this.style.borderColor = '#e74c3c';
                
                allOptions.forEach(el => {
                    if (el.textContent.trim() === correctAnswer[0]) {
                        el.style.backgroundColor = 'rgba(76, 175, 80, 0.15)';
                        el.style.borderColor = '#4CAF50';
                    }
                });
            }

            this.dataset.selectedValue = option;
            
            allOptions.forEach(el => {
                el.style.pointerEvents = 'none';
            });

            showNextButton();
        });
    } else if (questionType === 'CHECKBOX') {
        optionElement.innerHTML = `
            <label class="custom-checkbox">
                <input type="checkbox" value="${option}">
                <span class="checkmark"></span>
                ${option}
            </label>`;
        
        const checkbox = optionElement.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll(`#question-${questionId} input:checked`).length;
            if (checkedCount > 0) {
                showNextButton();
            } else {
                hideNextButton();
            }
        });
    }

    return optionElement;
}

function showNextButton() { 
    const existingNextButton = document.querySelector('.next-btn');
    if (existingNextButton) {
        existingNextButton.style.display = 'block'; 
    } else {
        const nextButton = createNextButton();
        nextButton.addEventListener('click', handleNextButtonClick);
        const questionContent = document.querySelector('#question-content');
        if (questionContent) {
            questionContent.appendChild(nextButton);
            nextButton.style.display = 'block';
        }
    }
}

function hideNextButton() {
    const nextButton = document.querySelector('.next-btn');
    if (nextButton) {
        nextButton.style.display = 'none'; 
    }
}

function showElement(element) {
    if (element) {
        element.style.display = 'block';
    }
}

function hideElement(elementSelector) {
    const element = document.querySelector(elementSelector);
    if (element) {
        element.style.display = 'none';
    }
}

function hideElements(selectorsArray) {
    selectorsArray.forEach(selector => {
        hideElement(selector);
    });
}

function createNextButton() {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next Question →';
    nextButton.className = 'next-btn';
    nextButton.style.display = 'none'; 
    return nextButton;
}

function hideResultBox() {
    const resultBox = document.querySelector('.result-box');
    if (resultBox) {
        resultBox.style.display = 'none'; 
    }

}
