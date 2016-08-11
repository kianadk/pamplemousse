var Row = React.createClass({
	render: function() {
		return (
			<p>
				{this.props.date.toDateString()}
			</p>
		);
	}
});

var Page = React.createClass({
	render: function(){
		const DAY = 86400000
		var dates = []
		var i;
		for(i = 0; i < 10; i++){
			dates.push(new Date(this.props.currentDate.getTime() + (i * DAY) ) )
		}

		return (
			<div>
				{dates.map(function(value, index){
					return <Row key={index} date={value} />
				})}
			</div>
		)
	}
});

var greeting = <h1>Hello, world!</h1>;

ReactDOM.render(
	greeting,
	document.getElementById('example')
);

ReactDOM.render(
	<Page currentDate={new Date()} />,
	document.getElementById('days')
);

// ReactDOM.render(
// 	<Row date={new Date()} />,
// 	document.getElementById('days')
// );