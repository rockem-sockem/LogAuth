var React = require('react');
var $ = require('jquery');

var Login = require('./Login');
var Tabs = require('./Tabs');

// Represent the Navbar layout
var Navbar = React.createClass({
	/**
	 * Renders the tabs and login components.
	 * @return Navbar view
	 */
	render: function() {
		return(
			<div>
				<Tabs role={this.state.role} />
				<Login getRole={this.getRole} />
				<hr/>
			</div>
		);	
	},
	/**
	 * Initiates the class' state.
	 * @return {role} 
	 */
	getInitialState: function() {
		return {
			role: null
		};
	},
	
	
	/**
	 * Gets the role after a user logs in or relogs from 
	 * the child(Login) class.
	 * @param {res} the result/response after the function was 
	 * 		used in the Login class
	 */
	getRole: function(res) {
		this.setState({ role: res });
	}
});

module.exports = Navbar;