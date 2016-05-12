var React = require('react');
var Link = require('react-router').Link;

// Represents the tabs in the navbar
var Tabs = React.createClass({
	/**
	 * Renders the tabs in the navbar.
	 * @return tab view
	 */
	render: function() {
		var homeTab = (this.state.showHome) ? 
			<button onClick={this.navigate}>Home</button>
			: "";
		var welcomeTab = (this.state.showWelcome) ?
			<Link to="/welcome"><button>Welcome</button></Link>
			: "";
		var contentTab = (this.state.showContent) ?
			<Link to="/content"><button>Content</button></Link>
			: "";
			
		return(
			<span>
				{homeTab}
				{welcomeTab}
				{contentTab}
			</span>
		);	
	},
	/**
	 * Initiates the classes' states 
	 */
	getInitialState: function() {
		return {
			showHome: true,
			showWelcome: false,
			showContent: false
		};
	},	
	/**
	 * Needed to use context.router for redirection in router.
	 */
	contextTypes: {
		router: React.PropTypes.object.isRequired
	},
	/**
	 * After the role is received from the login, it will 
	 * display the tabs according to the roles.
	 */
	componentWillReceiveProps: function() {
		this.setTab();
	},
	
	/**
	 * When the home button is clicked, redirect to the home page.
	 * @param {e} button onClick event listener
	 */
	navigate: function(e) {
		e.preventDefault();
		this.context.router.push('/');
	},
	/**
	 * Changes the state of which tabs to display depending on 
	 * user role. 
	 */
	setTab: function() {
		switch(this.props.role) {
			case "admin":
				this.setState({
					showHome: false,
					showWelcome: true,
					showContent: true
				});
				break;
			case "user":
				this.setState({
					showHome: false,
					showWelcome: true,
					showContent: false
				});
				break;
			default:
				this.setState({
					showHome: true,
					showWelcome: false,
					showContent: false
				});
		}
	}
});

module.exports = Tabs;