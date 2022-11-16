const helper = require('./helper.js');
const socket = io();


const handleChipTransaction = async (e) => {
    e.preventDefault();
    let options = e.target.querySelectorAll('.options');
    let token = e.target.querySelector("#_csrf").value;
    for (let option of options) {
        if (option.checked) {
            let chipValue = option.value;
            await fetch(e.target.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({chips: chipValue, _csrf: token }),
            });
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


const handlePot = (e) => {
    e.preventDefault();

    //first thing we should worry about is socketIO
}

const SlotDOM = (props) => {
    return (
        <form id={props.id}
            onSubmit={handlePot}
            name={props.id}
            action="/addToPot"
            method="POST"
        >
            <label>{props.username}</label>
            <label htmlFor="wager">Chip Wager: </label>
            <input id="chipWager" type="number" min="0" name="wager" />
        </form>
    );
}

const renderSlot = (userData) => {
    let newSlot = document.createElement("div");
    newSlot.setAttribute("class", "slots");

    let parentDiv = document.getElementById('slots');
    parentDiv.insertBefore(newSlot, document.getElementById('joinLobby'));

    ReactDOM.render(<SlotDOM username = {userData.username} id = {userData._id} />, newSlot)    ;
}

const setupSlotSocket = async () => {
    const account = await fetch('/getAcctInfo');
    const acctData = await account.json();
    socket.emit('addSlot', { username: acctData.username, id: acctData._id });
}

const LobbyDOM = () => {
    return (
        <div id="lobby">
            <p>Global Pot placeholder</p>
            <div id="slots">
                <button id="joinLobby" onClick={(e) => {
                    setupSlotSocket();
                }}>+</button>
            </div>
        </div>
    );
}


const init = async () => {
    const tokenResponse = await fetch('/getToken');
    const token = await tokenResponse.json();

    const chipResponse = await fetch('/getChips');
    const chipData = await chipResponse.json();

    ReactDOM.render(
        <DisplayChips chips={chipData.chips.chips} csrf={token.csrfToken} />,
        document.querySelector('#chipData')
    );
    ReactDOM.render(
        <LobbyDOM />, document.getElementById('content')
    );

    socket.on('sendData', renderSlot);


    //socket.on('addDOM', communityDomoLoading);
    //loadDomosFromServer();
}

window.onload = init;
