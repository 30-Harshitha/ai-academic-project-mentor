/* ==========================================
   submit-project.js
   AI Academic Project Mentor
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
        alert("Please login first.");
        window.location.href = "/login.html";
        return;
    }

    /* -------------------------------
       Load User Details (Fail-Safe Checks)
    ------------------------------- */
    document.querySelectorAll(".currentUser-name").forEach(name => {
        if (name) name.textContent = currentUser.fullName || "";
    });

    document.querySelectorAll(".currentUser-avatar").forEach(img => {
        if (img) {
            img.src = currentUser.avatarUrl || 
                      "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser.fullName);
        }
    });

    /* -------------------------------
       Proposal PDF Upload & Drag-Drop (MATCHED IDs)
    ------------------------------- */
    const proposalArea = document.getElementById("proposal-drag-area");
    const proposalInput = document.getElementById("proposalFile");

    if (proposalArea && proposalInput) {
        proposalArea.style.cursor = "pointer";

        proposalArea.addEventListener("click", function (e) {
            if (e.target !== proposalInput) {
                proposalInput.click();
            }
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            proposalArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                proposalArea.style.borderColor = "var(--accent)";
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            proposalArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                proposalArea.style.borderColor = "var(--border)";
            }, false);
        });

        proposalArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length === 0) return;

            const file = files[0];
            if (file.type !== "application/pdf") {
                alert("Only PDF files are allowed.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert("Maximum PDF size is 5MB.");
                return;
            }

            proposalInput.files = files; 
            const label = proposalArea.querySelector(".drag-drop-label");
            if (label) label.textContent = `Selected: ${file.name}`;
        });

        proposalInput.addEventListener("change", function () {
            if (proposalInput.files.length === 0) return;
            const file = proposalInput.files[0];
            if (file.type !== "application/pdf") {
                alert("Only PDF files are allowed.");
                proposalInput.value = "";
                return;
            }
            const label = proposalArea.querySelector(".drag-drop-label");
            if (label) label.textContent = `Selected: ${file.name}`;
        });
    }

    /* -------------------------------
       Images Upload & Drag-Drop (MATCHED IDs)
    ------------------------------- */
    const imageArea = document.getElementById("images-drag-area");
    const imageInput = document.getElementById("imagesFiles");

    if (imageArea && imageInput) {
        imageArea.style.cursor = "pointer";

        imageArea.addEventListener("click", function (e) {
            if (e.target !== imageInput) {
                imageInput.click();
            }
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            imageArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageArea.style.borderColor = "var(--accent)";
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            imageArea.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageArea.style.borderColor = "var(--border)";
            }, false);
        });

        imageArea.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const files = dt.files;
            if (files.length > 3) {
                alert("Maximum 3 images allowed.");
                return;
            }

            imageInput.files = files;
            const label = imageArea.querySelector(".drag-drop-label");
            if (label) label.textContent = `Selected ${files.length} image(s)`;
        });

        imageInput.addEventListener("change", function () {
            if (imageInput.files.length > 3) {
                alert("Maximum 3 images allowed.");
                imageInput.value = "";
                return;
            }
            const label = imageArea.querySelector(".drag-drop-label");
            if (label) label.textContent = `Selected ${imageInput.files.length} image(s)`;
        });
    }

    /* -------------------------------
       Submit Project Form Processing
    ------------------------------- */
    const projectForm = document.getElementById("project-submit-form");

    if (projectForm) {
        projectForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const titleEl = document.getElementById("projectTitle");
            const domainEl = document.getElementById("projectDomain");
            const categoryEl = document.getElementById("projectCategory");
            const teamEl = document.getElementById("teamSize");
            const durationEl = document.getElementById("duration");
            const diffEl = document.getElementById("difficulty");
            const techEl = document.getElementById("techStack");
            const descEl = document.getElementById("projectDesc");
            const probEl = document.getElementById("problemStatement");
            const outcomeEl = document.getElementById("expectedOutcome");

            if (!proposalInput || proposalInput.files.length === 0) {
                alert("Please upload the proposal PDF.");
                return;
            }

            const teamSize = teamEl ? parseInt(teamEl.value) : 1;

            if (!titleEl?.value || !domainEl?.value || !categoryEl?.value) {
                alert("Please fill all required fields.");
                return;
            }

            const formData = new FormData();
            const submissionId = "SUB-" + Math.random().toString(36).substring(2, 8).toUpperCase();

            formData.append("submissionId", submissionId);
            formData.append("studentName", currentUser.fullName || "");
            formData.append("studentEmail", currentUser.email || "");
            formData.append("projectTitle", titleEl.value.trim());
            formData.append("projectDomain", domainEl.value);
            formData.append("projectCategory", categoryEl.value);
            formData.append("teamSize", teamSize);
            formData.append("duration", durationEl ? durationEl.value : "");
            formData.append("difficulty", diffEl ? diffEl.value : "");
            formData.append("projectDescription", descEl ? descEl.value.trim() : "");
            formData.append("problemStatement", probEl ? probEl.value.trim() : "");
            formData.append("expectedOutcome", outcomeEl ? outcomeEl.value.trim() : "");
            formData.append("status", "Submitted");
            formData.append("submittedOn", new Date().toLocaleString());

            const techStackText = techEl ? techEl.value.trim() : "";
            formData.append("techStack", techStackText); 
            formData.append("proposalFile", proposalInput.files[0]);

            if (imageInput && imageInput.files.length > 0) {
                for (let i = 0; i < imageInput.files.length; i++) {
                    formData.append("imagesFiles", imageInput.files[i]);
                }
            }

            try {
                // FIXED: Explicit Content-Type string dropped entirely. Passing standard formData object stream.
                const response = await fetch(
                    "https://ai-academic-project-mentor.onrender.com/api/projects",
                    {
                        method: "POST",
                        body: formData
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message || "Project submission failed.");
                    return;
                }

                const mockSubIdEl = document.getElementById("mock-submission-id");
                if (mockSubIdEl) mockSubIdEl.textContent = submissionId;
                
                const successModalElement = document.getElementById("submissionSuccessModal");
                if (successModalElement && typeof bootstrap !== 'undefined') {
                    const successModal = new bootstrap.Modal(successModalElement);
                    successModal.show();
                } else {
                    alert("Project submitted successfully!");
                    window.location.href = "/dashboard.html";
                }

            } catch (err) {
                console.error(err);
                alert("Unable to connect to server.");
            }
        });
    }

    /* -------------------------------
       Modal Redirection Handler 
    ------------------------------- */
    const dashboardBtn = document.getElementById("modal-redirect-dash-btn");
    if (dashboardBtn) {
        dashboardBtn.addEventListener("click", function () {
            window.location.href = "/dashboard.html";
        });
    }
});