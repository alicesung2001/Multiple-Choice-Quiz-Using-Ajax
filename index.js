const express = require('express');
// define variable to hold the list of questions from JSON file (database)
let questionsList = require('./questions.json');

const app = express();

// serve static contents
app.use(express.static('static'));

// dynamic handling 


// called to get the quiz questions
app.get('/questionsInJSON', (request,response) => {
    // send json file of questions
    response.json(questionsList);
});

// called to get feedback on the answer the user clicked
app.get('/get-answer', (request, response) => {
    let answer = '';
    let stem = request.query.stem;      // holds index of selected question 
    let option = request.query.option;      // holds index selected option 
    
    // compares the indices of the chosen option and the answer index for that question
    if((option == questionsList[stem].answerIndex)){
        answer = 'correct! :-)';        // sets to correct if the question and stem match up
    } else {
        answer = 'incorrect :-(';       // sets to incorrect otherwise
    }    
    response.send(answer);
});

// called to get the score of the whole quiz
app.get('/get-score', (request, response) => {
    let score = 0;
    let selections = request.query.ans.split(',');      // holds array of the indices of the options the user submitted
    let solutions = [];      // holds array of indices of the solutions (i.e. answerIndex for all questions)
    // for loop to retrieve and insert solutions into the array
    for (let i=0; i<questionsList.length;i++){
        solutions.push(questionsList[i].answerIndex);
    }
    for (let i=0;i<selections.length;i++){
        // compares the chosen index to the answer index for all questions
        if(selections[i] == solutions[i]){
            score += 1;        // if the correct answer is selected, increase the score
        }  
    }
    
    console.log(selections[0], selections[1], selections[2], selections[3], selections[4]);
    console.log(solutions[0], solutions[1], solutions[2], solutions[3], solutions[4]);
    console.log(score);
    response.send('you scored ' +score+'/5');
});
app.listen(80);