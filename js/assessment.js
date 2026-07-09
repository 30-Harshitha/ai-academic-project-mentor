/* ==========================================
   ASSESSMENT.JS - PART 1
   Login, User Load, Progress Bar
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    // -----------------------------
    // Check Login
    // -----------------------------
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    // -----------------------------
    // Navbar User Details
    // -----------------------------
    document.querySelectorAll(".currentUser-name").forEach(name => {
        name.textContent = currentUser.fullName;
    });

    document.querySelectorAll(".currentUser-avatar").forEach(img => {

        if (currentUser.avatarUrl) {

            img.src = currentUser.avatarUrl;

        } else {

            img.src =
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(currentUser.fullName);

        }

    });

    // -----------------------------
    // Logout
    // -----------------------------
    document.querySelectorAll(".logout-action").forEach(btn => {

        btn.addEventListener("click", function (e) {

            e.preventDefault();

            localStorage.removeItem("currentUser");

            window.location.href = "login.html";

        });

    });

    // -----------------------------
    // Progress Elements
    // -----------------------------
    const progressBar =
        document.getElementById("assessment-prog-bar");

    const progressText =
        document.getElementById("assessment-prog-text");

    const form =
        document.getElementById("skill-assessment-form");

    // Total Skills
    const TOTAL_SKILLS = 16;

    // -----------------------------
    // Update Progress
    // -----------------------------
    function updateProgress() {

        const checked =
            form.querySelectorAll("input[type='radio']:checked");

        const completed = checked.length;

        const percent =
            Math.round((completed / TOTAL_SKILLS) * 100);

        progressBar.style.width = percent + "%";

        progressBar.setAttribute(
            "aria-valuenow",
            percent
        );

        progressText.innerHTML =
            percent + "% Completed";

    }

    // -----------------------------
    // Live Progress
    // -----------------------------
    const radios =
        form.querySelectorAll("input[type='radio']");

    radios.forEach(radio=>{
        radio.addEventListener("change",updateProgress);
    });
    updateProgress();
    /* ==========================================
   ASSESSMENT.JS - PART 2
   Load & Auto Save Assessment
========================================== */

    // -----------------------------
    // Local Storage Key
    // -----------------------------
    

    // -----------------------------
    // Rating Values
    // -----------------------------
    const scoreMap = {

        beginner: 1,
        intermediate: 2,
        advanced: 3,
        expert: 4

    };

    // -----------------------------
    // Calculate Score
    // -----------------------------
    function calculateScore() {

        let total = 0;

        let answered = 0;

        radios.forEach(function (radio) {

            if (radio.checked) {

                answered++;

                total += scoreMap[radio.value];

            }

        });

        return {

            answered: answered,
            total: total

        };

    }
   /* ==========================================
   PART 3 - SAVE ASSESSMENT
========================================== */

/* ==========================================
   PART 3 - SAVE ASSESSMENT TO MYSQL
========================================== */

const assessmentForm =
    document.getElementById("skill-assessment-form");

assessmentForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const result = calculateScore();

    const score =
        Math.round((result.total / (TOTAL_SKILLS * 4)) * 100);

    let level = "Beginner";

    if (score >= 85) {

        level = "Expert";

    } else if (score >= 65) {

        level = "Advanced";

    } else if (score >= 40) {

        level = "Intermediate";

    }

    let skills = {};

    radios.forEach(function (radio) {

        if (radio.checked) {

            skills[radio.name] = radio.value;

        }

    });
    if (result.answered < TOTAL_SKILLS) {

    alert("Please answer all 16 questions before submitting.");

    return;

}

    try {

        const response = await fetch(

            "http://localhost:5000/api/users/assessment",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: currentUser.email,

                    score: score,

                    level: level,

                    skills: JSON.stringify(skills)

                })

            }

        );

        if (!response.ok || !data.success) {

    alert(data.message || "Assessment submission failed.");

    return;



        }

        alert(
            "Assessment Submitted Successfully!\n\n" +
            "Score : " + score + "/100\n" +
            "Level : " + level
        );

        window.location.href = "submit-project.html";

    }

    catch (err) {

        console.error(err);

        alert("Unable to connect to server.");

    }

});
});