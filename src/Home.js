var React = require('react');

var Signup = require('./Signup');

// Home page class
var Home = React.createClass({
	render: function() {
		return( 
			<div>
				<h1>Welcome to MyApp</h1>
				<p>Not registered?</p>
				<Signup />
			</div>
		);
	}
});

module.exports = Home;