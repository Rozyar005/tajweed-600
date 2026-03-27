// 1. Your Question Data (You can add all 600 here!)
let questions = [];

async function startQuiz() {
  const response = await fetch("data.json");
  questions = await response.json();
  loadQuestion(); // Start the game once data is loaded
}

// 2. State Variables
let currentIdx = 0;
let score = 0;
let wrongBucket = [];
let hasAnswered = false; // Prevents double-scoring on one question

// 3. Main Function to Load a Question
function loadQuestion() {
  const qData = questions[currentIdx];
  const container = document.getElementById("options-container");
  const feedback = document.getElementById("feedback-message");

  // Reset for new question
  hasAnswered = false;
  feedback.innerText = "";
  container.innerHTML = "";
  document.getElementById("question-text").innerText = qData.q;

  // Create Option Buttons
  qData.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt, btn);
    container.appendChild(btn);
  });

  updateNavButtons();
}

// 4. Logic to Check the Answer
function checkAnswer(selected, btn) {
  if (hasAnswered) return; // Stop if they already clicked an answer

  const feedback = document.getElementById("feedback-message");
  const qData = questions[currentIdx];
  hasAnswered = true;

  // Disable all buttons in the container
  const allBtns = document.querySelectorAll(".option-btn");
  allBtns.forEach((b) => (b.style.cursor = "default"));

  if (selected === qData.answer) {
    score++;
    feedback.innerText = "زۆر ڕاستە بلیمەت ✨";
    feedback.style.color = "#2ecc71";
    btn.style.background = "#d1fadf"; // Light green highlight
  } else {
    // Add to bucket if it's not already there
    if (!wrongBucket.some((item) => item.id === qData.id)) {
      wrongBucket.push(qData);
    }
    feedback.innerText = `هەڵەیە! وەڵامی ڕاست بریتیە لە: ${qData.answer} ❌`;
    feedback.style.color = "#e74c3c";
    btn.style.background = "#fee2e2"; // Light red highlight
  }

  updateUI();
}

// 5. Navigation Logic
document.getElementById("next-btn").onclick = () => {
  if (currentIdx < questions.length - 1) {
    currentIdx++;
    loadQuestion();
  } else {
    alert("گەشتیتە کۆتایی زیرەک🏁");
  }
};

document.getElementById("prev-btn").onclick = () => {
  if (currentIdx > 0) {
    currentIdx--;
    loadQuestion();
  }
};

// 6. The Bucket Review Logic
document.getElementById("bucket-btn").onclick = () => {
  if (wrongBucket.length > 0) {
    questions = [...wrongBucket]; // Switch current list to mistakes
    wrongBucket = []; // Clear bucket for the new "round"
    currentIdx = 0;
    score = 0; // Reset score for the review round

    updateUI();
    loadQuestion();
  } else {
    alert("پێداچوونەوەت نییە🌟");
  }
};

// 7. UI Helpers
function updateUI() {
  document.getElementById("score").innerText = score;
  document.getElementById("wrong-count").innerText = wrongBucket.length;
}

function updateNavButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  prevBtn.disabled = currentIdx === 0;
  nextBtn.disabled = currentIdx === questions.length - 1;
}

// 8. Initialize the Game
startQuiz();
