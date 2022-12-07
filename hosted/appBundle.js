/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./client/helper.js":
/*!**************************!*\
  !*** ./client/helper.js ***!
  \**************************/
/***/ ((module) => {

eval("/* Takes in an error message. Sets the error message up in html, and\n   displays it to the user. Will be hidden by other events that could\n   end in an error.\n*/\nconst handleError = message => {\n  document.getElementById('errorMessage').textContent = message;\n};\n\n/* Sends post requests to the server using fetch. Will look for various\n   entries in the response JSON object, and will handle them appropriately.\n*/\n\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nconst sendChips = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  if (result.error) {\n    handleError(result.error);\n  }\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nmodule.exports = {\n  handleError,\n  sendChips,\n  sendPost\n};\n\n//# sourceURL=webpack://Logins/./client/helper.js?");

/***/ }),

/***/ "./client/maker.jsx":
/*!**************************!*\
  !*** ./client/maker.jsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\nconst socket = io();\n\n//This function is in charge of sending the amount of the chips the user bought from the chip store\n//This is activated if they choose 'send chips'.\nconst handleChipTransaction = async e => {\n  e.preventDefault();\n  let options = e.target.querySelectorAll('.options');\n  let token = await bringToken();\n  for (let option of options) {\n    if (option.checked) {\n      let chipValue = option.value;\n      let sessionUsername = await getSessionAcctInfo();\n      helper.sendPost('/sendChips', {\n        chips: chipValue,\n        sentUsername: sessionUsername,\n        _csrf: token\n      }, loadChips);\n      break;\n    }\n  }\n};\n\n//This is the React DOM that shows the different options for transactions. \n//When the user clicks 'back to lobby', it loads back the lobby and overrites the store react DOM\nconst DisplayTransactions = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"transactionPage\"\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    id: \"backButton\",\n    onClick: e => setupLobby()\n  }, \"Back to Lobby\"), /*#__PURE__*/React.createElement(\"form\", {\n    id: \"chipStore\",\n    onSubmit: handleChipTransaction,\n    name: \"chipStore\",\n    action: \"/sendChips\",\n    method: \"POST\"\n  }, /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"lowOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"500\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"500 chips for $4.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"mediumOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"2500\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"2500 chips for $19.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"highOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"10000\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"10000 chips for $4.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"submit\",\n    value: \"Send Chips\"\n  })));\n};\n\n//This method checks to see if all the users have their bets placed. If they do, we start the game.\nconst checkAndStartCountdown = async e => {\n  let slots = document.querySelectorAll(\".slots\");\n  for (let slot of slots) {\n    let submitButton = slot.querySelector(\"#wagerButton\");\n    if (!submitButton.disabled) {\n      return false;\n    }\n  }\n  let countdownDom = document.querySelector(\"#countdown\");\n  let winnerDom = document.querySelector(\"#winner\");\n  winnerDom.textContent = \" \";\n\n  //We first begin with doing a timed interval, which will act as a 5 second countdown to choose the winner\n  const countdownInter = setInterval(countdown, 1000);\n  let startTime = 5;\n  async function countdown() {\n    //When the timer reaches 0, we stop the timer, choose a random slot from the lobby...\n    if (startTime === 0) {\n      clearInterval(countdownInter);\n      let randomSlotIndex = Math.floor(Math.random() * slots.length);\n      let chosenSlot = slots[randomSlotIndex].querySelector(\"#username\");\n      winnerDom.textContent = chosenSlot.textContent + \" has won the whole pot!\";\n      let lobbyResponse = await fetch('/getLobby');\n      let lobbyData = await lobbyResponse.json();\n      let token = await bringToken();\n\n      //And remove the chips from the pot\n      helper.sendPost('/sendToPot', {\n        chips: lobbyData[0].globalPot,\n        sentUsername: chosenSlot.textContent,\n        _csrf: token\n      }, lobbyRender);\n      let acctResponse = await fetch('/getAcctInfo');\n      let acctData = await acctResponse.json();\n      console.log(acctData.username, chosenSlot.textContent);\n      if (acctData.username === chosenSlot.textContent) {\n        //To return to the winner\n        helper.sendPost('/sendChips', {\n          chips: lobbyData[0].globalPot,\n          sentUsername: chosenSlot.textContent,\n          _csrf: token\n        }, loadChips);\n      }\n      for (let slot of slots) {\n        let submitButton = slot.querySelector(\"#wagerButton\");\n        submitButton.disabled = false;\n        submitButton.style.opacity = \"100%\";\n      }\n    }\n    countdownDom.textContent = 'Every Player is ready! Starting game in ' + startTime + ' seconds.';\n    startTime--;\n  }\n};\n\n//This is a helper method to quickly get the _csrf token\nconst bringToken = async () => {\n  const tokenResponse = await fetch('/getToken');\n  const token = await tokenResponse.json();\n  return token.csrfToken;\n};\n\n//This is a helper method to get the chips the specified user has. \nconst getChips = async (username, token) => {\n  let chipResponse = await fetch('/getChips', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n      acctUsername: username,\n      _csrf: token\n    })\n  });\n  const chipData = await chipResponse.json();\n  return chipData.chips;\n};\n\n//This is the react DOM to show the chip balance a user has\nconst DisplayChipBalance = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"currencyDOM\",\n    className: \"tile\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    id: \"currency\",\n    className: \"tile\"\n  }, props.chips), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"navToTransactions\",\n    className: \"tile\",\n    onClick: e => ReactDOM.render( /*#__PURE__*/React.createElement(DisplayTransactions, {\n      csrf: props.csrf\n    }), document.querySelector(\"#lobbyWrapper\"))\n  }, \"+\"));\n};\n\n//This is more react DOM to show the username\nconst DisplayUsername = props => {\n  return /*#__PURE__*/React.createElement(\"div\", null, /*#__PURE__*/React.createElement(\"p\", {\n    className: \"username greet\"\n  }, \"Welcome, \"), /*#__PURE__*/React.createElement(\"p\", {\n    className: \"username name\"\n  }, /*#__PURE__*/React.createElement(\"strong\", null, props.username)));\n};\n\n//This method is in charge of rendering the react DOM to the client\nconst loadChips = async acctObj => {\n  let acctResponse = await fetch('/getAcctInfo');\n  let acctData = await acctResponse.json();\n  if (acctData.username === acctObj.username) {\n    ReactDOM.render( /*#__PURE__*/React.createElement(DisplayChipBalance, {\n      chips: acctObj.chipValue,\n      username: acctObj.username\n    }), document.querySelector('#chipData'));\n    ReactDOM.render( /*#__PURE__*/React.createElement(DisplayUsername, {\n      username: acctObj.username\n    }), document.querySelector(\"#displayingUsername\"));\n  }\n};\n\n//This function is called when the user wants to wager a bet.\nconst handlePot = async e => {\n  e.preventDefault();\n  let chipWager = e.target.querySelector('#chipWager').value;\n  let slotUsername = e.target.querySelector('#username').textContent;\n  const sessionAcctResponse = await fetch('/getAcctInfo');\n  const sessionAcctData = await sessionAcctResponse.json();\n  let token = await bringToken();\n\n  //We get the balance from the user, and then add it to the pot, while also removing it from the user\n  let chipBalance = await getChips(slotUsername, token);\n\n  //Because of SocketIO, there has to be many checks in place so that one user cannot call a post from another\n  //Many times we check to see if the current session username matches the one that the target slot has.\n  if (chipWager <= chipBalance && slotUsername === sessionAcctData.username) {\n    let inverseValue = parseInt(chipWager, 10);\n    inverseValue = -inverseValue;\n    helper.sendPost('/sendToPot', {\n      chips: inverseValue,\n      sentUsername: slotUsername,\n      _csrf: token\n    }, lobbyRender);\n    helper.sendPost('/sendChips', {\n      chips: inverseValue,\n      sentUsername: slotUsername,\n      _csrf: token\n    }, loadChips);\n    let thisSlotName = e.target.id;\n    socket.emit('reRenderSlots', {\n      updatedSlot: thisSlotName,\n      wagerAmount: chipWager\n    });\n  }\n};\n\n//This is the slot DOM \nconst SlotDOM = props => {\n  const slotNodes = props.slots.map(slot => {\n    return /*#__PURE__*/React.createElement(\"form\", {\n      id: slot.username,\n      className: \"slots tile is-vertical\",\n      key: slot._id,\n      onSubmit: handlePot,\n      name: slot._id,\n      action: \"/addToPot\",\n      method: \"POST\"\n    }, /*#__PURE__*/React.createElement(\"label\", {\n      id: \"intro\"\n    }, \"Username:\"), /*#__PURE__*/React.createElement(\"label\", {\n      id: \"username\"\n    }, slot.username), /*#__PURE__*/React.createElement(\"label\", {\n      id: \"chipLabel\",\n      htmlFor: \"wagerNum\"\n    }, \" Chip Wager: \"), /*#__PURE__*/React.createElement(\"input\", {\n      id: \"chipWager\",\n      type: \"number\",\n      name: \"wagerNum\",\n      placeholder: \"Enter your wager here:\"\n    }), /*#__PURE__*/React.createElement(\"input\", {\n      id: \"wagerButton\",\n      className: \"formSubmit\",\n      type: \"submit\",\n      value: \"Wager\"\n    }));\n  });\n  return /*#__PURE__*/React.createElement(\"div\", {\n    className: \"tile\"\n  }, slotNodes);\n};\n\n//This is a method that is called after a Socket emit, and disables users from wagering again until the game is over\nconst updateSlots = socketData => {\n  let selectedSlot = document.getElementById(socketData.updatedSlot);\n  let submitButton = selectedSlot.querySelector(\"#wagerButton\");\n  submitButton.disabled = true;\n  submitButton.style.opacity = \"50%\";\n  selectedSlot.querySelector(\"#chipWager\").value = socketData.wagerAmount;\n  checkAndStartCountdown();\n};\n\n//This is a socket io method that calls for the lobby to be rendered again for all users\nconst lobbyRender = lobbyResponse => {\n  socket.emit('renderLobby', lobbyResponse);\n};\n\n//This renders the Lobby DOM\nconst loadLobby = lobbyResponse => {\n  ReactDOM.render( /*#__PURE__*/React.createElement(LobbyDOM, {\n    globalPot: lobbyResponse.globalPot\n  }), document.getElementById('lobbyWrapper'));\n};\n\n//This is a helper method to get the username of the session account\nconst getSessionAcctInfo = async () => {\n  const acctResponse = await fetch('/getAcctInfo');\n  const acctData = await acctResponse.json();\n  return acctData.username;\n};\n\n//This method is simply updating the lobby again with the new slot lobby.\nconst leaveLobby = async slotData => {\n  ReactDOM.render( /*#__PURE__*/React.createElement(SlotDOM, {\n    slots: slotData.slots\n  }), document.getElementById('slotContainer'));\n};\n\n//This method is called when the user wants to leave the lobby, and also communicates with Socket so that all users\n//see that the player has left.\nconst leaveCurrentSlot = async () => {\n  await fetch('/removeSlot');\n  let slotData = await getSlotObj();\n  socket.emit('takeSlot', slotData);\n};\n\n//This is a helper method to get the slot data\nconst getSlotObj = async () => {\n  const slotResponse = await fetch('/getSlots');\n  const slotData = await slotResponse.json();\n  return slotData;\n};\n\n//This method is in charge of creating/loading the current lobby\nconst setupLobby = async () => {\n  const lobbyResponse = await fetch('/getLobby');\n  const lobbyData = await lobbyResponse.json();\n  const token = await bringToken();\n  if (lobbyData.length < 1) {\n    helper.sendPost('/makeLobby', {\n      startingPot: 0,\n      _csrf: token\n    }, loadLobby);\n  } else {\n    loadLobby(lobbyData[0]);\n  }\n  let slots = await getSlotObj();\n  loadSlots(slots);\n};\n\n//This is in charge of loading the React DOM for the slots\nconst loadSlots = async slotData => {\n  ReactDOM.render( /*#__PURE__*/React.createElement(SlotDOM, {\n    slots: slotData.slots\n  }), document.getElementById('slotContainer'));\n};\n\n//This method is in charge of setting up the Socket and Slot together. It first creates the slot,\n//then emits to Socket so that every user's DOM updates with that new slot\nconst setupSlotSocket = async () => {\n  const account = await fetch('/getAcctInfo');\n  const acctData = await account.json();\n  let sessionUsername = await getSessionAcctInfo();\n  let slotToken = await bringToken();\n  helper.sendPost('/createSlot', {\n    username: sessionUsername,\n    id: acctData.id,\n    _csrf: slotToken\n  });\n  let slotData = await getSlotObj();\n  socket.emit('renderSlot', slotData);\n};\n\n//This is the DOM for the lobby\nconst LobbyDOM = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"lobby\"\n  }, /*#__PURE__*/React.createElement(\"section\", {\n    id: \"leaveAndPot\",\n    className: \"tile\"\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    id: \"leaveLobby\",\n    onClick: e => {\n      leaveCurrentSlot();\n    }\n  }, \"Leave this Lobby\"), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"pot\"\n  }, /*#__PURE__*/React.createElement(\"p\", {\n    id: \"countdown\"\n  }), /*#__PURE__*/React.createElement(\"p\", {\n    id: \"winner\"\n  }), /*#__PURE__*/React.createElement(\"p\", null, \"Current Pot:\"), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"globalPot\"\n  }, props.globalPot), /*#__PURE__*/React.createElement(\"img\", {\n    id: \"pileImg\",\n    src: \"./assets/img/pileofcoins.png\",\n    alt: \"pileofCoins\"\n  }))), /*#__PURE__*/React.createElement(\"section\", {\n    id: \"slotWrapper\",\n    className: \"tile\"\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    id: \"joinLobby\",\n    onClick: e => {\n      setupSlotSocket();\n    }\n  }, \"+\"), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"slotContainer\"\n  })));\n};\n//This is the initial function which loads in the beginning, It is in charge of setting up all the \n//Sockets and loads the lobby and session chip data for the user.\nconst init = async () => {\n  socket.on('sendUpdatedPot', loadLobby);\n  socket.on('sendData', loadSlots);\n  socket.on('sendSlotData', updateSlots);\n  socket.on('removeSlot', leaveLobby);\n  let token = await bringToken();\n  await setupLobby();\n  let sessionUsername = await getSessionAcctInfo();\n  let acctChipValue = await getChips(sessionUsername, token);\n  loadChips({\n    username: sessionUsername,\n    chipValue: acctChipValue\n  });\n};\nwindow.onload = init;\n\n//# sourceURL=webpack://Logins/./client/maker.jsx?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./client/maker.jsx");
/******/ 	
/******/ })()
;