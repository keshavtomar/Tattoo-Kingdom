
function clearerror(){
    errors = document.getElementsByClassName('formerror');
    for(let items of errors ){
        items.innerHTML = "";
    }
}

function seterror(id, error){
    element = document.getElementById(id);
    element.getElementsByClassName('formerror')[0].innerHTML = error;
    var pass_css = element.getElementsByClassName('formerror')[0];
    pass_css.style.setProperty("color", "red");
    pass_css.style.setProperty("font-size", "small");
}

function isCase(str) {
    return /[a-z]/.test(str) && /[A-Z]/.test(str) && /[0-9]/.test(str) && /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/.test(str);
}

function isWHitespace(str){
    return /^(?=.*\s)/.test(str);
}



function validateform(){
    let returnval = true;
    clearerror();
    
    var name = document.forms['MyForm']["name"].value;
    if(name.length == 0){
        seterror("fname", " **This space can't leave Blank.");
        returnval = false;
    }
    if(name.length > 30){
        seterror("fname", " **Name is too big.");
        returnval = false;
    }
    
    if(/[0-9]/.test(name)){
        seterror("fname", " **Name should not contain any numeric character.");
        returnval = false;
    }

    var name = document.forms['MyForm']["email"].value;
    let for_mail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!name.match(for_mail)){
        seterror("fmail", " **Invalid E-mail");
        returnval = false;
    }


    var password = document.forms['MyForm']["password"].value;
    if(password.length <= 8){
        seterror("fpass", " **PassWord must contain more tha 8 digits.");
        returnval = false;
    }
    if(!isCase(password)){
        seterror("fpass", "**Password must contain atlest one Uppercase, lowercase, number and special character.");
        returnval = false;
    }
    if(isWHitespace(password)){
        seterror("fpass", "**PassWord must not contain any WhiteSpaces");
        returnval = false;
    }

    var cpass = document.forms['MyForm']["cpassword"].value;
    if(cpass.length == 0){
        seterror("fname", " **This space can't leave Blank.");
        returnval = false;
    }
    if(!cpass.match(password)){
        seterror("fcpass", " **Confirm Password should match Password.");
        returnval = false;
    }

    

    return returnval;
}