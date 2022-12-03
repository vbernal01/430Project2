const helper = require('./helper.js');
const socket = io();


const handleChipTransaction = async (e) => {
    e.preventDefault();
    let options = e.target.querySelectorAll('.options');
    let token = await bringToken()
    for (let option of options) {
        if (option.checked) {
            let chipValue = option.value;
            let response = await fetch(e.target.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chips: chipValue, _csrf: token }),
            });
            let chipData = await response.json();
            ReactDOM.render(<DisplayChips csrf={token} chips={chipData.newChipValue} />, document.getElementById('chipData'));
            break;
        }
    }

}

const DisplayTransactions = (props) => {

    return (
        <div id="transactionPage">
            <button id="backButton" onClick={(e) => ReactDOM.render(<LobbyDOM />, document.getElementById('content'))}>Back to Lobby</button>
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

const DisplayChips = (props) => {
    return (
        <div id="currency" className="navlink">
            <div id="currency">Chips: {props.chips}</div>
            <div id="navToTransactions" onClick={(e) => ReactDOM.render(<DisplayTransactions csrf={props.csrf} />, document.querySelector("#content"))}>Get more Chips</div>
        </div>
    )
}

const checkAndStartCountdown = async (e) => {
    let slots = document.querySelectorAll(".slots")
    // for(let slot of slots){
    //     let submitButton = slot.querySelector("#wagerButton");
    //     if(!submitButton.disabled){
    //         return false;
    //     }
    // }
    let countdownDom = document.querySelector("#countdown");

    const countdownInter = setInterval(countdown, 1000)
    let startTime = 5;
    function countdown() {
        if (startTime === 0) {
            clearInterval(countdownInter);

            let randomSlotIndex = Math.floor(Math.random() * slots.length);
            let chosenSlot = slots[randomSlotIndex].querySelector("#username");


            countdownDom.textContent = chosenSlot.textContent + " has won the whole pot!";


        }
        countdownDom.textContent = 'Every Player is ready! Starting game in ' + startTime + ' seconds.';
        startTime--;
    }

}
const bringToken = async () => {
    const tokenResponse = await fetch('/getToken');
    const token = await tokenResponse.json();
    return token.csrfToken;
}



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

const loadChips = async (acctObj) => {
    ReactDOM.render(
        <DisplayChips chips={acctObj.chipValue} acctUsername={acctObj.username} />,
        document.querySelector('#chipData')
    );

}

const handlePot = async (e) => {
    e.preventDefault();
    let chipWager = e.target.querySelector('#chipWager').value;
    let inverseValue = parseInt(chipWager, 10);
    inverseValue = -inverseValue;
    let username = document.getElementById('username').textContent;
    let token = await bringToken();

    helper.sendPost('/sendToPot', { chips: inverseValue, sentUsername: username, _csrf: token }, lobbyRender);

    helper.sendPost('/sendChips', { chips: inverseValue, sentUsername: username, _csrf: token }, loadChips);

   

    let thisSlotName = e.target.id;
    socket.emit('reRenderSlots', {updatedSlot: thisSlotName, wagerAmount: chipWager});

}

const SlotDOM = (props) => {
    const slotNodes = props.slots.map(slot => {
        return (
            <form id={slot._id}
                className="slots"
                key={slot._id}
                onSubmit={handlePot}
                name={slot._id}
                action="/addToPot"
                method="POST"
            >
                <label id="username">{slot.username}</label>
                <label htmlFor="wagerNum"> Chip Wager: </label>
                <input id="chipWager" type="number" name="wagerNum" placeholder="Enter your selected wager here:" />
                <input id="wagerButton" className="formSubmit" type="submit" value="Wager" />
            </form>
        )
    });

    return (
        <div>
            {slotNodes}
        </div>
    );
}

const updateSlots = (socketData) => {
    
    let selectedSlot = document.getElementById(socketData.updatedSlot);
    let submitButton = selectedSlot.querySelector("#wagerButton");
    submitButton.disabled = true;
    submitButton.style.opacity = "50%";

    selectedSlot.querySelector("#chipWager").value = socketData.wagerAmount;
    //checkAndStartCountdown()

}

const loadSlots = async (response) => {
    const slotResponse = await fetch('/getSlots');
    const slotData = await slotResponse.json();
    ReactDOM.render(<SlotDOM slots={slotData.slots} />, document.getElementById('slotContainer'));
}

const renderSlot = async (userData) => {
    let shitToken = await bringToken()
    helper.sendPost('/createSlot', { username: userData.username, id: userData.id, _csrf: shitToken }, loadSlots);
}


const lobbyRender = (lobbyResponse) => {
    socket.emit('renderLobby', lobbyResponse);
}

const loadLobby = (lobbyResponse) => {
    ReactDOM.render(
        <LobbyDOM globalPot={lobbyResponse.globalPot} />, document.getElementById('content')
    );
}


const LobbyDOM = (props) => {
    return (
        <div id="lobby">
            <p>Global Pot:</p>
            <div id="globalPot">{props.globalPot}</div>
            <div id="slotWrapper">
                <button id="joinLobby" onClick={(e) => {
                    setupSlotSocket();
                }}>Join this Lobby</button>
                <div id="slotContainer">

                </div>
                <p id="countdown"></p>
            </div>
        </div>
    );
}


const setupSlotSocket = async () => {
    const account = await fetch('/getAcctInfo');
    const acctData = await account.json();
    let slotToken = await bringToken();
    socket.emit('renderSlot', { username: acctData.username, id: acctData.id, _csrf: slotToken });
}


const init = async () => {
    socket.on('sendUpdatedPot', loadLobby);

    socket.on('sendData', renderSlot);

    socket.on('sendSlotData', updateSlots);
    let token = await bringToken();

    const lobbyResponse = await fetch('/getLobby');
    const lobbyData = await lobbyResponse.json();
    if (lobbyData.length < 1) {
        helper.sendPost('/makeLobby', { startingPot: 0, _csrf: token }, loadLobby);
    }
    else {
        loadLobby(lobbyData[0]);
    }

    const acctResponse = await fetch('/getAcctInfo');
    const acctData = await acctResponse.json();
    const sessionUsername = acctData.username;
    let acctChipValue = await getChips(sessionUsername, token);
    loadChips({ username: sessionUsername, chipValue: acctChipValue });
    loadSlots();

}

window.onload = init;
