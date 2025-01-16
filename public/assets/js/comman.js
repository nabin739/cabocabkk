
// text validation
function isTextKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if ((charCode > 31 && (charCode < 65 || charCode > 90)) && (charCode < 97 || charCode > 122) && charCode !== 32) {
        return false;
    }
    return true;
}
function isspaceKey(evt) {
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode === 32) { 
        return false;
    }
    return true;
}

function validateEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
function isNumber(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
function isValidURL(url) {
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    return urlPattern.test(url);
}

function isValidPincode(pincode) {
    const pincodePattern = /^\d{6}$/; 
    return pincodePattern.test(pincode);
}
toastr.options = {
    "closeButton": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };
  let toastShown = false;
function showToast(msg, status) {
   
    let show;

    if(status === 500 || status === 404) {
        show = "warning";
    } 
    else if(status==400){
        show = "error";
    }    
    else if(status === 422 || status === 401) {
        show = "error";
        if(status === 401) {
            window.location.href = '/corporate/login';
            localStorage.setItem('invallid_session_msg', msg);
            return false;
        }
    } else if(status === 200) {
        // show = "info";
        show = "success";
    } else {
        show = "warning";
    }

    // if (status === 0) {
    //     show = "success";
    // } else if (status === 1) {
    //     show = "info";
    // } else if (status === 2) {
    //     show = "warning";
    // } else {
    //     show = "error";
    // }
    
    if (!toastShown) {
        toastr[show](msg, null, { timeOut: 3000 });
        toastShown = true;
        setTimeout(() => {
            toastShown = false;
        }, 3200);
    }
}

function hideToast() {
    toastr.clear();
    toastShown = false;
}
function handleError(error) {
    let errorMessage = 'Something went wrong';
    if (error.response) {
        const response = error.response;
        errorMessage = response.data.error || response.data.message || errorMessage;
        showToast(errorMessage, response.status||400);
    } else if (error.request) {
        showToast('No response received from the server.', 500);
    } else {
        showToast('Error in setting up the request.', 500);
    }
}
function disableLoginButton(classname) {
    const button = document.querySelector(`.${classname}`);
    button.classList.add('new_active');
}
function enableLoginButton(classname) {
    const button = document.querySelector(`.${classname}`);
    button.classList.remove('new_active');
}

function disableSignupButton(classname) {
    const button = document.querySelector(`.${classname}`);
    button.classList.add('new_active');
}
function enableSignupButton(classname) {
    const button = document.querySelector(`.${classname}`);
    button.classList.remove('new_active');
}

function formatUTCDate(utcDate) {
    const date = new Date(utcDate);

    // Get individual date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours24 = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    // Convert to 12-hour format
    const hours12 = hours24 % 12 || 12;
    const period = hours24 >= 12 ? 'PM' : 'AM';

    return `${day}/${month}/${year} ${hours12}:${minutes} ${period}`;
}

// model
function showModal(id) {
    var modal = document.getElementById(id);
    modal.style.display = "flex"; 
    document.body.classList.add('modal-open'); // Prevent background scrolling
    setTimeout(function () {
        modal.classList.add('show');
    }, 10); 
}

function closeModal(id) {
    var modal = document.getElementById(id);
    modal.classList.remove('show'); 
    setTimeout(function () {
        modal.style.display = "none";
        document.body.classList.remove('modal-open'); 
    }, 300);
}
function animateText(text, elementId) {
    const dynamicTextElement = document.getElementById(elementId);
    let index = 0;

    function typeText() {
        if (index < text.length) {
            dynamicTextElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100); 
        } else {
            dynamicTextElement.style.opacity = 1; 
        }
    }

    typeText();
}
function validatePassword(password, errorElement) {
    if (password.trim() === '') {
        errorElement.textContent = 'Password is required';
        return false;
    }

    // Define the regular expressions
    var lowercaseRegex = /[a-z]/;
    var uppercaseRegex = /[A-Z]/;
    var numberRegex = /[0-9]/;
    var specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/\-|=]/;

    // Check one by one
    if (!lowercaseRegex.test(password)) {
        errorElement.textContent = 'Must contain at least one lowercase letter';
        return false;
    }
    if (!uppercaseRegex.test(password)) {
        errorElement.textContent = 'Must contain at least one uppercase letter';
        return false;
    }
    if (!numberRegex.test(password)) {
        errorElement.textContent = 'Must contain at least one number';
        return false;
    }
    if (!specialCharRegex.test(password)) {
        errorElement.textContent = 'Must contain at least one special character';
        return false;
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }

    errorElement.textContent = '';
    return true;
}

function validateMobileNumber(mobileNumber, errorElement) {
    if (mobileNumber.trim() === '') {
        errorElement.textContent = 'Mobile number is required';
        return false;
    }
    var numberRegex = /^[1-9][0-9]{9}$/; 
    if (!numberRegex.test(mobileNumber)) {
        errorElement.textContent = 'Please enter a valid mobile number';
        return false;
    }

    if (/^(\d)\1{9}$/.test(mobileNumber)) {
        errorElement.textContent = 'Please enter a valid mobile number';
        return false;
    }

    errorElement.textContent = '';
    return true;
}
function validateEmailDetails(email, errorElement) {
    if (email.trim() === '') {
        errorElement.textContent = 'Email is required';
        return false;
    }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]{2,}\.(com|org|in|net|edu|gov|co)$/;
    
    // Check if the email matches the valid pattern
    if (!emailPattern.test(email)) {
        errorElement.textContent = 'Please enter a valid email address';
        return false;
    }

    errorElement.textContent = '';
    return true;
}
function validateURL(url, errorElement) {
    if (url.trim() === '') {
        errorElement.textContent = 'URL is required';
        return false;
    }

    // Define the regular expressions
    const protocolRegex = /^(https?:\/\/)/;
    const domainRegex = /([\w-]+\.)+[\w-]{2,}/;
    const pathRegex = /(\/[\w-./?%&=]*)?$/;

    // Check each requirement one by one
    if (!protocolRegex.test(url)) {
        errorElement.textContent = 'URL must start with http:// or https://';
        return false;
    }
    if (!domainRegex.test(url)) {
        errorElement.textContent = 'URL must contain a valid domain';
        return false;
    }
    if (!pathRegex.test(url)) {
        errorElement.textContent = 'URL contains invalid characters in the path';
        return false;
    }

    // If all checks pass, clear the error message
    errorElement.textContent = '';
    return true;
}
function restrictPasteToText(event) {
    event.preventDefault();

    let pasteText = (event.clipboardData || window.clipboardData).getData('text');
    const textPattern = /^[a-zA-Z\s]+$/;

    if (textPattern.test(pasteText)) {
        document.execCommand('insertText', false, pasteText);
    }
}

function restrictPasteToNumbers(event) {
    event.preventDefault();

    let pasteText = (event.clipboardData || window.clipboardData).getData('text');
    const numberPattern = /^[0-9]+$/;
    if (numberPattern.test(pasteText)) {
        document.execCommand('insertText', false, pasteText);
    }
}

function restrictPasteToEmail(event) {
    event.preventDefault();
    let pasteText = (event.clipboardData || window.clipboardData).getData('text');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailPattern.test(pasteText)) {
        document.execCommand('insertText', false, pasteText);
    }
}


