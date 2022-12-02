const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getAcctInfo', mid.requiresLogin, controllers.Account.getAcctInfo);

  app.post('/getChips', mid.requiresLogin, controllers.Account.getChips);
  app.post('/sendChips', mid.requiresLogin, controllers.Account.addChips);

  app.post('/createSlot', mid.requiresLogin, controllers.Slots.makeSlot);
  app.get('/getSlots', mid.requiresLogin, controllers.Slots.getSlots);

  app.post('/makeLobby', mid.requiresLogin, controllers.Lobby.makeLobby);
  app.get('/getLobby', mid.requiresLogin, controllers.Lobby.getCurrentLobby);

  app.post('/sendToPot', mid.requiresLogin, controllers.Lobby.setLobbyPot);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
