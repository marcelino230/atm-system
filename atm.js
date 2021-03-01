var scb = {
    currentUser: null,
    phase: 'welcome',
    transaction: 0,
    status: true
}

var cardScanner = {
    status: true
}

var keyPad = {
    status: true
}

var monitor = {
    status: true
}

var billDisburser = {
    withdrawAmount: 0,
    status: true
}

var billStorage = {
    billsInATM: 1000,
    valueAvailable: 50000,
    status: true,
}

var systemDatabase = {
    customers: [customer1 = {
                  cardnumber: 200034568719,
                  pin: 1234,
                  balance: 200},
                customer2 = {
                  cardnumber: 680039564723,
                  pin: 1234,
                  balance: 100},
                customer3 = {
                  cardnumber: 302097267147,
                  pin: 3456,
                  balance: 40}
               ],
    status: true
}

var card1 = 200034568719;
var card2 = 680039564723;
var card3 = 302097267147;

setInterval(systemClock, 1000);
setInterval(systemFailure, 1000);
welcome();

function numberInput(input) {
    if(scb.phase !== "welcome") {
        $('#pinField').append(input);
    }
}
function enterButton() {
    let input = $(pinField).html();
    $('#pinField').html("");
    if(scb.phase === 'checkpin') {
        checkPIN(input);
    }
    else if(scb.phase === 'inputwithdrawalamount') {
        inputWithdrawalAmount(input);
    }
}
function backspace() {
    $('#pinField').html("");
}
function cancelButton() {
    if(scb.phase !== "welcome") {
        globalInput = "";
        $('#pinField').html("");
        $('#message').html("Transaction canceled. Ejecting card.")
        ejectCard();
    }
}
function insertCard(card) {
    if(!scb.currentUser) {
        i = systemDatabase.customers.findIndex(user => user.cardnumber == card);
        scb.currentUser = systemDatabase.customers[i];
        $('#message').html("Card inserted, please enter your PIN.")
        scb.phase = "checkpin";
        $('#cardSlot').html(`card${i+1} slotted`);
        $('#cardSlot').css("background-color", "lightgrey");
    }
}
function welcome() {
    scb.currentUser = null;
    $('#message').html("Welcome!<br>Please insert your card to begin.");
    $('#cashDispenser').html("");
}
function checkPIN(pin) {
    if(pin == scb.currentUser.pin) {
        $('#message').html("PIN correct.<br>How much would you like to withdraw today? (max $100)");
        scb.phase = "inputwithdrawalamount";
    }
    else {
        $('#message').html("PIN incorrect, please try again.");
    }
}
function inputWithdrawalAmount(input) {
    if(input > 100) {
        $('#message').html("Entered amount should be less than $100.") ;
    }
    else {
        scb.transaction = input;
        verifyBalance();
    }
}
function verifyBalance() {
    if(scb.transaction > scb.currentUser.balance) {
        $('#message').html("Insufficient balance on account. Ejecting card.");
        ejectCard();
    }
    else {
        verifyCash();
    }
}
function verifyCash() {
    if(scb.transaction > billStorage.valueAvailable) {
        $('#message').html("Insufficient withdrawal amount in ATM. Ejecting card.");
        ejectCard();
    }
    else {
        $('#message').html(`Withdrawing $${scb.transaction} from your account...`);
        setTimeout(disburseCash, 3000);
    }
}
function disburseCash() {
    billDisburser.withdrawAmount = scb.transaction; 
    billStorage.billsInATM--;
    billStorage.valueAvailable -= billDisburser.withdrawAmount;
    systemDatabase.customers.find(user => user === scb.currentUser).balance -= billDisburser.withdrawAmount;
    $('#message').html("Money has been disbursed. Have a good day!");
    $('#cashDispenser').html("<img src='bill.png' alt='bill'>");
    billDisburser.withdrawAmount = 0;
    ejectCard();
}
function ejectCard() {
    $('#cardSlot').css("background-color", "black");
    if (scb.phase !== "systemFailure") {
        scb.transaction = 0;
        $('#cardSlot').html(``);
        scb.phase = "welcome";
        setTimeout(welcome, 5000);
    }
}
function systemFailure() {
    if (cardScanner.status === false ||
        keyPad.status === false ||
        monitor.status === false ||
        billStorage.status === false ||
        billDisburser.status === false ||
        systemDatabase.status === false ||
        scb.status === false){
        $('#message').text("Broken System. Contact Support.")
        scb.phase = "systemFailure";
        ejectCard()
    }
}

//References:
// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
// https://stackoverflow.com/questions/26584233/updating-javascript-time-every-second
function systemClock() {
    var time_now = "Current Time: " + new Date().toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    $("#time-display").text(time_now);
}
