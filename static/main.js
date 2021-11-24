const send = require("process");

// getting the question stems
function getStems(){
    // creating an XMLHttp Request object
    let xReq = new XMLHttpRequest();
    // when the state changes, display the questions
    xReq.onreadystatechange = displayStems;
    // configure how req is sent
    // first argument is HTTP method, second is URL to send req to, third is syn/async spec (true = async)
    xReq.open('GET','/questionsinJSON',true);
    // send request
    xReq.send();
}


// function is called every time the ready state changes
function displayStems(){
    // if the request is in state 4 and is ready,
    if(this.readyState == 4 && this.status == 200){
        let stemDiv = document.getElementById('stemDiv');
        let questionsList = JSON.parse(this.responseText);
        let options = [];
            let content ='';
            for (let q=0; q<questionsList.length; q++)
            {
                options = questionsList[q].options;
                content += `<form ><form><label name="stem" id="${q}">${questionsList[q].stem}<br></label>`
                for (let o=0; o<options.length;o++){
                    content += `<input id="${o}" name="option" type="radio" value="${options[o]}" onclick="chooseOption(this)">${options[o]}</input>`;
                }
                // label to store the feedback for each question
                content += `</form><label id="feedbackDiv${q}"><br><br></label>`
            }
            // submit button for when the user is done
            content += `<button onclick="submit()" id="submit">submit and see score</button></form>`;
            stemDiv.innerHTML = content;

    }
};

// function to handle when the user chooses an option
function chooseOption(option){
    // variable to hold the index of the option chosen by the user, to be passed to the server
    let choiceNum = option.id;
    // variable to hold the index of that it goes with, to be passed to the server (0, 1, 2, or 3)
    let quesNum = option.parentNode.firstChild.id;
    // create new XMLHttpRequest object
    let xReq = new XMLHttpRequest();
    // display feedback after response comes back
    xReq.onreadystatechange = function(){displayFeedback(xReq, option)};
    // the request gets the answer from the server depending on the question and option the user clicked
    xReq.open('GET','/get-answer?stem='+quesNum+'&&option='+choiceNum,true);
    //send request
    xReq.send(); 
}

// function to display feedback
function displayFeedback(xReq, option){
    // finding which question's feedback div (0,1,2 or 3 for the four questions)
    let quesNum = option.parentNode.firstChild.id;
    // getting the feedback div of the specific question the option the user clicked origniated from
    let feedbackDiv = document.getElementById('feedbackDiv'+quesNum);
    // if the request is in state 4 and is ready,
    if(xReq.readyState == 4 && xReq.status == 200){
        // add the server's feedback to the div to display it to the user
        feedbackDiv.innerHTML = xReq.responseText + '<br><br>';
    } else {
        //console.log(xReq.readyState + xReq.status);
    }
};

// function to submit the quiz with the user's current selections
function submit(){
    // get all the elements w name="option"
    let selected = document.getElementsByName('option');
    // array to hold the indices of the user's choices (in order)
    let selections = [];
    
    // iterate through all name="option" elements
    for (let i=0; i<selected.length; i++){
        if (selected.item(i).checked){      // if the radio button is checked
            selections.push(selected.item(i).id);       // add its index (relative to the other options for this question) into the array
        } 
    }
    // if the length of this array is less than 4, it means less than 5 questions have been answered
    if (selections.length<4){     
        alert('please answer all questions before submitting!');    // stops the user from submitting queries without exactly 5 arguments
    } else {
        // create new request object
        let xReq = new XMLHttpRequest();
        // display the user's score after response comes back
        xReq.onreadystatechange = displayScore;
        // the request gets the answer from the server depending on the question and option the user clicked
        xReq.open('GET','/get-score?ans='+selections,true);
        //send request
        xReq.send(); 
    }
}

// function to display the user's score to them
function displayScore(){
    // select the stem div
    let stemDiv = document.getElementById('stemDiv');
    // show user their score
    stemDiv.innerHTML = this.responseText + '<br><br><button id="start" onclick="getStems()">click to restart</button>' ;
}


