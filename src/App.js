var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Redirect = require('react-router').Redirect;
var hashHistory = require('react-router').hashHistory;
var IndexRoute = require('react-router').IndexRoute;
var $ = require('jquery');

var Layout = require('./Layout');
var Home = require('./Home');
var Welcome = require('./Welcome');
var Content = require('./Content');

var NoMatch = React.createClass({
	render: function() {
		return (
			<h2>No match for the route</h2>
		);	
	}
});

/**
 * Used in the Router onEnter property before redirecting, like a hook, to 
 * restrict the pages that can only be accessed by certain roles.
 * On success, if the page is restricted, it will route to a no match page.
 * @param {nextState} contains the state and properties of the Route 
 * @param {replace} modifies states in the Route
 * @param {callback} called to unblock the transition
 */
function requireAuth(nextState, replace, callback) {
	$.ajax({
		type: 'POST', 
		url: '/api/getRole', 
		contentType: 'application/json',
		success: function(data) {
			var curPath = nextState.location.pathname;
			var restricted = restrict(data.role, curPath);
			
			if(restricted) {
				replace({
					pathname: '*',
					state: { nextPathname: nextState.location.pathname }
				})
			}
			callback();	
		}.bind(this),
		error: function(xhr, status, err) {
			console.log("(App.js_getRole)Callback error! ", err);
		}
	})	
}
/**
 * Restrict pages if the user's role has no access to it.
 * @param {role} role of the user 
 * @param {path} path being accessed 
 * @return true if the user has no access to the path 
 */
function restrict(role, path) {
	var restricted = true;
	
	switch(role) {
		case "admin": // access: welcome, content
			if(path == "/content" || path == "/welcome") {
				restricted = false;
			}
			break; 
		case "user": // access: welcome
			if(path == "/welcome") {
				restricted = false;
			}
			break;
		default: // non users can only access the "home" aka "/" page
			if(path == "/") {
				restricted = false;
			}
	}
	return restricted;
}
/** Main react render with routing components **/
ReactDOM.render(
	(	
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} onEnter={requireAuth}></IndexRoute>
			<Route path="/welcome" component={Welcome} onEnter={requireAuth} />
			<Route path="/content" component={Content} onEnter={requireAuth} />
			<Route path="*" component={NoMatch} />
		</Route>
		<Route path="*" component={NoMatch} />
	</Router>
	),
	document.getElementById('main_container')
);
