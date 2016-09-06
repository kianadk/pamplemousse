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
	back: function(){
		this.setState(function(previousState){
			if(previousState.page != 1)
				return ({page: previousState.page - 1});
			else
				return ({page: previousState.page});
		});
	},
	next: function(){
		this.setState(function(previousState){
			return({page: previousState.page + 1});
		});
	},
	render: function(){
		//TODO: Add the rest of the app's UI
		return (
			<div>
				<DateTable page={this.state.page} currentDate={this.state.currentDate} back={this.back} next={this.next}/>
			</div>
		);
	}
});

var DateTable = React.createClass({
	render: function(){
		return (
			<div>
				<DateTablePage page={this.props.page} currentDate={this.props.currentDate} />
				<PageFooter page={this.props.page} back={this.props.back} next={this.props.next}/>
			</div>
		);
	} 
});

var PageFooter = React.createClass({
	render: function(){
		return (
		<div className="footer">
			<img src="prev.svg" onClick={this.props.back}/>
			<p>{this.props.page}</p>
			<img src="next.svg" onClick={this.props.next}/>
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
			dates.push(new Date(this.props.currentDate.getTime() + (i * DAY) + ((this.props.page - 1) * 7 * DAY) ) )
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
	loadData: function(){
		$.ajax({
			url: '/meals',
			dataType: 'json',
			type: 'GET',
			cache: false,
			success: function(meals){
				this.setState({meals: meals});
			}.bind(this),
			error: function(xhr, status, err){
				console.log(err);
			}.bind(this)
		});
	},
	componentDidMount: function(){
		this.loadData();
	},
	mouseEnter: function(){
		this.setState({hover: true});
	},
	mouseLeave: function(){
		this.setState({hover: false});
	},
	addMeal: function(chef, meal, date){

		//optimistically update local data
		var oldMeals = this.state.meals;
		this.setState({meals: oldMeals.concat([{chef: chef, food: meal, date: date}])});

		//update database
		$.ajax({
			url: '/meals',
			dataType: 'json',
			type: 'POST',
			data: {chef: chef, food: meal, date: date},
			success: function(meal){
				this.loadData();
				console.log("updated db successfully");
			}.bind(this),
			error: function(xhr, status, err){
				this.setState({meals: oldMeals});
				console.log("error updating db");
			}.bind(this)
		});
	},
	render: function() {
		return (
			<div className="dateRow" onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} >
				<DateTableRowHeader date={this.props.date} hover={this.state.hover} handleAdd={this.addMeal}/>
				<DateTableRowContent date={this.props.date} meals={this.state.meals} update={this.loadData}/>
			</div>
		);
	}

});

var DateTableRowHeader = React.createClass({
	render: function(){
		return (
			<div className="rowHeader">
				<DateTableRowDate date={this.props.date} />
				<DateTableRowAddButton rowHover={this.props.hover} handleAdd={this.props.handleAdd} date={this.props.date}/>
			</div>
		);
	}
});

var DateTableRowContent = React.createClass({
	render: function(){

		//figure out which of the meals in the db are today's
		var todaysMeals = [];
		for(var i = 0; i < this.props.meals.length; i++){
			var date = new Date(this.props.meals[i].date);
			if(this.props.date.toDateString() == date.toDateString())
				todaysMeals.push(this.props.meals[i]);
		}

		//TODO: Avoid repeated code
		if(todaysMeals.length == 0){
			return(
				<div className="rowContent">
					<p>No plans yet</p>
				</div>
			)
		}
		else{

			return(
				<div className="rowContent">
					{todaysMeals.map(function(value, index){
						return <MealItem key={index} chef={value.chef} food={value.food} date={value.date} id={value._id} update={this.props.update}/>
					}, this)}
				</div>
			);
		}
	}
});

var MealItem = React.createClass({
	getInitialState: function(){
		return ({hover: false, showModal: false});
	},
	mouseEnter: function(){
		this.setState({hover: true});
	},
	mouseLeave: function(){
		this.setState({hover: false});
	},
	deleteMeal: function(){
		$.ajax({
			url: '/meals',
			dataType: 'json',
			type: 'DELETE',
			data: {id: this.props.id},
			success: function(meal){
				console.log("deleted meal successfully");
			}.bind(this),
			error: function(xhr, status, err){
				console.log("error deleting meal");
			}
		});
		this.props.update();
	},
	editMeal: function(){
		this.setState({showModal: true});
	},
	cancel: function(){
		this.setState({showModal: false});
	},
	handleEdit: function(chef, food, id){
		console.log("handling edit");
		var editURL = '/meals/' + id;
		$.ajax({
			url: editURL,
			dataType: 'json',
			type: 'PUT',
			cache: false,
			data: {chef: chef, food: food},
			success: function(){
				console.log("handled edit successfully");
			}.bind(this),
			error: function(){
				console.log("error handling edit");
			}
		});
		this.props.update();
		this.setState({showModal: false});
	},
	render: function(){
		var date = new Date(this.props.date);
		var buttonClass = "noShow";
		if(this.state.hover)
			buttonClass = "delete";
		return (
			<div onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseLeave} className="mealItem">
				<p>{this.props.chef} is making {this.props.food}</p>
				<img className={buttonClass} src="delete.svg" onClick={this.deleteMeal}/>
				<img className={buttonClass} src="edit.svg" onClick={this.editMeal}/>
				<Modal show={this.state.showModal} onHide={this.cancel} >
					<EditMealDialog save={this.handleEdit} cancel={this.cancel} date={this.props.date} id={this.props.id}/>
				</Modal>
			</div>
		);
	}
});

