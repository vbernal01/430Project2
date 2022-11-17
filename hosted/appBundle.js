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

eval("/* Takes in an error message. Sets the error message up in html, and\n   displays it to the user. Will be hidden by other events that could\n   end in an error.\n*/\nconst handleError = message => {\n  document.getElementById('errorMessage').textContent = message;\n  document.getElementById('domoMessage').classList.remove('hidden');\n};\n\n/* Sends post requests to the server using fetch. Will look for various\n   entries in the response JSON object, and will handle them appropriately.\n*/\n\nconst sendPost = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  if (result.error) {\n    handleError(result.error);\n  }\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nconst sendChips = async (url, data, handler) => {\n  const response = await fetch(url, {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify(data)\n  });\n  const result = await response.json();\n  if (result.error) {\n    handleError(result.error);\n  }\n  if (result.redirect) {\n    window.location = result.redirect;\n  }\n  if (handler) {\n    handler(result);\n  }\n};\nconst hideError = () => {\n  document.getElementById('domoMessage').classList.add('hidden');\n};\nmodule.exports = {\n  handleError,\n  sendChips,\n  hideError,\n  sendPost\n};\n\n//# sourceURL=webpack://Logins/./client/helper.js?");

/***/ }),

/***/ "./client/maker.jsx":
/*!**************************!*\
  !*** ./client/maker.jsx ***!
  \**************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const helper = __webpack_require__(/*! ./helper.js */ \"./client/helper.js\");\nconst socket = io();\nconst handleChipTransaction = async e => {\n  e.preventDefault();\n  let options = e.target.querySelectorAll('.options');\n  let token = e.target.querySelector(\"#_csrf\").value;\n  for (let option of options) {\n    if (option.checked) {\n      let chipValue = option.value;\n      let response = await fetch(e.target.action, {\n        method: 'POST',\n        headers: {\n          'Content-Type': 'application/json'\n        },\n        body: JSON.stringify({\n          chips: chipValue,\n          _csrf: token\n        })\n      });\n      let chipData = await response.json();\n      ReactDOM.render( /*#__PURE__*/React.createElement(DisplayChips, {\n        csrf: token,\n        chips: chipData.newChipValue\n      }), document.getElementById('chipData'));\n      break;\n    }\n  }\n};\nconst DisplayTransactions = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"transactionPage\"\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    id: \"backButton\",\n    onClick: e => ReactDOM.render( /*#__PURE__*/React.createElement(LobbyDOM, null), document.getElementById('content'))\n  }, \"Back to Lobby\"), /*#__PURE__*/React.createElement(\"form\", {\n    id: \"chipStore\",\n    onSubmit: handleChipTransaction,\n    name: \"chipStore\",\n    action: \"/sendChips\",\n    method: \"POST\"\n  }, /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"lowOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"500\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"500 chips for $4.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"mediumOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"2500\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"2500 chips for $19.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"radio\",\n    id: \"highOption\",\n    className: \"options\",\n    name: \"chipOptions\",\n    value: \"10000\"\n  }), /*#__PURE__*/React.createElement(\"label\", null, \"10000 chips for $4.99\"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"_csrf\",\n    type: \"hidden\",\n    name: \"_csrf\",\n    value: props.csrf\n  }), /*#__PURE__*/React.createElement(\"input\", {\n    type: \"submit\",\n    value: \"Send Chips\"\n  })));\n};\nconst DisplayChips = props => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"currency\",\n    className: \"navlink\"\n  }, /*#__PURE__*/React.createElement(\"div\", {\n    id: \"currency\"\n  }, \"Chips: \", props.chips), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"navToTransactions\",\n    onClick: e => ReactDOM.render( /*#__PURE__*/React.createElement(DisplayTransactions, {\n      csrf: props.csrf\n    }), document.querySelector(\"#content\"))\n  }, \"Get more Chips\"));\n};\nconst handlePot = e => {\n  e.preventDefault();\n\n  //first thing we should worry about is socketIO\n};\n\nconst SlotDOM = props => {\n  return /*#__PURE__*/React.createElement(\"form\", {\n    id: props.id,\n    onSubmit: handlePot,\n    name: props.id,\n    action: \"/addToPot\",\n    method: \"POST\"\n  }, /*#__PURE__*/React.createElement(\"label\", null, props.username), /*#__PURE__*/React.createElement(\"label\", {\n    htmlFor: \"wager\"\n  }, \"Chip Wager: \"), /*#__PURE__*/React.createElement(\"input\", {\n    id: \"chipWager\",\n    type: \"number\",\n    min: \"0\",\n    name: \"wager\"\n  }));\n};\nconst loadSlots = async () => {\n  const response = await fetch('/getSlots');\n  const slotData = await response.json();\n  console.log(slotData);\n};\nconst renderSlot = async userData => {\n  console.log(userData);\n  helper.sendPost('/createSlot', {\n    username: userData.username,\n    id: userData._id,\n    _csrf: userData.csrf\n  }, loadSlots);\n\n  // let newSlot = document.createElement(\"div\");\n  // newSlot.setAttribute(\"class\", \"slots\");\n  // let parentDiv = document.getElementById('slots');\n  // parentDiv.insertBefore(newSlot, document.getElementById('joinLobby'));\n\n  // ReactDOM.render(<SlotDOM username={userData.username} id={userData._id} />, newSlot);\n};\n\nconst bringToken = async () => {\n  const tokenResponse = await fetch('/getToken');\n  const token = await tokenResponse.json();\n  return token.csrfToken;\n};\nconst setupSlotSocket = async () => {\n  const account = await fetch('/getAcctInfo');\n  const acctData = await account.json();\n  let slotToken = await bringToken();\n  socket.emit('renderSlot', {\n    username: acctData.username,\n    id: acctData._id,\n    csrf: slotToken\n  });\n};\nconst LobbyDOM = () => {\n  return /*#__PURE__*/React.createElement(\"div\", {\n    id: \"lobby\"\n  }, /*#__PURE__*/React.createElement(\"p\", null, \"Global Pot placeholder\"), /*#__PURE__*/React.createElement(\"div\", {\n    id: \"slots\"\n  }, /*#__PURE__*/React.createElement(\"button\", {\n    id: \"joinLobby\",\n    onClick: e => {\n      setupSlotSocket();\n    }\n  }, \"+\")));\n};\nconst init = async () => {\n  let initToken = await bringToken();\n  const chipResponse = await fetch('/getChips');\n  const chipData = await chipResponse.json();\n  ReactDOM.render( /*#__PURE__*/React.createElement(DisplayChips, {\n    chips: chipData.chips.chips,\n    csrf: initToken\n  }), document.querySelector('#chipData'));\n  ReactDOM.render( /*#__PURE__*/React.createElement(LobbyDOM, null), document.getElementById('content'));\n  socket.on('sendData', renderSlot);\n  loadSlots();\n  //socket.on('addDOM', communityDomoLoading);\n  //loadDomosFromServer();\n};\n\nwindow.onload = init;\n\n//# sourceURL=webpack://Logins/./client/maker.jsx?");

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