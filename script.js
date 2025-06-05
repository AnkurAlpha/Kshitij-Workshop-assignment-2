const main = document.getElementById("main") ;
main.style.opacity = 0 ;
// initialize scores
const Scores = document.querySelectorAll(".scores") ;
const userScore = Scores[0] ;
const computerScore = Scores[1] ;
userScore.textContent = 0 ;
computerScore.textContent = 0 ;
// intilalize turns
const Turns = document.querySelectorAll(".turns") ;
const userTurn = Turns[0] ;
const computerTurn = Turns[1] ;
// random number generator
const getRandomInt = (min,max) => {
    min = Math.ceil(min) ;
    max = Math.floor(max) ;
    return Math.floor(Math.random()* ( max-min + 1 )) + min ;
}

// console.log(`rnadom number : ${getRandomInt(2,4)}`);
// the core process :

// basic variables
const starterBTN = document.getElementById("starter") ;
const starterBTNSeperator = document.getElementById("btn-seperator") ;
const messanger = document.getElementById("messanger")
let userFirst = 0 ;
const boxes = document.querySelectorAll(".t-sub") ;
let activateUserMove = false ;
userTurn.textContent = 0 ;
computerTurn.textContent = 0 ;
// fade effect generator
const fadeEffect = (element,text) => {
    // just for safety
    if (element.style.transition == "" ) {
        element.style.transition = "1s ease-in-out" ;
    }
    element.style.opacity = 0 ;
    setTimeout(()=> {
        element.textContent = text ;
        element.style.opacity = 1 ;
    },1000)
    //2console.log(main.style.transition == "") ;// Just an example
}
// messanger function :
const messangerFunction = (string) => {
    messanger.style.opacity = 0 ;
    setTimeout(()=>{
        messanger.textContent = string ;
        messanger.style.opacity = 1 ;
    },1000)
}
// who will the first mover :
const firstMoverDecider = () => {
    userTurn.textContent = getRandomInt(4,5) ;
    computerTurn.textContent = 9 - userTurn.textContent  ;
    if ( userTurn.textContent == 5 ) {
        userFirst = 1 ;
        console.log(`user is first mover`) ;
    } else {
        userFirst = 0 ;
        activateUserMove = false  ;
        console.log(`computer is first mover`) ;
    }
}
// starting the game :
const gameStarterFunction = () => {
    starterBTN.style.scale = 0 ;
    main.style.opacity = 1 ;
    starterBTNSeperator.style.height = "0vh" ;
    /// removing the seperator and button :
    setTimeout(() => {
        starterBTNSeperator.remove() ;
        console.log(`removed : ${starterBTNSeperator.nodeName} with id ${starterBTNSeperator.id}`)
        starterBTN.remove() ;
        console.log(`removed : ${starterBTN.nodeName} with id ${starterBTN.id}`)
    }, 2000) ;
    // change message
    setTimeout(() => {
        messangerFunction("Let's go!!") ;
        mover()  ;
    },2000) ;
}
starterBTN.addEventListener("click" , () => {
    gameStarterFunction() ;
})

// will check the condition tell whom to move and to whome to move
function mover() {
    console.log("Deciding whom to move") ;
    firstMoverDecider() ;
    setTimeout(()=>{
    if (userFirst == 1 ) {
        activateUserMove = true ;
    }else {
        moverComputer() ;
    }
    },100)
}
/// for user to move function
// event user listerner
boxes.forEach ((box,index) =>{
    box.addEventListener("click",()=>{
        if ( activateUserMove == true ) {
            moverUser(box,index) ;
            console.log(`clicked box ${box.id} with index ${index}`) ;
        }
    })
})

