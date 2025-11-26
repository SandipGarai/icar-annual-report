/***********************************************
 * Firebase Init
 ***********************************************/
const firebaseConfig = {
  apiKey: "AIzaSyBMDTPduyxx9SHg8SHVUgPLzUsEoITY6vc",
  authDomain: "icar-annual-repoprt.firebaseapp.com",
  projectId: "icar-annual-repoprt",
  storageBucket: "icar-annual-repoprt.firebasestorage.app",
  messagingSenderId: "68736305070",
  appId: "1:68736305070:web:510f074b2ecb09ec82ea3f",
  measurementId: "G-34PYPLJ1FW",
};

const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/***********************************************
 * UI References
 ***********************************************/
const phoneInput = document.getElementById("phoneInput");
const userNameInput = document.getElementById("userNameInput");
const sendOtpBtn = document.getElementById("sendOtpBtn");
const otpInput = document.getElementById("otpInput");
const verifyOtpBtn = document.getElementById("verifyOtpBtn");
const otpArea = document.getElementById("otpArea");
const statusBox = document.getElementById("loginStatus");

/***********************************************
 * Send OTP
 ***********************************************/
sendOtpBtn.addEventListener("click", async () => {
  const phone = phoneInput.value.trim();
  const uname = userNameInput.value.trim();

  if (!uname) return showStatus("Enter name", "error");
  if (!phone.startsWith("+") || phone.length < 10)
    return showStatus("Enter valid phone (e.g. +9198xxxxxx)", "error");

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    "recaptcha-container",
    { size: "normal" }
  );

  try {
    const confirmation = await auth.signInWithPhoneNumber(
      phone,
      window.recaptchaVerifier
    );

    window.otpConfirmation = confirmation;
    otpArea.classList.remove("hidden");
    showStatus("OTP sent successfully.", "success");
  } catch (err) {
    console.error(err);
    showStatus("Error sending OTP: " + err.message, "error");
  }
});

/***********************************************
 * Verify OTP
 ***********************************************/
verifyOtpBtn.addEventListener("click", async () => {
  const code = otpInput.value.trim();
  if (!code) return showStatus("Enter OTP", "error");

  try {
    await window.otpConfirmation.confirm(code);

    // Save user session
    const session = {
      name: userNameInput.value.trim(),
      phone: phoneInput.value.trim(),
      loginTime: Date.now(),
    };

    localStorage.setItem("loggedUser", JSON.stringify(session));

    showStatus("Login successful. Redirecting...", "success");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 800);
  } catch (err) {
    console.error(err);
    showStatus("Invalid OTP.", "error");
  }
});

/***********************************************
 * Helper UI
 ***********************************************/
function showStatus(msg, type) {
  if (!statusBox) return;
  statusBox.textContent = msg;
  statusBox.style.color = type === "error" ? "red" : "green";
}
