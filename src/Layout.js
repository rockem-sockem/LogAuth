var React = require('react');

var Navbar = require('./navbar/Navbar');

// Main Layout class of the website
var Layout = React.createClass({
	render: function() {
		return( 
			<div>
				<Navbar />
				<h1>Title</h1>
				{this.props.children}
			</div>
		);
	}
});

module.exports = Layout;