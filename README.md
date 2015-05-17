# datavis

#### to run project

	npm install
	bower install

#### to start run
	node app.js

#### open

	localhost:8080

#### Info

Data visualisation radar chart displaying office metrics. Click on day of the week to see metrics for that day or 'All' to see 5 days on top of each other. To get more info on any metric for a given day click on the node circle for that point.

If a metric is particularly low then the axis flashes red showing that it is low. Click on an employee to complete the task and the metric will be updated with the maximum for that category, e.g. if drinks aleft in the fridge are low then you can click on someone who will 'fill the fridge with drinks'. Obviously, in some categories like the temperature ones this doesn't make practical sense but it works for the demonstration.

##### Technical

I have setup a node and express API with endpoints which are to retrieve some employee data and office data as well as 'put' requests which update values if an employee completes a task.

This small app utilises d3's data visualistion library and jquery for events.