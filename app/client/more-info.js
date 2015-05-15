	//set clickable days to get different graphs
	$('.btn').each(function(index){
		$(this).click(function(){
			day = $(this).attr('id');
			if(day !== 'all'){
				d = [];
				d[0] = dayStats[day];
				//reset graph with new day
				RadarChart.draw("#chart", d, mycfg);
				interaction();
			} else {
				d = [];
				for(var eachDay in dayStats){
					d.push(dayStats[eachDay]);
					//reset graph
					RadarChart.draw("#chart", d, mycfg);
					interaction();
				}
			}
		});
	});

	//resets clickable nodes and tasks for employees to complete
	var interaction = function(){
		//
		for(var prop in maximums){
			maximums[prop].reset = true;
		}

		//function sets the popup boxes for each node
		//dayIndex parameter is to assign pop ups to correct days 
		function setPopups(dayIndex){
			$('.radar-chart-serie'+dayIndex).each(function(j, obj){
				$('#'+obj.id).click(function(z){
					event.stopPropagation();
					$(body).append('<div class="info-popup"></div>');
					$('.info-popup').html('');
					$('.info-popup').append('<h3>'+d[dayIndex][j-1].name+'</h3>');
					//get all the properties for that metric on the popup box
					for(var prop in d[dayIndex][j-1]){
						if(prop !== 'axis' && prop !== 'name'){
							var propertyName = prop[0].toUpperCase() + prop.substring(1);
							$('.info-popup').append('<p><b>'+propertyName+
							': </b>'+d[dayIndex][j-1][prop]+'</p>');
						}
					}
					//set position of popup box
					$('.info-popup').offset({top: z.pageY, left: z.pageX});
				});
				//next click closes popup
				$(document).click(function(){
					$('.info-popup').html('');
					$('.info-popup').hide();
				});
			});
		}

		for(var i = 0; i < d.length; i++){
			//create pop up with more info on click
			setPopups(i);
			//don't flash axis or set up employee tasks if showing more than one day
			if(d.length === 1){
				//flash the axis red if below threshold
				for(var j = 0; j < d[i].length; j++){
					var stat = d[i][j];
					if(stat.value/maximums[stat.axis].value < 0.25){
						maximums[stat.axis].reset = false;
						//send the id to flash it red
						flashRed(stat.axis, 'red');
						//enable click handlers to allow employees to complete tasks
						$('.employee-img').each(function(){
							var employeeId = $(this).attr('id');
							employeeTask(employeeId, stat);
						});
						
					}
				}
			}
		}

		// function to flash the axis red if below threshold
		function flashRed(id, colour){
			setTimeout(function() {
				if(colour === 'red'){
					$('#'+id).css('stroke', 'rgb(230,20,20)');
					$('#'+id).css('stroke-width', '5px');
					flashRed(id, 'grey');
				} else {
					$('#'+id).css('stroke', 'rgb(128,128,128)');
					$('#'+id).css('stroke-width', '3px');
					//flash red until employee has completed task or we move to another day
					if(!maximums[id].reset){
						flashRed(id, 'red');
					}
				}
			}, 500);
		}
		
		//click on employee picture to complete a task and send request to update value
		//lastly refresh the graph with new value and reset popups and 
		//possible tasks to be completed
		function employeeTask(employeeId, stat){
			$('#'+employeeId)
				.click(function(z){
						stat.value = maximums[stat.axis].value;
						//employee has completed task
						$(this).remove();
						//stop flashing line
						maximums[stat.axis].reset = true;

						$.ajax({
							url: '/stats/'+day,
							type: 'PUT',
							data: "value="+maximums[stat.axis].value+'&axis='+stat.axis,
							success: function(message){
								console.log(message);
							},
							error: function(status){
								console.log(status);
							}
						});
						//disable clicks as tasks complete
						$('.employee-img').each(function(){
							var employeeId = $(this).attr('id');
							$('#'+employeeId).off();
						});
						
						//reset graph
						RadarChart.draw("#chart", d, mycfg);
						interaction();
					});
		}

		//randomise array order - UNUSED
		//use: array = randomise(array); //changes existing array
		//	   var newArray = randomise(array); //array remains unaltered
		function randomise(array){
			  var replica = array;
			  var length = replica.length;
			  var newArr = [];
			  while(newArr.length < length){
				var randIndex =   Math.floor(length*Math.random());
				if(array[randIndex] !== 0){
					newArr.push(replica[randIndex]);
					replica.splice(randIndex,1,0);
				}
			  }
			  return newArr;
		}
	};
	
