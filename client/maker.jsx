const helper = require('./helper.js');
const socket = io();

//This function is in charge of sending the amount of the chips the user bought from the chip store
//This is activated if they choose 'send chips'.
const handleChipTransaction = async (e) => {
    e.preventDefault();
    let options = e.target.querySelectorAll('.options');
    let token = await bringToken()
    for (let option of options) {
        if (option.checked) {
            let chipValue = option.value;
            let sessionUsername = await getSessionAcctInfo();
            helper.sendPost('/sendChips', { chips: chipValue, sentUsername: sessionUsername, _csrf: token }, loadChips);
            break;
        }
    }

}

//This is the React DOM that shows the different options for transactions. 
//When the user clicks 'back to lobby', it loads back the lobby and overrites the store react DOM
const DisplayTransactions = (props) => {

    return (
        <div id="transactionPage">
            <button id="backButton" onClick={(e) => setupLobby()}>Back to Lobby</button>
            <form id="chipStore"
                onSubmit={handleChipTransaction}
                name="chipStore"
                action="/sendChips"
                method="POST"
            >
                <input type="radio" id="lowOption" className="options" name="chipOptions" value="500" />
                <label>500 chips for $4.99</label>

                <input type="radio" id="mediumOption" className="options" name="chipOptions" value="2500" />
                <label >2500 chips for $19.99</label>

                <input type="radio" id="highOption" className="options" name="chipOptions" value="10000" />
                <label>10000 chips for $4.99</label>

                <input id="_csrf" type="hidden" name="_csrf" value={props.csrf} />
                <input type="submit" value="Send Chips" />
            </form>
        </div>

    )
}


//This method checks to see if all the users have their bets placed. If they do, we start the game.
const checkAndStartCountdown = async (e) => {
    let slots = document.querySelectorAll(".slots")
    for (let slot of slots) {
        let submitButton = slot.querySelector("#wagerButton");
        if (!submitButton.disabled) {
            return false;
        }
    }

    let countdownDom = document.querySelector("#countdown");
    let winnerDom = document.querySelector("#winner");
    winnerDom.textContent = " ";


    //We first begin with doing a timed interval, which will act as a 5 second countdown to choose the winner
    const countdownInter = setInterval(countdown, 1000)
    let startTime = 5;
    async function countdown() {

        //When the timer reaches 0, we stop the timer, choose a random slot from the lobby...
        if (startTime === 0) {
            clearInterval(countdownInter);
            let randomSlotIndex = Math.floor(Math.random() * slots.length);
            let chosenSlot = slots[randomSlotIndex].querySelector("#username");
            winnerDom.textContent = chosenSlot.textContent + " has won the whole pot!";
            let lobbyResponse = await fetch('/getLobby');
            let lobbyData = await lobbyResponse.json();
            let token = await bringToken();
            

            //And remove the chips from the pot
            helper.sendPost('/sendToPot', { chips: lobbyData[0].globalPot, sentUsername: chosenSlot.textContent, _csrf: token }, lobbyRender);

            let acctResponse = await fetch('/getAcctInfo');
            let acctData = await acctResponse.json();
            console.log(acctData.username, chosenSlot.textContent);
            if (acctData.username === chosenSlot.textContent) {

                //To return to the winner
                helper.sendPost('/sendChips', { chips: lobbyData[0].globalPot, sentUsername: chosenSlot.textContent, _csrf: token }, loadChips);
            }

            for (let slot of slots) {
                let submitButton = slot.querySelector("#wagerButton");
                submitButton.disabled = false;
                submitButton.style.opacity = "100%";
            }
        }
        countdownDom.textContent = 'Every Player is ready! Starting game in ' + startTime + ' seconds.';
        startTime--;
    }

}

//This is a helper method to quickly get the _csrf token
const bringToken = async () => {
    const tokenResponse = await fetch('/getToken');
    const token = await tokenResponse.json();
    return token.csrfToken;
}


