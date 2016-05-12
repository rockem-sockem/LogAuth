var React = require('react');
var $ = require('jquery');

// Class used to sign up an user to the app.
var Signup = React.createClass({
	/**
	 * Renders the signup form with username and password fields.
	 * @return Html signup form to be rendered
	 */
	render: function() {
		return(
			<div>
				<h1>Sign Up</h1> <br/>
				<form name="signUpForm">
					<input type="text" name="username" placeholder="Username"/> <br/>
					<input type="password" name="password" placeholder="Password"/> <br/>
					<button onClick={this.handleSignup}>Sign Up</button>
				</form>
			</div>
		);
	},
	/**
	 * Submits the signup form by requesting an insert to the database.
	 * It doesn't allow duplicate usernames.
	 * @param {e} button onClick event listener
	 */
	handleSignup: function(e) {
		e.preventDefault();
		var form = document.forms.signUpForm;
		var username = form.username.value;
		var password = form.password.value;
		var user = {
			"username": username, 
			"password": password
		};	
		
		// Can't submit blank form fields
		if(username == null || username == "" ||
		password == null || password == "") {
			alert("Fill the Username and Password");
			return;
		}
		// Request the server to insert a new user
		$.ajax({
			type: 'POST', 
			url: '/api/signup', 
			contentType: 'application/json',
			data: JSON.stringify(user),
			success: function(data) {
				if(data != null) {
					// Cleaning the form fields
					form.username.value = form.password.value = "";
				} else {
					alert(form.username.value + " already exists");
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.log("(handleSignup)Callback error! ", err);
			}
		});
	}
});

module.exports = Signup;