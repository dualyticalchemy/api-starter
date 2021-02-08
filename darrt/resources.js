/**
 * @namespace resources
 */
/*****************************************
// bigco, inc
// darrt resources 
// 2020-02-01 : mamund
 *****************************************/

/*******************************************
// initialization and setup for DARRT
********************************************/
var express, router, bodyParser, actions, representation, 
  transitions, utils, templates, forms, metadata;

init();

// shared metadata for this service
metadata = [
  {name: "title", value: "BigCo Activity Records"},
  {name: "author", value: "Mike Amundsen"},
  {name: "release", value: "1.0.0"},
  {name: "generated", value: "{date}"}, 
  {name: "url", value: "{fullhost}"}
];

router.use(timeLog);

/**
 * @memberof resources
 * @function timeLog
 * @desc
 * optional tracking middleware
 * @param {} req
 * @param {} res
 * @param {} next
 */
function timeLog (req, res, next) {
  console.log('Time: ', Date.now() + " : " + req.headers.host + req.url + " : " + req.method + " : " + JSON.stringify(req.body))
  next()
}

/************************************************************************/

// ***********************************************************
// public resources for the api service
// ***********************************************************
router.get('/', getHome);
router.post('/', postResource);
router.get('/list/', listResources);
router.get('/filter/', filterResource);
router.get('/:id', getResource);
router.put('/:id', putResource);
router.delete('/:id', deleteResource);
router.patch('/status/:id', patchResourceStatus);

/**
 * @memberof resources
 * @function getHome
 * @param {} req
 * @param {} res
 */
function getHome (req,res) {
  var args = {};
  args.request = req;
  args.response = res;
  args.action = actions.home;
  args.type = "home";
  args.config = {
    metadata:metadata,
    templates:templates,
    forms:forms,
    filter:"home"
  };
  respond(args);
}

/**
 * @memberof resources
 * @function postResource
 * @param {} req
 * @param {} res
 */
function postResource (req,res) {
  var args = {};
  args.request = req;
  args.response = res;
  args.action = actions.create;
  args.type = "api";
  args.config = {
    metadata:metadata,
    templates:templates,
    forms:forms,
    filter:"list"
  };
  respond(args);
}

/**
 * @function listResources
 * @memberof resources
 * @param {} req
 * @param {} res
 */
function listResources (req,res) {
  var args = {};
  args.request = req;
  args.response = res;
  args.action = actions.list;
  args.type = "api";
  args.config = {
    metadata:metadata,
    templates:templates,
    forms:forms,
    filter:"list"
  };
  respond(args);
}

/**
 * @function filterResource
 * @memberof resources
 * @param {} req
 * @param {} res
 */
function filterResource (req,res){
  var args = {};
  args.request = req;
  args.response = res;
  args.action = actions.filter;
  args.type = "api";
  args.config = {
    metadata:metadata,
    templates:templates,
    forms:forms,
    filter:"list"
  };
  respond(args);
}

/**
 * @function getResource
 * @memberof resources
 * @param {} req
 * @param {} res
 */
function getResource (req,res) {
  var args = {};
  args.request = req;
  args.response = res;
  args.action = actions.read;
  args.type = "api";
  args.config = {
    metadata:metadata,
    templates:templates,
    forms:forms,
    filter:"item"
  };
  respond(args);
}

/**
 * @function putResource
 * @memberof resources
 * @param {} req
 * @param {} res
 */
function putResource (req,res) {
  var args = {};
  args.request = req;
  args.response = res;
  args.action = actions.update;
  args.type = "api";
  args.config = {
    metadata:metadata,
    templates:templates,
    forms:forms,
    filter:"item"
  };
  respond(args);
}

/**
 * @function deleteResource
 * @memberof resources
 * @param {} req
 * @param {} res
 */
function deleteResource (req,res) {
  var args = {};
  args.request = req;
  args.response = res;
  args.action = actions.remove;
  args.type = "api";
  args.config = {
    metadata:metadata,
    templates:templates,
    forms:forms,
    filter:"list"
  };
  respond(args);
}

/**
 * @function patchResourceStatus
 * @memberof resources
 * @param {} req
 * @param {} res
 */
function patchResourceStatus (req, res) {
  var args = {};
  args.request = req;
  args.response = res;
  args.action = actions.status;
  args.type = "api";
  args.config = {
    metadata:metadata,
    templates:templates,
    forms:forms,
    filter:"item"
  };
  respond(args);
}

/***********************************************************************/

/**
 * @function init
 * @memberof resources
 * @desc
 * initialize module
 */
function init () {
  express = require('express')
  router = express.Router()
  bodyParser = require('body-parser');

  actions = require('./actions');
  representation = require('./representation');
  transitions = require('./transitions');
  utils = require('./lib/utils');

  // set up request body parsing & response templates
  router.use(bodyParser.json({ type:representation.getResponseTypes() }));
  router.use(bodyParser.urlencoded({ extended:representation.urlencoded }));

  // load response templates and input forms
  templates = representation.getTemplates();
  forms = transitions.forms;
}

/**
 * @function respond
 * @memberof resources
 * @param {} args
 * @desc
 * local resour5ce handler function
 */
function respond (args) {
  var request = args.request||null;
  var response = args.response||null;
  var action = args.action||null;
  var object = args.type||"";
  var config = args.config||{};

  return utils.handler(request, response, action, object, config);	
}

// publish the capability routes
module.exports = router

