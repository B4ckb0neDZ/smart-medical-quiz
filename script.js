
let questions = [];
let currentQuestionIndex = 0;
let correctCount = 0;
let wrongCount = 0;

function logDebug(msg) {
    document.getElementById("debug-log").textContent += msg + "\n";
}

function testCSV() {
    fetch("questions.csv")
        .then(res => {
            logDebug("✅ CSV chargé avec succès");
            return res.text();
        })
        .then(data => {
            logDebug("🔍 Contenu CSV :\n" + data);
        })
        .catch(err => logDebug("❌ Erreur chargement CSV : " + err));
}

function testJS() {
    logDebug("✅ Le moteur JavaScript fonctionne");
}

function forcerPremiereQuestion() {
    if (questions.length > 0) {
        currentQuestionIndex = 0;
        showQuestion();
    } else {
        logDebug("⚠️ Aucune question disponible pour forcer l'affichage.");
    }
}

fetch("questions.csv")
    .then(res => res.text())
    .then(data => {
        logDebug("✅ Chargement initial du CSV...");
        const lines = data.trim().split("\n").slice(1);
        questions = lines.map(line => {
            const [q, o1, o2, o3, o4, correct, exp] = line.split(",");
            return {
                question: q,
                options: [o1, o2, o3, o4],
                correct: correct,
                explanation: exp
            };
        });
        logDebug("✅ Questions prêtes : " + questions.length);
        showQuestion();
    })
    .catch(err => logDebug("❌ Erreur initiale de chargement du CSV : " + err));

function showQuestion() {
    const q = questions[currentQuestionIndex];
    if (!q) {
        logDebug("⚠️ Aucune question trouvée à l'index " + currentQuestionIndex);
        return;
    }
    document.getElementById("question-box").textContent = q.question;
    const optionsBox = document.getElementById("options-box");
    optionsBox.innerHTML = "";
    q.options.forEach(opt => {
        const btn = document.createElement("button");
        btn.textContent = opt;
        btn.className = "option";
        btn.onclick = () => selectAnswer(opt);
        optionsBox.appendChild(btn);
    });
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("next-btn").disabled = true;
}

function selectAnswer(selected) {
    const q = questions[currentQuestionIndex];
    const feedback = document.getElementById("feedback");
    if (selected === q.correct) {
        correctCount++;
        feedback.innerHTML = "<p><strong>Bonne réponse !</strong></p><p>" + q.explanation + "</p>";
    } else {
        wrongCount++;
        feedback.innerHTML = "<p><strong>Mauvaise réponse.</strong></p><p>" + q.explanation + "</p>";
    }
    updateStats();
    document.getElementById("next-btn").disabled = false;
}

function updateStats() {
    const total = correctCount + wrongCount;
    const stats = document.getElementById("stats");
    const score = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    stats.innerHTML = \`Réponses totales : \${total}<br>Bonnes réponses : \${correctCount}<br>Mauvaises réponses : \${wrongCount}<br>Score : \${score}%\`;
}

document.getElementById("next-btn").onclick = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        document.getElementById("quiz-container").innerHTML = "<p>Quiz terminé. Merci pour votre participation !</p>";
        document.getElementById("feedback").innerHTML = "";
    }
};