var EditMealDialog = React.createClass({
	getInitialState: function(){
		return {chef: "", meal: ""};
	},
	componentDidMount: function(){
		this.loadData();
	},
	loadData: function(){
		//TODO: Load data with AJAX code
		var mealURL = '/meals/' + this.props.id;
		console.log("sending request to url: " + mealURL);
		$.ajax({
			url: mealURL,
			dataType: 'json',
			type: 'GET',
			cache: false,
			success: function(meal){
				console.log("got meal data: " + meal.chef + " and " + meal.food);
				this.setState({chef: meal.chef, meal: meal.food});
			}.bind(this),
			error: function(){
				console.log("error getting meal data");
			}
		});
	},
	updateChef: function(e){
		this.setState({chef: e.target.value});
	},
	updateMeal: function(e){
		this.setState({meal: e.target.value});
	},
	render: function(){
		return(
			<div>
				<Modal.Header closeButton>
					<Modal.Title>Edit meal</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FormGroup controlId="chef">
						<ControlLabel>Chef Name</ControlLabel>
						<FormControl
							type="text"
							value={this.state.chef}
							placeholder="Who are you?!"
							onChange={this.updateChef}
						/>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Whatcha cookin&#39;?</ControlLabel>
						<FormControl
							type="text"
							value={this.state.meal}
							placeholder="What's the dish called?"
							onChange={this.updateMeal}
						/>
					</FormGroup>
					<Button onClick={this.props.save.bind(null, this.state.chef, this.state.meal, this.props.id)}>
						Save
					</Button>
					<Button onClick={this.props.cancel}>
						Cancel
					</Button>
				</Modal.Body>
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
	save: function(chef, food, date){
		this.props.handleAdd(chef, food, date);
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
					<AddMealDialog save={this.save} cancel={this.cancel} date={this.props.date}/>
				</Modal>
			</div>
		);	
	}
});

var AddMealDialog = React.createClass({
	getInitialState: function(){
		return {chef: "", meal: ""};
	},
	updateChef: function(e){
		this.setState({chef: e.target.value});
	},
	updateMeal: function(e){
		this.setState({meal: e.target.value});
	},
	render: function(){
		return(
			<div>
				<Modal.Header closeButton>
					<Modal.Title>Add meal</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<FormGroup controlId="chef">
						<ControlLabel>Chef Name</ControlLabel>
						<FormControl
							type="text"
							value={this.state.value}
							placeholder="Who are you?!"
							onChange={this.updateChef}
						/>
					</FormGroup>
					<FormGroup>
						<ControlLabel>Whatcha cookin&#39;?</ControlLabel>
						<FormControl
							type="text"
							placeholder="What's the dish called?"
							onChange={this.updateMeal}
						/>
					</FormGroup>
					<Button onClick={this.props.save.bind(null, this.state.chef, this.state.meal, this.props.date)}>
						Save
					</Button>
					<Button onClick={this.props.cancel}>
						Cancel
					</Button>
				</Modal.Body>
			</div>
		);
	}
});





ReactDOM.render(
	<App />,
	document.getElementById('days')
);