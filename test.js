var Modal = ReactBootstrap.Modal;
var Button = ReactBootstrap.Button;
var FormGroup = ReactBootstrap.FormGroup;
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;

var App = React.createClass({
	getInitialState: function(){
		return {
			page: 1, 
			currentDate: new Date()
		};
	},
	render: function(){
		//TODO: Add the rest of the app's UI
		return (
			<div>
				<DateTable page={this.state.page} currentDate={this.state.currentDate} />
			</div>
		);
	}
});

var DateTable = React.createClass({
	render: function(){
		//TODO: Make the page number pretty
		return (
			<div>
				<DateTablePage page={this.props.page} currentDate={this.props.currentDate} />
				<p>{this.props.page}</p>
			</div>
		);
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
					return <DateTableRow key={index} date={value}/>
				})}
			</div>
		)
	}
});

var DateTableRow = React.createClass({
	getInitialState: function(){
		return ({hover: false, meals: []});
	},
	mouseEnter: function(){
		this.setState(function(previousState, currentProps){
			return {hover: true, meals: previousState.meals};
		});
	},
	mouseLeave: function(){
		this.setState(function(previousState, currentProps){
			return {hover: false, meals: previousState.meals};
		});
	},
	addMeal: function(){
		console.log("adding a meal");
		this.setState(function(previousState, currentProps){
			console.log("setting state of meals array...");
			previousState.meals.push("hi");
			return {hover: previousState.hover, meals: previousState.meals};
		});
	},
	render: function() {
		var meals = this.state.meals.map(function(value, index){
			return (<p key={index}>{value}</p>);
		});
		return (
			<div className="dateRow" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} >
				<DateTableRowHeader date={this.props.date} hover={this.state.hover} handleAdd={this.addMeal}/>
				<DateTableRowContent meals={meals}/>
			</div>
		);
	}

});

var DateTableRowHeader = React.createClass({
	render: function(){
		return (
			<div className="rowHeader">
				<DateTableRowDate date={this.props.date} />
				<DateTableRowAddButton rowHover={this.props.hover} handleAdd={this.props.handleAdd} />
			</div>
		);
	}
});

var DateTableRowContent = React.createClass({
	render: function(){
		//TODO: Avoid repeated code
		if(this.props.meals.length == 0){
			return(
				<div className="rowContent">
					<p>No plans yet</p>
				</div>
			)
		}
		else{
			return(
					<div className="rowContent">
					{this.props.meals}
					</div>
			);
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
	save: function(){
		this.props.handleAdd();
		this.cancel();
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
					<Modal.Header closeButton>
						<Modal.Title>Add meal</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<FormGroup
							controlId="chef"
						>
							<ControlLabel>Chef Name</ControlLabel>
							<FormControl
								type="text"
								placeholder="Who are you?!"
							/>
						</FormGroup>
						<FormGroup>
							<ControlLabel>Whatcha cookin&#39;?</ControlLabel>
							<FormControl
								type="text"
								placeholder="What's the dish called?"
							/>
						</FormGroup>
						<Button onClick={this.save}>
							Save
						</Button>
						<Button onClick={this.cancel}>
							Cancel
						</Button>
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