/* ==========================================
   submit-project.js
   AI Academic Project Mentor - Idea Submission & Per-Project State Management
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const inputField = document.getElementById('projectDesc');
    const templateCards = document.querySelectorAll('.template-card');
    const projectForm = document.getElementById("project-submit-form");

    // 1. Recommended Projects Template Click Handler
    templateCards.forEach(card => {
        card.addEventListener('click', () => {
            templateCards.forEach(c => c.classList.remove('active-template'));
            card.classList.add('active-template');

            const ideaText = card.getAttribute('data-idea');
            if (inputField && ideaText) {
                inputField.value = ideaText;
                inputField.focus();
            }
        });
    });

    // 2. Press Enter inside Textarea to Submit Directly
    if (inputField) {
        inputField.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (projectForm) {
                    projectForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                }
            }
        });
    }

    // 3. Form Submission & Automatic Redirection to Agent Hub
    if (projectForm) {
        projectForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const descVal = inputField ? inputField.value.trim() : "";
            if (!descVal) {
                alert("Please enter or select a project idea first!");
                return;
            }

            const teamSizeVal = document.getElementById("teamSize") ? document.getElementById("teamSize").value : "2";
            const durationVal = document.getElementById("duration") ? document.getElementById("duration").value : "8";
            const weeklyHoursVal = document.getElementById("weeklyHours") ? document.getElementById("weeklyHours").value : "10";

            const newProjectId = "PROJ-" + Date.now();

            const newProjectPayload = {
                id: newProjectId,
                description: descVal,
                projectTitle: descVal.substring(0, 45) + "...",
                teamSize: teamSizeVal,
                duration: durationVal,
                weeklyHours: weeklyHoursVal,
                completedCheckinWeek: 0, // Starts at Milestone 1
                status: "Active", // Active Project
                timestamp: new Date().toISOString()
            };

            // Read existing projects history array
            let history = JSON.parse(localStorage.getItem("allSubmittedProjects")) || [];

            // Mark any previous active projects as "On Hold" (preserving their exact completedCheckinWeek!)
            history = history.map(p => {
                if (p.status === "Active") {
                    return { ...p, status: "On Hold" };
                }
                return p;
            });

            // Prepend new project to history
            history.unshift(newProjectPayload);
            localStorage.setItem("allSubmittedProjects", JSON.stringify(history));

            // Save new project as activeProjectIdea for Agent Hub
            localStorage.setItem("activeProjectIdea", JSON.stringify(newProjectPayload));
            localStorage.setItem("completedCheckinWeek", "0");

            const submitBtn = document.getElementById("submit-btn");
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `Launching Agent Hub <i class="fas fa-spinner fa-spin ms-2"></i>`;
            }

            // Post to backend database asynchronously
            try {
                const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { fullName: "Student", email: "student@university.edu" };
                fetch("http://localhost:5000/api/projects", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: newProjectId,
                        studentName: currentUser.fullName || "Student",
                        studentEmail: currentUser.email || "student@university.edu",
                        projectTitle: newProjectPayload.projectTitle,
                        projectDescription: newProjectPayload.description,
                        teamSize: newProjectPayload.teamSize,
                        duration: newProjectPayload.duration + " Weeks",
                        completedCheckinWeek: 0,
                        status: "Active"
                    })
                }).catch(err => console.warn("Backend save log:", err));
            } catch (e) {
                console.warn("Offline fallback payload set.");
            }

            // Redirect immediately to Agent Hub!
            setTimeout(() => {
                window.location.href = "agent-hub.html?autoRun=true";
            }, 400);
        });
    }

    // Default baseline initial idea text if empty
    if (inputField && !inputField.value.trim()) {
        inputField.value = "An empathetic conversational agent with sentiment analysis that offers personalized mindfulness exercises, study burnout tracking, and support resources.";
    }
});