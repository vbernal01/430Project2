const models = require('../models');

const AccountModel = require('../models/Account');

const { Account } = models;

// These few methods are in charge of handling the login and signup
// information for the account.

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash, chips: 500 });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/maker' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use.' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};
const makerPage = (req, res) => res.render('app');

// The getToken and getChips get both data from the account model.
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

const getChips = (req, res) => {
  const sessionUsername = req.body.acctUsername;

  AccountModel.findChips(sessionUsername, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured! ' });
    }
    const chipValue = docs.chips;
    return res.json({ chips: chipValue, username: sessionUsername });
  });
};

// This add chips method is in charge of adding or removing chips
// from the specified user.
const addChips = async (req, res) => {
  const addedValue = await AccountModel.setChips(req.body.sentUsername, req.body.chips);
  return res.json({ chipValue: addedValue, username: req.body.sentUsername });
};

// Another helper method
const getAcctInfo = (req, res) => res.json({
  username: req.session.account.username,
  id: req.session.account._id,
});
module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  getChips,
  getAcctInfo,
  addChips,
  makerPage,
};
