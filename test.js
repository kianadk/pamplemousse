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
		//TODO: Display DateTableRowContent
		return (
			<div className="dateRow" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} >
				<DateTableRowHeader date={this.props.date} hover={this.state.hover}  />
			</div>
		);
	}

});

var DateTableRowHeader = React.createClass({
	render: function(){
		return (
			<div>
				<DateTableRowDate date={this.props.date} />
				<DateTableRowAddButton rowHover={this.props.hover} />
			</div>
		);
	}
});

var DateTableRowDate = React.createClass({
	render: function(){
		return (<p>{this.props.date.toDateString()}</p>);
	}
});

var DateTableRowAddButton = React.createClass({
	add: function(){
		console.log("hello");
	},
	render: function(){
		if(this.props.rowHover){
			return (<img className="add" src="greyPlus.svg" onClick={this.add} />);
		}
		 else{
		 	return null;
		 }
	}
});





ReactDOM.render(
	<App />,
	document.getElementById('days')
);