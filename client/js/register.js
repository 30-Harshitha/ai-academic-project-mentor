document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("registration-form");

    if (!form) return;

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim().toLowerCase();
        const phoneNumber = document.getElementById("phoneNumber").value.trim();
        const dob = document.getElementById("dob").value;
        const collegeName = document.getElementById("collegeName").value.trim();
        const department = document.getElementById("department").value;
        const year = document.getElementById("year").value;
        const gender = document.getElementById("gender").value;
        const githubUrl = document.getElementById("githubUrl").value.trim();
        const linkedinUrl = document.getElementById("linkedinUrl").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const terms = document.getElementById("terms").checked;

        // Validation

        if (
            fullName === "" ||
            email === "" ||
            phoneNumber === "" ||
            dob === "" ||
            collegeName === "" ||
            department === "" ||
            year === "" ||
            gender === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            alert("Please fill all required fields.");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        if (!terms) {
            alert("Please accept Terms & Conditions.");
            return;
        }

        // User Object

        const newUser = {

            fullName,

            email,

            phoneNumber,

            dob,

            collegeName,

            department,

            year,

            gender,

            githubUrl,

            linkedinUrl,

            password

        };

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(newUser)
                }
            );

            const data = await response.json();

            if (!data.success) {

                alert(data.message);

                return;

            }

            alert("Registration Successful!");

            form.reset();

            window.location.href = "login.html";

        }
        catch (error) {

            console.error(error);

            alert("Unable to connect to server.");

        }

    });

});