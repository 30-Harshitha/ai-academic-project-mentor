/* ==========================================
   MY PROJECTS PAGE
========================================== */

document.addEventListener("DOMContentLoaded", async function () {

    // ==========================
    // Check Login
    // ==========================

    const currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    // ==========================
    // Load User Name & Avatar
    // ==========================

    document.querySelectorAll(".currentUser-name")
        .forEach(name => {

            name.textContent =
                currentUser.fullName;

        });

    document.querySelectorAll(".currentUser-avatar")
        .forEach(img => {

            if (currentUser.profileImage) {

                img.src = currentUser.profileImage;

            } else {

                img.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(currentUser.fullName);

            }

        });

    // ==========================
    // Load Projects
    // ==========================

    try {

        const response = await fetch(

            "http://localhost:5000/api/projects/" +
            currentUser.email

        );

        const myProjects = await response.json();

        document.getElementById("projectCount").textContent =
            myProjects.length;

        const container =
            document.getElementById("projectsContainer");

        const noProjects =
            document.getElementById("noProjects");

        container.innerHTML = "";

        if (myProjects.length === 0) {

            noProjects.classList.remove("d-none");

            return;

        }

        noProjects.classList.add("d-none");

        myProjects.forEach(project => {

            const card =
                document.createElement("div");

            card.className =
                "card-custom mb-4";

            card.innerHTML = `

                <div class="d-flex justify-content-between align-items-center">

                    <div>

                        <h4 class="fw-bold mb-2">
                            ${project.projectTitle}
                        </h4>

                        <p class="mb-1">
                            <strong>Domain:</strong>
                            ${project.projectDomain}
                        </p>

                        <p class="mb-1">
                            <strong>Category:</strong>
                            ${project.projectCategory}
                        </p>

                        <p class="mb-1">
                            <strong>Status:</strong>

                            <span class="badge bg-success">
                                ${project.status}
                            </span>

                        </p>

                        <p class="text-muted">
                            Submitted :
                            ${project.submittedOn}
                        </p>

                    </div>

                    <div>

                        <button
                            class="btn btn-primary viewBtn">

                            View

                        </button>

                    </div>

                </div>

            `;

            card.querySelector(".viewBtn")
                .addEventListener("click", function () {

                    document.getElementById("projectDetails").innerHTML = `

                        <tr>
                            <th>Project Title</th>
                            <td>${project.projectTitle}</td>
                        </tr>

                        <tr>
                            <th>Domain</th>
                            <td>${project.projectDomain}</td>
                        </tr>

                        <tr>
                            <th>Category</th>
                            <td>${project.projectCategory}</td>
                        </tr>

                        <tr>
                            <th>Team Size</th>
                            <td>${project.teamSize}</td>
                        </tr>

                        <tr>
                            <th>Duration</th>
                            <td>${project.duration}</td>
                        </tr>

                        <tr>
                            <th>Difficulty</th>
                            <td>${project.difficulty}</td>
                        </tr>

                        <tr>
                            <th>Tech Stack</th>
                            <td>${project.techStack}</td>
                        </tr>

                        <tr>
                            <th>Description</th>
                            <td>${project.projectDescription}</td>
                        </tr>

                        <tr>
                            <th>Problem Statement</th>
                            <td>${project.problemStatement}</td>
                        </tr>

                        <tr>
                            <th>Expected Outcome</th>
                            <td>${project.expectedOutcome}</td>
                        </tr>

                        <tr>
                            <th>Proposal PDF</th>
                            <td>${project.proposalFile}</td>
                        </tr>

                        <tr>
                            <th>Images Uploaded</th>
                            <td>${project.imagesCount}</td>
                        </tr>

                        <tr>
                            <th>Status</th>
                            <td>${project.status}</td>
                        </tr>

                        <tr>
                            <th>Submitted On</th>
                            <td>${project.submittedOn}</td>
                        </tr>

                    `;

                    const modal =
                        new bootstrap.Modal(
                            document.getElementById("projectModal")
                        );

                    modal.show();

                });

            container.appendChild(card);

        });

    }

    catch (err) {

        console.error(err);

        alert("Unable to load projects.");

    }

    // ==========================
    // Logout
    // ==========================

    document.querySelectorAll(".logout-action")
        .forEach(button => {

            button.addEventListener("click", function (e) {

                e.preventDefault();

                localStorage.removeItem("currentUser");

                window.location.href = "login.html";

            });

        });

});