//This is a helper method to get the chips the specified user has. 
const getChips = async (username, token) => {

    let chipResponse = await fetch('/getChips', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ acctUsername: username, _csrf: token }),
    });

    const chipData = await chipResponse.json();
    return chipData.chips;
}


//This is the react DOM to show the chip balance a user has
const DisplayChipBalance = (props) => {
    return (
        <div id="currencyDOM" className="tile">
            <div id="currency" className="tile">{props.chips}</div>
            <div id="navToTransactions" className="tile" onClick={(e) => ReactDOM.render(<DisplayTransactions csrf={props.csrf} />, document.querySelector("#lobbyWrapper"))}>+</div>
        </div>
    )
}

//This is more react DOM to show the username
const DisplayUsername = (props) => {
    return (
        <div>
            <p className="username greet">Welcome, </p>
            <p className="username name"><strong>{props.username}</strong></p>
        </div>
    )
}


//This method is in charge of rendering the react DOM to the client
const loadChips = async (acctObj) => {
    let acctResponse = await fetch('/getAcctInfo');
    let acctData = await acctResponse.json();

    if (acctData.username === acctObj.username) {
        ReactDOM.render(
            <DisplayChipBalance chips={acctObj.chipValue} username={acctObj.username} />,
            document.querySelector('#chipData')
        );
        ReactDOM.render(
            <DisplayUsername username={acctObj.username} />, document.querySelector("#displayingUsername")
        );
    }



}


//This function is called when the user wants to wager a bet.
const handlePot = async (e) => {
    e.preventDefault();

    let chipWager = e.target.querySelector('#chipWager').value;
    let slotUsername = e.target.querySelector('#username').textContent;

    const sessionAcctResponse = await fetch('/getAcctInfo');
    const sessionAcctData = await sessionAcctResponse.json();
    let token = await bringToken();

    //We get the balance from the user, and then add it to the pot, while also removing it from the user
    let chipBalance = await getChips(slotUsername, token);


    //Because of SocketIO, there has to be many checks in place so that one user cannot call a post from another
    //Many times we check to see if the current session username matches the one that the target slot has.
    if (chipWager <= chipBalance && slotUsername === sessionAcctData.username) {
        let inverseValue = parseInt(chipWager, 10);
        inverseValue = -inverseValue;
        helper.sendPost('/sendToPot', { chips: inverseValue, sentUsername: slotUsername, _csrf: token }, lobbyRender);
        helper.sendPost('/sendChips', { chips: inverseValue, sentUsername: slotUsername, _csrf: token }, loadChips);
        let thisSlotName = e.target.id;
        socket.emit('reRenderSlots', { updatedSlot: thisSlotName, wagerAmount: chipWager });
    }
}


//This is the slot DOM 
const SlotDOM = (props) => {
    const slotNodes = props.slots.map(slot => {
        return (
            <form id={slot.username}
                className="slots tile is-vertical"
                key={slot._id}
                onSubmit={handlePot}
                name={slot._id}
                action="/addToPot"
                method="POST"
            >
                <label id="intro">Username:</label>
                <label id="username">{slot.username}</label>
                <label id = "chipLabel" htmlFor="wagerNum"> Chip Wager: </label>
                <input id="chipWager" type="number" name="wagerNum" placeholder="Enter your wager here:" />
                <input id="wagerButton" className="formSubmit" type="submit" value="Wager" />
            </form>
        )
    });

    return (
        <div className = "tile">
            {slotNodes}
        </div>
    );
}


//This is a method that is called after a Socket emit, and disables users from wagering again until the game is over
const updateSlots = (socketData) => {

    let selectedSlot = document.getElementById(socketData.updatedSlot);
    let submitButton = selectedSlot.querySelector("#wagerButton");
    submitButton.disabled = true;
    submitButton.style.opacity = "50%";

    selectedSlot.querySelector("#chipWager").value = socketData.wagerAmount;
    checkAndStartCountdown()

}

