var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;

var App = React.createClass({
	getInitialState: function(){
		return {
			page: 1, 
			currentDate: new Date()
		};
	},
	render: function(){
		//TODO: Add the rest of the app's UI
		return (<DateTable page={this.state.page} currentDate={this.state.currentDate} />);
	}
});

var DateTable = React.createClass({
	render: function(){
		return (<DateTablePage page={this.props.page} currentDate={this.props.currentDate} />)
	} 
});

var DateTablePage = React.createClass({
	render: function(){
		const DAY = 86400000
		var dates = []
		var i
		for(i = 0; i < 7; i++){
			dates.push(new Date(this.props.currentDate.getTime() + (i * DAY) ) )
		}

		return (
			<div>
				{dates.map(function(value, index){
					return <DateTableRow key={index} date={value} />
				})}
			</div>
		)
	}
});

var DateTableRow = React.createClass({
	getInitialState: function(){
		return ({hover: false});
	},
	mouseEnter: function(){
		this.setState({hover: true});
	},
	mouseLeave: function(){
		this.setState({hover: false});
	},
	render: function() {
		return (
			<div className="dateRow" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} >
				<DateTableRowHeader date={this.props.date} hover={this.state.hover} />
				<DateTableRowContent />
			</div>
		);
	}

});

var DateTableRowHeader = React.createClass({
	render: function(){
		return (
			<div className="rowHeader">
				<DateTableRowDate date={this.props.date} />
				<DateTableRowAddButton rowHover={this.props.hover} />
			</div>
		);
	}
});

var DateTableRowContent = React.createClass({
	getInitialState: function(){
		return ({entries: 0});
	},
	render: function(){
		//TODO: Avoid repeated code
		if(this.state.entries == 0){
			return(
				<div className="rowContent">
					<p>No plans yet</p>
				</div>
			)
		}
		else{
			return(
				<div className="rowContent">
					<p>There are hella plans</p>
				</div>
			)
		}
	}
});

var DateTableRowDate = React.createClass({
	render: function(){
		return (<p>{this.props.date.toDateString()}</p>);
	}
});

var DateTableRowAddButton = React.createClass({
	getInitialState: function(){
		return ({hover: false, showModal: false});
	},
	add: function(){
		this.setState(function(previousState, currentProps){
			return ({hover: previousState.hover, showModal: true});
		});
	},
	cancel: function(){
		this.setState(function(previousState, currentProps){
			return {hover: previousState.hover, showModal: false};
		});
	},
	mouseEnter: function(){
		this.setState(function(previousState, currentProps){
			return {hover: true, showModal: previousState.showModal};
		});
	},
	mouseLeave: function(){
		this.setState(function(previousState, currentProps){
			return {hover: false, showModal: previousState.showModal};
		});
	},
	render: function(){
		var buttonClass = "noShow";
		if(this.props.rowHover){
			buttonClass = "add";
		}
		var plus = "greyPlus.svg";
		if(this.state.hover){
			plus = "selectedPlus.svg";
		}

		return (
			<div className={buttonClass}>
				<img src={plus} onClick={this.add} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} />
				<Modal show={this.state.showModal} onHide={this.cancel} >
					<Modal.Body>
						<p>
							heyyyyy
						</p>
					</Modal.Body>
				</Modal>
			</div>
		);	
	}
});





ReactDOM.render(
	<App />,
	document.getElementById('days')
);