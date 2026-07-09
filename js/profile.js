/* ==========================================
   profile.js
   PART 1 - Load Profile from MySQL
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    let currentUser =
        JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {

        alert("Please login first.");

        window.location.href = "login.html";

        return;

    }

    loadProfile();

    async function loadProfile() {

        try {

            const response = await fetch(

                "https://ai-academic-project-mentor.onrender.com/api/users/" +
                currentUser.id

            );

            if (!response.ok) {

                throw new Error("Unable to load profile.");

            }

            const user = await response.json();

            currentUser = user;

            localStorage.setItem(
                "currentUser",
                JSON.stringify(user)
            );

            document.querySelectorAll(".currentUser-name")
                .forEach(item => {

                    item.textContent =
                        user.fullName || "";

                });

            document.querySelectorAll(".currentUser-avatar")
                .forEach(img => {

                    img.src =
                        user.avatarUrl ||
                        "https://ui-avatars.com/api/?name=" +
                        encodeURIComponent(user.fullName);

                });

            document.getElementById("profile-photo-preview-node").src =
                user.avatarUrl ||
                "https://ui-avatars.com/api/?name=" +
                encodeURIComponent(user.fullName);

            document.getElementById("profileName").value =
                user.fullName || "";

            document.getElementById("profileEmail").value =
                user.email || "";

            document.getElementById("profilePhone").value =
                user.phoneNumber || "";

            document.getElementById("profileLocation").value =
                user.location || "";

            document.getElementById("profileCollege").value =
                user.collegeName || "";

            document.getElementById("profileDept").value =
                user.department || "";

            document.getElementById("profileYear").value =
                user.year || "1st Year";

            document.getElementById("profileSkills").value =
                user.skillsList || "";

            document.getElementById("profileLanguages").value =
                user.programmingLanguages || "";

            document.getElementById("profileCerts").value =
                user.certifications || "";

            document.getElementById("profileExperience").value =
                user.experience || "";

            document.getElementById("profile-dept-caption").textContent =
                user.department || "";

            document.getElementById("profile-year-caption").textContent =
                user.year || "";

            document.getElementById("profile-college-caption").textContent =
                user.collegeName || "";

        }

        catch (err) {

            console.error(err);

            alert("Unable to load profile.");

        }

    }
    /* ==========================================
   PART 2 - Avatar & Resume Upload
========================================== */

    // Avatar Upload

    const avatarInput =
        document.getElementById("avatarFileInput");

    avatarInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {

            alert("Please select an image.");

            return;

        }

        if (file.size > 2 * 1024 * 1024) {

            alert("Maximum image size is 2MB.");

            return;

        }

        const reader = new FileReader();

        reader.onload = function (e) {

            document.querySelectorAll(".currentUser-avatar")
                .forEach(img => {

                    img.src = e.target.result;

                });

            document.getElementById(
                "profile-photo-preview-node"
            ).src = e.target.result;

            currentUser.avatarUrl = e.target.result;

            localStorage.setItem(
                "currentUser",
                JSON.stringify(currentUser)
            );

        };

        reader.readAsDataURL(file);

    });


    /* -------------------------------
       Resume Upload
    ------------------------------- */

    const resumeArea =
        document.getElementById("resume-drag-area");

    const resumeInput =
        document.getElementById("resumeFileInput");

    resumeArea.addEventListener("click", function () {

        resumeInput.click();

    });

    resumeInput.addEventListener("change", function () {

        if (resumeInput.files.length === 0) return;

        const file = resumeInput.files[0];

        if (file.type !== "application/pdf") {

            alert("Only PDF files are allowed.");

            resumeInput.value = "";

            return;

        }

        if (file.size > 5 * 1024 * 1024) {

            alert("Maximum PDF size is 5MB.");

            resumeInput.value = "";

            return;

        }

        resumeArea.querySelector(".drag-drop-label").innerHTML =
            "<strong>" + file.name + "</strong>";

    });


    /* -------------------------------
       Drag & Drop Resume
    ------------------------------- */

    ["dragenter", "dragover"].forEach(event => {

        resumeArea.addEventListener(event, function (e) {

            e.preventDefault();

            resumeArea.classList.add("drag-active");

        });

    });

    ["dragleave", "drop"].forEach(event => {

        resumeArea.addEventListener(event, function (e) {

            e.preventDefault();

            resumeArea.classList.remove("drag-active");

        });

    });

    resumeArea.addEventListener("drop", function (e) {

        const files = e.dataTransfer.files;

        if (files.length > 0) {

            resumeInput.files = files;

            resumeInput.dispatchEvent(new Event("change"));

        }

    });
    /* ==========================================
   PART 3 - Save Profile & Logout
========================================== */

    // Save Profile

    document.getElementById("profile-edit-form")
        .addEventListener("submit", async function (e) {

            e.preventDefault();

            const updatedUser = {

                id: currentUser.id,

                fullName:
                    document.getElementById("profileName").value.trim(),

                phoneNumber:
                    document.getElementById("profilePhone").value.trim(),

                location:
                    document.getElementById("profileLocation").value.trim(),

                collegeName:
                    document.getElementById("profileCollege").value.trim(),

                department:
                    document.getElementById("profileDept").value.trim(),

                year:
                    document.getElementById("profileYear").value,

                skillsList:
                    document.getElementById("profileSkills").value.trim(),

                programmingLanguages:
                    document.getElementById("profileLanguages").value.trim(),

                certifications:
                    document.getElementById("profileCerts").value.trim(),

                experience:
                    document.getElementById("profileExperience").value.trim(),

                avatarUrl:
                    currentUser.avatarUrl || ""

            };

            try {

                const response = await fetch(

                    "http://localhost:5000/api/users/" +
                    currentUser.id,

                    {

                        method: "PUT",

                        headers: {

                            "Content-Type": "application/json"

                        },

                        body: JSON.stringify(updatedUser)

                    }

                );

                const data = await response.json();

                if (!response.ok) {

                    alert(data.message || "Profile update failed.");

                    return;

                }

                currentUser = {

                    ...currentUser,

                    ...updatedUser

                };

                localStorage.setItem(
                    "currentUser",
                    JSON.stringify(currentUser)
                );

                alert("Profile updated successfully.");

                location.reload();

            }

            catch (err) {

                console.error(err);

                alert("Unable to connect to server.");

            }

        });


    /* -------------------------------
       Logout
    ------------------------------- */

    document.querySelectorAll(".logout-action")
        .forEach(button => {

            button.addEventListener("click", function (e) {

                e.preventDefault();

                localStorage.removeItem("currentUser");

                window.location.href = "login.html";

            });

        });

});