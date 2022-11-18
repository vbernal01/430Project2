const helper = require('./helper.js');
const socket = io();


const handleChipTransaction = async (e) => {
    e.preventDefault();
    let options = e.target.querySelectorAll('.options');
    let token = e.target.querySelector("#_csrf").value;
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


const handlePot = async (e) => {
    e.preventDefault();

    let chipWager = e.target.getElementById('chipWager');
    let inverseValue = parseInt(chipWager.value);
    inverseValue = -inverseValue;

    let username = e.target.getElementById('username').textContent;
    let token = await bringToken();
    helper.sendPost('/sendToPot', {chips: inverseValue, sentUsername: username, _csrf: token}, loadLobby);

   
}

const SlotDOM = (props) => {
    const slotNodes = props.slots.map(slot => {
        return (
            <form id={slot._id}
                key={slot._id}
                onSubmit={handlePot}
                name={slot._id}
                action="/addToPot"
                method="POST"
            >
                <label id = "username">{slot.username}</label>
                <label htmlFor="wager"> Chip Wager: </label>
                <input id="chipWager" type="number" min="0" name="wager" />
            </form>
        )
    });

    return (
        <div className="slots">
            {slotNodes}
        </div>
    );
}

const loadSlots = async (response) => {
    if (!response || !response.error) {
        const slotResponse = await fetch('/getSlots');
        const slotData = await slotResponse.json();
        ReactDOM.render(<SlotDOM slots={slotData.slots} />, document.getElementById('slots'));
    }
}


const renderSlot = async (userData) => {

    helper.sendPost('/createSlot', { username: userData.username, id: userData.id, _csrf: userData._csrf }, loadSlots);
}

const bringToken = async () => {
    const tokenResponse = await fetch('/getToken');
    const token = await tokenResponse.json();
    return token.csrfToken;
}

const setupSlotSocket = async () => {
    const account = await fetch('/getAcctInfo');
    const acctData = await account.json();
    let slotToken = await bringToken();
    socket.emit('renderSlot', { username: acctData.username, id: acctData.id, _csrf: slotToken });
}

const LobbyDOM = (props) => {
    return (
        <div id="lobby">
            <p>Global Pot placeholder</p>
            <div id="globalPot">{props.globalPot}</div>
            <div id="slotWrapper">
                <button id="joinLobby" onClick={(e) => {
                    setupSlotSocket();
                }}>+</button>
                <div id="slots">

                </div>
            </div>
        </div>
    );
}

const loadLobby = async (lobbyResponse) => {
    let lobbyJSON = await lobbyResponse;
    ReactDOM.render(
        <LobbyDOM globalPot={lobbyJSON.globalPot} />, document.getElementById('content')
    );
}

const init = async () => {
    let initToken = await bringToken();
    helper.sendPost('/makeLobby', { startingPot: 0, _csrf: initToken }, loadLobby);
    const chipResponse = await fetch('/getChips');
    const chipData = await chipResponse.json();
    ReactDOM.render(
        <DisplayChips chips={chipData.chips.chips} csrf={initToken} />,
        document.querySelector('#chipData')
    );


    socket.on('sendData', renderSlot);

    loadSlots();
    //socket.on('addDOM', communityDomoLoading);
    //loadDomosFromServer();
}

window.onload = init;
