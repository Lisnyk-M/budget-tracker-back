const Router = require('express').Router;
const entriesRouter = Router();
const entriesController = require('./entries.controller');
const userAuthorise = require('../users/user.authorisation');

entriesRouter.post('/entries', userAuthorise, entriesController.addEntry);
entriesRouter.get('/entries/:date', userAuthorise, entriesController.getEntry);
entriesRouter.delete('/entries/:date', userAuthorise, entriesController.deletePosition);
entriesRouter.put('/entries/position/:date', userAuthorise, entriesController.getPosition);

module.exports = entriesRouter;