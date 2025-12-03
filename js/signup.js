// signup.js
const AUTH_URL =
  "https://script.google.com/macros/s/AKfycbz6KBGi69sN1F1zuxh3BVY5CPSN2JIM4IXg3BxLdU0ahrKh89D6SnsQnR_aTregIR_1BA/exec";

document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById("signupName");
  const userInput = document.getElementById("signupUser");
  const passInput = document.getElementById("signupPass");
  const status = document.getElementById("signupStatus");
  const btn = document.getElementById("signupBtn");

  btn.onclick = async () => {
    const name = nameInput.value.trim();
    const username = userInput.value.trim();
    const password = passInput.value.trim();

    status.style.color = "red";
    status.textContent = "";

    if (!name || !username || !password) {
      status.textContent = "Please fill all fields.";
      return;
    }

    status.style.color = "blue";
    status.textContent = "Creating account...";

    try {
      // Use text/plain to avoid preflight
      const resp = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({
          action: "signup",
          name,
          username,
          password,
        }),
      });

      const data = await resp.json();

      if (!data.ok) {
        status.style.color = "red";
        status.textContent = data.message || "Signup failed.";
        return;
      }

      status.style.color = "green";
      status.textContent = "Account created! Redirecting...";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);
    } catch (err) {
      status.style.color = "red";
      status.textContent = "Network error: " + err.message;
      console.error(err);
    }
  };
});
