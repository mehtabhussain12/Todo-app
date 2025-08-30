import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut
} from "./auth.js";
import { auth, db } from "./config.js";
import { addDoc, collection, query, getDocs, where } from "./firestore.js";

const modalContainer = document.getElementById("modal-container");
const registrationModal = document.getElementById("registration-modal");
const loginModal = document.getElementById("login-modal")
const userName = document.getElementById("username");
const userAge = document.getElementById("userage");
const userGender = document.getElementById("usergender");
const userEmail = document.getElementById("useremail");
const userPassword = document.getElementById("password");
const RegisterButton = document.getElementById("RegisterButton");
const LoginButton = document.getElementById("LoginButton");
const email = document.getElementById("login-email");
const password = document.getElementById("login-password");
const AddTaskButton = document.getElementById("AddTaskButton");
const LogoutButton = document.getElementById("LogoutButton");
const homePage = document.getElementById("home-page");
const sidePanel = document.getElementById("side-panel");
const loginLink = document.getElementById("login-link");
const taskInput = document.getElementById("task-input");
const tasklist = document.getElementById("task-list");
const profileIcon = document.getElementById("profile-icon");
const tasks = [];
loginLink.addEventListener("click", () => {
    loginModal.style.display = "block";
    registrationModal.style.display = "none";
    
});

// Registration
RegisterButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const UserInfo = {
        userName: userName.value,
        userAge: userAge.value,
        userGender: userGender.value,
        userEmail: userEmail.value,
        userPassword: userPassword.value
    };

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, UserInfo.userEmail, UserInfo.userPassword);
        const user = userCredential.user;
        console.log("User registered:", user);

        // store user in Firestore 
        await addDoc(collection(db, "users"), {
            uid: user.uid,
            email: UserInfo.userEmail,
            userName: UserInfo.userName,
            age: UserInfo.userAge,
            gender: UserInfo.userGender
        });

        registrationModal.style.display = "none";
        modalContainer.style.display = "none";
        showUserData(UserInfo);
    } catch (error) {
        console.error("Error:", error.code, error.message);
    }
});

// Login
LoginButton.addEventListener("click", async function (e) {
    e.preventDefault();

    const Email = email.value;
    const Password = password.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, Email, Password);
        const user = userCredential.user;
        console.log("User logged in:", user);

        loginModal.style.display = "none";
        modalContainer.style.display = "none";
        homePage.style.display = "block";
Swal.fire({
  title: "login successful",
  icon: "success",
  draggable: true
});
        // Fetch profile data from Firestore
        fetchUserData(user.uid);
    } catch (error) {
        Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "invalid credentials",

});
        console.error("Error:", error.code, error.message);
    }
});

// Auth
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user);
        modalContainer.style.display = "none";
        registrationModal.style.display = "none";
        loginModal.style.display = "none";
        homePage.style.display = "block";

        // Always fetch user profile from Firestore
        fetchUserData(user.uid);
    } else {
        console.log("No user logged in");
        sidePanel.innerHTML = "<h3>Please log in</h3>";
    }
});

// Logout
LogoutButton.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            console.log("User logged out");
            sidePanel.innerHTML = "<h3>You are logged out.</h3>";
            modalContainer.style.display = "block";
            loginModal.style.display = "block";
            homePage.style.display = "none";
        })
        .catch((error) => {
            console.error("Logout Error:", error);
        });
});

// Add Task
AddTaskButton.addEventListener("click", (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
        alert("Log in to add tasks");
        modalContainer.style.display = "block";
        loginModal.style.display = "block";
    } else {
        const task = taskInput.value;
        tasks.push(task);
        taskInput.value = "";
        showTasks();
    }
});
function  showTasks(){
   tasklist.innerHTML = "";
   tasks.map((task) => {
       const li = document.createElement("li");
       li.textContent = task;
       tasklist.appendChild(li);
   });
}

function showUserData(userInfo) {
    profileIcon.addEventListener("click", () => {
        sidePanel.innerHTML = `
            <h3>Welcome, ${userInfo.userName}</h3>
            <p>Age: ${userInfo.age}</p>
            <p>Gender: ${userInfo.gender}</p>
            <p>Email: ${userInfo.email}</p>
        `;
    });
}


// Fetch profile from Firestore by UID
async function fetchUserData(uid) {
    try {
        const q = query(collection(db, "users"), where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            showUserData(userData);
        } else {
            console.log("No profile found");
            showUserData({ userName: "User", email: auth.currentUser.email });
        }
    } catch (e) {
        console.error("Error fetching user data:", e);
    }
}