// trigger fucntion
function moverUser(box,index) {
    // for if the place is preoccupied or not
    if ( box.textContent == "X"|| box.textContent == "O") {
        messangerFunction("Box aready taken !") ;
        return  ;
    }
    // Make the user's name
    fadeEffect(boxes[index],"O") ;
    messangerFunction("Computer's turn...") ;

    // decrease user's turn count
    let temp = parseInt(userTurn.textContent) ;
    temp-- ;
    fadeEffect(userTurn,temp) ;
    // check
    activateUserMove = false ;
    setTimeout(()=>{
    const condition = checker("O") ;
    console.log(`checker value : ${condition}`) ;
    if (condition ) {
        console.log("restarting...") ;
        restart() ;
        return ;
    }
    },1500)
    // After 2 seconds
    setTimeout(()=> {
        moverComputer() ;
    },3000) ;
}
// for computer to move
function moverComputer() {
    /// post process
    if ( activateUserMove == false ) {
        while (true) {
            const tempInd = getRandomInt(0,8) ;
            if ( boxes[tempInd].textContent != "X" && boxes[tempInd].textContent !="O"){
                console.log(`Found!! index : ${tempInd}`) ;
                fadeEffect(boxes[tempInd],"X") ;
                break ;
            }
            console.log(`Index : ${tempInd}`)
        }
        let temp = parseInt(computerTurn.textContent) ;
        temp--;
        fadeEffect(computerTurn,temp);
        console.log("computer's move ... ") ;
        setTimeout(() => {
        const condition = checker("X") ;
        console.log(`checker value : ${condition}`) ;
        if (condition ) {
            console.log("restrating...")
            restart() ;
            return ;
        }
        },1500)
        setTimeout(()=> {
            messangerFunction("Your turn...!!") ;
        },3000);
        activateUserMove = true ;
    }
}
// final checker :
function checker(symbol) {
    // intial check for if all the elements are full
    console.log("Checking for if someone won");
    if (parseInt(userTurn.textContent + computerTurn.textContent)== 0 ) {
        messangerFunction("draw!!") ;
        return true ;
    }
    const winPatterns = [
        [0,1,2], [3,4,5], [6,7,8], // rows
        [0,3,6], [1,4,7], [2,5,8], // columns
        [0,4,8], [2,4,6]           // diagonals
    ];
    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        console.log(`checking for : ${[a,b,c]} and ${[boxes[a].textContent,
            boxes[b].textContent,boxes[c].textContent]}`) ;
        console.log(`checks : ${boxes[a].textContent == symbol}`) ;
        console.log(`checks : ${boxes[b].textContent == symbol}`) ;
        console.log(`checks : ${boxes[c].textContent == symbol}`) ;
        if (
            boxes[a].textContent == symbol &&
            boxes[b].textContent == symbol &&
            boxes[c].textContent == symbol
        ) {
            console.log(`the options is matching!!`) ;
            if (symbol == "X") {
                messangerFunction("Computer won!!");
                const temp = parseInt(computerScore.textContent);
                fadeEffect(computerScore, temp + 1);
            } else {
                messangerFunction("User won!!");
                const temp = parseInt(userScore.textContent);
                fadeEffect(userScore, temp + 1);
            }
            return true;
        }
        let temp = false ;
        boxes.forEach((box)=>{
            if ( box.textContent == "") {
                temp = true ;
            }
        })
        if (temp == false  ) {
            messangerFunction("Tie!!") ;
            restart() ;
            return false ;
        }
    }
    return false;
}
// restart
// eventlistener
const options = document.querySelectorAll(".option") ;
const restartOption = options[0] ;
const resetOption = options[1];
restartOption.addEventListener("click",()=> {
    restart() ;
})
// function
function restart() {
    messangerFunction("Restarting...") ;
    boxes.forEach((box)=> {
        fadeEffect(box,"") ;
    })
    messangerFunction("Let's go!!") ;
    setTimeout(()=>{
        mover()  ;
    },1000) ;
    // fadeEffect(userTurn,0) ;
    // fadeEffect(computerTurn,0) ;
}
// reset
// event
resetOption.addEventListener("click",()=>{
    reset() ;
})
// function
function reset () {
    restart() ;
    fadeEffect(computerScore,0) ;
    fadeEffect(userScore,0) ;
}
// just for checking :
// boxes.forEach((box,index) => {
//     console.log(`${box.id} index : ${index} content : ${box.textContent}`)
//     box.textContent = index ;
// });
console.log("X = computer , O = User")
