var React = require('react');
var $ = require('jquery');

// Represents the user login class, which is 
// a child component of the Navbar class.
// Passed properties: {getRole(res)}
var Login = React.createClass({ 
	/**
	 * Renders the login.
	 * @return Renders the login form if not logged or displays the 
	 * 	username if logged.
	 */
	render: function() {
		var login = (this.state.logged) ? 
			<div>
				{this.state.username}
				<button onClick={this.handleLogout}>Logout</button>
			</div> 
			:
			<div>
				<form name="loginForm">
					<input type="text" name="username" placeholder="Username"/>
					<input type="password" name="password" placeholder="Password"/>
					<button onClick={this.handleLogin}>Login</button>
				</form>
			</div>;
				
		return( 
			<div>
				{login}
			</div>
		);
	},
	/**
	 * Initiates the component's states.
	 * @return {logged} true if user is logged 
	 *		{username} current logged username. Null if not logged.
	 */
	getInitialState: function() {
		return {
			logged : false,
			username: ""
		};
	},
	/**
	 * Needed to use context.router 
	 */
	contextTypes: { 
		router: React.PropTypes.object.isRequired
	},
	/**
	 * Whenever a page refreshes or a page is open, it'll
	 * relog the user if it hasn't logout.
	 */
	componentDidMount: function() {
		this.relog();
	},
	
	
	/**
	 * Logins the user if the username exists in the database
	 * and the correct password was input. After being log, It'll create a 
	 * session for the user and redirect to the welcome page.
	 * @param {e} button onClick event listener
	 */
	handleLogin: function(e) {
		e.preventDefault();
		var form = document.forms.loginForm;
		var username = form.username.value;
		var password = form.password.value;
		var user = { 
			"username" : username,
			"password" : password
		};
		
		// No empty form fields allowed
		if(username == null || username == "" ||
		password == null || password == "") {
			alert("Username or Password is empty");
			return;
		}

		$.ajax({
			type: 'POST', 
			url: '/api/login', 
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function(data) {
				if(data != null) {
					this.setState({
						logged: true,
						username: data.username
					});
					// Sending the role to the parent(Navbar) component
					this.props.getRole(data.role);
					// Redirecting to the welcome page after login
					this.context.router.push('/welcome');
				} else {
					alert("Invalid username or wrong password");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleLogin)Callback error! ", err);
			}
		});
	},
	/**
	 * Logs the user out if logout button was click and 
	 * destroying the user's session.
	 * @param {e} button onClick event listener 
	 */
	handleLogout: function(e) {
		e.preventDefault();

		$.ajax({
			type: 'POST', 
			url: '/api/logout', 
			contentType: 'application/json',
			success: function() {
				this.setState({
					logged: false,
					username: ""
				});
				// Sending role to change role state in Navbar
				this.props.getRole(null);
				// Redirect to home page
				this.context.router.push('/');
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleLogout)Callback error! ", err);
			}
		});
	},
	/**
	 * Relogs the user if the user hasn't log out and tries to refresh or 
	 * any similar actions of reopening a page. 
	 */
	relog: function() {
		$.ajax({
			type: 'POST',
			url: '/api/relog',
			contentType: 'application/json',
			success: function(session) {
				if(session != null) {
					this.setState({
						logged: true,
						username: session.username
					});
					this.props.getRole(session.role);
					// Intended use for forcing an update to Navbar 
					// which will update the Tabs class components.
					this.props.getRole(session.role); 
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(relog)Callback error! ", err);
			}
		});
	}
});

module.exports = Login;