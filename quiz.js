document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('name-input');
    const yesButton = document.getElementById('yes-button');
    const nameError = document.getElementById('name-error');

    // Auto-focus on name input
    if (nameInput) {
        nameInput.focus();
    }

    // Handle Enter key press
    if (nameInput) {
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                startQuizFromHome();
            }
        });

        // Clear error on input
        nameInput.addEventListener('input', function() {
            if (nameError) {
                nameError.style.display = 'none';
            }
            nameInput.style.borderColor = '#e0e0e0';
        });
    }

    // Handle button click
    if (yesButton) {
        yesButton.addEventListener('click', startQuizFromHome);
    }

    function startQuizFromHome() {
        const name = nameInput.value.trim();
        
        if (!name) {
            if (nameError) {
                nameError.style.display = 'block';
            }
            nameInput.style.borderColor = '#e74c3c';
            nameInput.focus();
            return;
        }

        // Store name and navigate
        window.location.href = `quiz.html?name=${encodeURIComponent(name)}`;
    }
});