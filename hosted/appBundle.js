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

eval("/* Takes in an error message. Sets the error message up in html, and\n   displays it to the user. Will be hidden by other events that could\n   end in an error.\n*/\nconst handleError = message => {\n  document.getElementById('errorMessage').textContent = message;\n  document.getElementById('domoMessage').classList.remove('hidden');\n};\n\n/* Sends post requests to the server using fetch. Will look for various\n   entries in the response JSON object, and will handle them appropriately.\n*/\n\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nconst sendChips = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  if (result.error) {\n    handleError(result.error);\n  }\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nconst hideError = () => {\n  document.getElementById('domoMessage').classList.add('hidden');\n};\nmodule.exports = {\n  handleError,\n  sendChips,\n  hideError,\n  sendPost\n};\n\n//# sourceURL=webpack://Logins/./client/helper.js?");

/***/ }),

/***/ "./client/maker.jsx":
/*!**************************!*\
  !*** ./client/maker.jsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\nconst socket = io();\nconst handleChipTransaction = async e => {\n  e.preventDefault();\n  let options = e.target.querySelectorAll('.options');\n  let token = await bringToken();\n  console.log(\"token when adding chips\" + token);\n  for (let option of options) {\n    if (option.checked) {\n      let chipValue = option.value;\n      let response = await fetch(e.target.action, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n          chips: chipValue,\n          _csrf: token\n        })\n      });\n      let chipData = await response.json();\n      ReactDOM.render( /*#__PURE__*/React.createElement(DisplayChips, {\n        csrf: token,\n        chips: chipData.newChipValue\n      }), document.getElementById('chipData'));\n      break;\n    }\n  }\n};\nconst DisplayTransactions = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"transactionPage\"\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    id: \"backButton\",\n    onClick: e => ReactDOM.render( /*#__PURE__*/React.createElement(LobbyDOM, null), document.getElementById('content'))\n  }, \"Back to Lobby\"), /*#__PURE__*/React.createElement(\"form\", {\n    id: \"chipStore\",\n    onSubmit: handleChipTransaction,\n    name: \"chipStore\",\n    action: \"/sendChips\",\n    method: \"POST\"\n  }, /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"lowOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"500\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"500 chips for $4.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"mediumOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"2500\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"2500 chips for $19.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"highOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"10000\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"10000 chips for $4.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"submit\",\n    value: \"Send Chips\"\n  })));\n};\nconst DisplayChips = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"currency\",\n    className: \"navlink\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    id: \"currency\"\n  }, \"Chips: \", props.chips), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"navToTransactions\",\n    onClick: e => ReactDOM.render( /*#__PURE__*/React.createElement(DisplayTransactions, {\n      csrf: props.csrf\n    }), document.querySelector(\"#content\"))\n  }, \"Get more Chips\"));\n};\nconst checkAndStartCountdown = async e => {\n  let slots = document.querySelectorAll(\".slots\");\n  // for(let slot of slots){\n  //     let submitButton = slot.querySelector(\"#wagerButton\");\n  //     if(!submitButton.disabled){\n  //         return false;\n  //     }\n  // }\n  let countdownDom = document.querySelector(\"#countdown\");\n  const countdownInter = setInterval(countdown, 1000);\n  let startTime = 5;\n  function countdown() {\n    if (startTime === 0) {\n      clearInterval(countdownInter);\n      let randomSlotIndex = Math.floor(Math.random() * slots.length);\n      let chosenSlot = slots[randomSlotIndex].querySelector(\"#username\");\n      countdownDom.textContent = chosenSlot.textContent + \" has won the whole pot!\";\n    }\n    countdownDom.textContent = 'Every Player is ready! Starting game in ' + startTime + ' seconds.';\n    startTime--;\n  }\n};\nconst handlePot = async e => {\n  e.preventDefault();\n  let chipWager = e.target.querySelector('#chipWager').value;\n  let inverseValue = parseInt(chipWager, 10);\n  inverseValue = -inverseValue;\n  let username = document.getElementById('username').textContent;\n  let token = await bringToken();\n  console.log(\"token when submitting wager \" + token);\n  helper.sendPost('/sendToPot', {\n    chips: inverseValue,\n    sentUsername: username,\n    _csrf: token\n  }, loadLobby);\n  helper.sendPost('/sendChips', {\n    chips: inverseValue,\n    sentUsername: username,\n    _csrf: token\n  }, loadChips);\n  let submitButton = e.target.querySelector(\"#wagerButton\");\n  submitButton.disabled = true;\n  submitButton.style.opacity = \"50%\";\n  checkAndStartCountdown();\n};\nconst SlotDOM = props => {\n  const slotNodes = props.slots.map(slot => {\n    return /*#__PURE__*/React.createElement(\"form\", {\n      id: slot._id,\n      className: \"slots\",\n      key: slot._id,\n      onSubmit: handlePot,\n      name: slot._id,\n      action: \"/addToPot\",\n      method: \"POST\"\n    }, /*#__PURE__*/React.createElement(\"label\", {\n      id: \"username\"\n    }, slot.username), /*#__PURE__*/React.createElement(\"label\", {\n      htmlFor: \"wagerNum\"\n    }, \" Chip Wager: \"), /*#__PURE__*/React.createElement(\"input\", {\n      id: \"chipWager\",\n      type: \"number\",\n      name: \"wagerNum\",\n      placeholder: \"Enter your selected wager here:\"\n    }), /*#__PURE__*/React.createElement(\"input\", {\n      id: \"wagerButton\",\n      className: \"formSubmit\",\n      type: \"submit\",\n      value: \"Wager\"\n    }));\n  });\n  return /*#__PURE__*/React.createElement(\"div\", null, slotNodes);\n};\nconst loadSlots = async response => {\n  if (!response || !response.error) {\n    const slotResponse = await fetch('/getSlots');\n    const slotData = await slotResponse.json();\n    ReactDOM.render( /*#__PURE__*/React.createElement(SlotDOM, {\n      slots: slotData.slots\n    }), document.getElementById('slotContainer'));\n  }\n};\nconst renderSlot = async userData => {\n  helper.sendPost('/createSlot', {\n    username: userData.username,\n    id: userData.id,\n    _csrf: userData._csrf\n  }, loadSlots);\n};\nconst bringToken = async () => {\n  const tokenResponse = await fetch('/getToken');\n  const token = await tokenResponse.json();\n  return token.csrfToken;\n};\nconst setupSlotSocket = async () => {\n  const account = await fetch('/getAcctInfo');\n  const acctData = await account.json();\n  let slotToken = await bringToken();\n  socket.emit('renderSlot', {\n    username: acctData.username,\n    id: acctData.id,\n    _csrf: slotToken\n  });\n};\nconst LobbyDOM = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"lobby\"\n  }, /*#__PURE__*/React.createElement(\"p\", null, \"Global Pot:\"), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"globalPot\"\n  }, props.globalPot), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"slotWrapper\"\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    id: \"joinLobby\",\n    onClick: e => {\n      setupSlotSocket();\n    }\n  }, \"+\"), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"slotContainer\"\n  }), /*#__PURE__*/React.createElement(\"p\", {\n    id: \"countdown\"\n  })));\n};\nconst loadLobby = lobbyResponse => {\n  ReactDOM.render( /*#__PURE__*/React.createElement(LobbyDOM, {\n    globalPot: lobbyResponse.globalPot\n  }), document.getElementById('content'));\n};\nconst getChips = async (username, token) => {\n  let chipResponse = await fetch('/getChips', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({\n      acctUsername: username,\n      _csrf: token\n    })\n  });\n  const chipData = await chipResponse.json();\n  return chipData.chips;\n};\nconst loadChips = async acctObj => {\n  console.log(acctObj);\n  ReactDOM.render( /*#__PURE__*/React.createElement(DisplayChips, {\n    chips: acctObj.chipValue,\n    acctUsername: acctObj.username\n  }), document.querySelector('#chipData'));\n};\nconst init = async () => {\n  const lobbyResponse = await fetch('/getLobby');\n  const lobbyData = await lobbyResponse.json();\n  if (lobbyData.length < 1) {\n    helper.sendPost('/makeLobby', {\n      startingPot: 0,\n      _csrf: initToken\n    }, loadLobby);\n  } else {\n    loadLobby(lobbyData[0]);\n  }\n  const acctResponse = await fetch('/getAcctInfo');\n  const acctData = await acctResponse.json();\n  const sessionUsername = acctData.username;\n  let token = await bringToken();\n  let acctChipValue = await getChips(sessionUsername, token);\n  loadChips({\n    username: sessionUsername,\n    chipValue: acctChipValue\n  });\n  socket.on('sendData', renderSlot);\n  loadSlots();\n  //socket.on('addDOM', communityDomoLoading);\n  //loadDomosFromServer();\n};\n\nwindow.onload = init;\n\n//# sourceURL=webpack://Logins/./client/maker.jsx?");

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