//This is a socket io method that calls for the lobby to be rendered again for all users
const lobbyRender = (lobbyResponse) => {
    socket.emit('renderLobby', lobbyResponse);
}


//This renders the Lobby DOM
const loadLobby = (lobbyResponse) => {
    ReactDOM.render(
        <LobbyDOM globalPot={lobbyResponse.globalPot} />, document.getElementById('lobbyWrapper')
    );
}

//This is a helper method to get the username of the session account
const getSessionAcctInfo = async () => {
    const acctResponse = await fetch('/getAcctInfo');
    const acctData = await acctResponse.json();
    return acctData.username;


}


//This method is simply updating the lobby again with the new slot lobby.
const leaveLobby = async (slotData) => {
    ReactDOM.render(<SlotDOM slots={slotData.slots} />, document.getElementById('slotContainer'));
}



//This method is called when the user wants to leave the lobby, and also communicates with Socket so that all users
//see that the player has left.
const leaveCurrentSlot = async () => {
    await fetch('/removeSlot');
    let slotData = await getSlotObj();
    socket.emit('takeSlot', slotData);
}


//This is a helper method to get the slot data
const getSlotObj = async () => {
    const slotResponse = await fetch('/getSlots');
    const slotData = await slotResponse.json();
    return slotData;
}


//This method is in charge of creating/loading the current lobby
const setupLobby = async () => {
    const lobbyResponse = await fetch('/getLobby');
    const lobbyData = await lobbyResponse.json();
    const token = await bringToken();
    if (lobbyData.length < 1) {
        helper.sendPost('/makeLobby', { startingPot: 0, _csrf: token }, loadLobby);
    }
    else {
        loadLobby(lobbyData[0]);
    }

    let slots = await getSlotObj();
    loadSlots(slots);

}

//This is in charge of loading the React DOM for the slots
const loadSlots = async (slotData) => {
    ReactDOM.render(<SlotDOM slots={slotData.slots} />, document.getElementById('slotContainer'));
}

//This method is in charge of setting up the Socket and Slot together. It first creates the slot,
//then emits to Socket so that every user's DOM updates with that new slot
const setupSlotSocket = async () => {
    const account = await fetch('/getAcctInfo');
    const acctData = await account.json();

    let sessionUsername = await getSessionAcctInfo()
    let slotToken = await bringToken();

    helper.sendPost('/createSlot', { username: sessionUsername, id: acctData.id, _csrf: slotToken });

    let slotData = await getSlotObj();

    socket.emit('renderSlot', slotData);
}

//This is the DOM for the lobby
const LobbyDOM = (props) => {
    return (
        <div id="lobby">
            <section id="leaveAndPot" className = "tile">
                <button id="leaveLobby" onClick={(e) => {
                    leaveCurrentSlot();
                }}>Leave this Lobby</button>
                <div id="pot">
                    <p id="countdown"></p>
                    <p id="winner"></p>
                    <p>Current Pot:</p>
                    <div id="globalPot">{props.globalPot}</div>
                    <img id="pileImg" src="./assets/img/pileofcoins.png" alt="pileofCoins" />
                </div>
            </section>
            <section id="slotWrapper" className = "tile">
                <button id="joinLobby" onClick={(e) => {
                    setupSlotSocket();
                }}>+</button>
                <div id="slotContainer"></div>

            </section>
        </div>
    );
}
//This is the initial function which loads in the beginning, It is in charge of setting up all the 
//Sockets and loads the lobby and session chip data for the user.
const init = async () => {
    socket.on('sendUpdatedPot', loadLobby);

    socket.on('sendData', loadSlots);


    socket.on('sendSlotData', updateSlots);

    socket.on('removeSlot', leaveLobby);
    let token = await bringToken();
    await setupLobby();

    let sessionUsername = await getSessionAcctInfo();
    let acctChipValue = await getChips(sessionUsername, token);
    loadChips({ username: sessionUsername, chipValue: acctChipValue });

}

window.onload = init;
