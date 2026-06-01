const passwordContent = document.getElementById("password-content");
const copyBtn = document.getElementById("copy-button");
const copiedBtn = document.getElementById("copied")
const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!()_-";
const generateBtn = document.getElementById("generate-button");
const lengthInput = document.getElementById("password-length");
const historyList = document.getElementById("history-list");
let passwordHistory = [];
const container = document.getElementById("history-container");
const deleteHistoryBtn = document.getElementById("delete-history-button");

//1 generator random password script and user length script
function generatePassword(length) {
    let password = "";  
    for (let i = 0; i < length; i++) {
        let randomChar = "";
        
        do {
            const randomIndex = Math.floor(Math.random() * chars.length);
            randomChar = chars[randomIndex];
            
        } while ((i === 0 || i === length - 1) && (randomChar === "_" || randomChar === "-" || randomChar === "!" || randomChar === "(" || randomChar === ")"));

        password += randomChar;
    }   
    return password;
}

generateBtn.addEventListener("click", () => {
    let passwordLength = parseInt(lengthInput.value);

    if (isNaN(passwordLength) || passwordLength < 5 || passwordLength > 12) {
        alert("Please enter a number between 5 and 12!");
        return; 
    }
   
    const newPassword = generatePassword(passwordLength);
    passwordContent.innerText = newPassword;

    addPasswordToHistory(newPassword);
});
//1

//2 copy button script
while (true) {
    if (copyBtn.classList.contains("copy")) {
        copiedBtn.style.opacity = "0";
        break;
    } 
}

copyBtn.addEventListener("click", () => { 
    if (passwordContent.innerText.trim() === "") {
        alert("Please generate a password first!");
        return;
    }

    const textToCopy = passwordContent.innerText.trim();
    
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            copyBtn.classList.remove("copy");
            copyBtn.classList.add("copied");
            copiedBtn.style.opacity = "1";
            copyBtn.style.opacity = "1"
        
            setTimeout(() => {
                copyBtn.classList.remove("copied");
                copyBtn.classList.add("copy");
                copiedBtn.style.opacity = "0";
            }, 2100); 
        })
            copyBtn.style.color
        .catch(err => console.error("Error!: ", err));
});
//2


//3 password history script
//3.1 delete first password from history
window.addEventListener("DOMContentLoaded", () => {
    if (passwordHistory.length > 0) {
        passwordHistory.splice(0, 1);
        renderHistory();
    }
});
//3.1
function addPasswordToHistory(password) {
    passwordHistory.unshift(password);

    if (passwordHistory.length > 100000000) {
        passwordHistory.pop();
    }

    saveHistoryToLocalStorage();
    renderHistory();

    if (container) container.scrollTop = container.scrollHeight;
}

function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = "";
    
    passwordHistory.forEach((pass, index) => {
        const li = document.createElement("li");
        
        const textSpan = document.createElement("span");
        textSpan.innerText = `${index + 1}. ${pass}`;
        li.appendChild(textSpan);
        
        const copyBtnHistory = document.createElement("button");
        copyBtnHistory.innerText = "Copy";
        copyBtnHistory.className = "history-copy-btn";
        copyBtnHistory.title = "Copy this password";
        
        copyBtnHistory.addEventListener("click", () => {
            navigator.clipboard.writeText(pass)
                .then(() => {
                    copyBtnHistory.innerText = "Copied!";
                    copyBtnHistory.style.color = "rgb(38, 204, 32)";
                    
                    setTimeout(() => {
                        copyBtnHistory.innerText = "Copy";
                        copyBtnHistory.style.color = "";
                    }, 2800);
                })
                .catch(err => console.error("Error copy from history: ", err));
        });
        li.appendChild(copyBtnHistory);

        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "&times;";
        deleteBtn.className = "delete-btn";
        deleteBtn.title = "Delete this password";
        
        deleteBtn.addEventListener("click", () => {
            passwordHistory.splice(index, 1);
            saveHistoryToLocalStorage();
            renderHistory();
        });
        li.appendChild(deleteBtn);

        historyList.appendChild(li);
    });
}
//3


//4 local storage for history script (saving passwords in history(forever))
function saveHistoryToLocalStorage() {
    localStorage.setItem("saved-password-history", JSON.stringify(passwordHistory));
}

let savedHistory = localStorage.getItem("saved-password-history");
if (savedHistory) {
    passwordHistory = JSON.parse(savedHistory);
    renderHistory();
}

window.addEventListener("DOMContentLoaded", () => {
    renderHistory();
});


//5 delete history button script
deleteHistoryBtn.addEventListener("click", () => {
    if (passwordHistory.length === 0) {
        alert("History is already empty!");
        return;
    }

    if (confirm("Are you sure you want to delete all passwords from history?")) {
        passwordHistory = [];
        renderHistory();
    }
});
//5


//6 settings script
document.addEventListener("DOMContentLoaded", () => {
  const icon = document.getElementById("settings-icon");
  const dropdown = document.querySelector(".dropdown");

  icon.addEventListener("click", () => {
    dropdown.classList.toggle("active");
  });
});
//6

