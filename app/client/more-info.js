	var interaction = function(){

		for(var i = 0; i < d.length; i++){
			//create pop up with more info on click
			$('.radar-chart-serie'+i).each(function(j, obj){
				$('#'+obj.id).click(function(z){
					console.log(z);
					event.stopPropagation();
					$(body).append('<div class="info-popup"></div>');
					$('.info-popup').html('');
					$('.info-popup').append('<h3>'+d[0][j-1].name+'</h3>');
					//get all the properties for that metric on the popup box
					for(var prop in d[0][j-1]){
						if(prop !== 'axis' && prop !== 'name'){
							var propertyName = prop[0].toUpperCase() + prop.substring(1);
							$('.info-popup').append('<p><b>'+propertyName+
							': </b>'+d[0][j-1][prop]+'</p>');
						}
					}
					//set position of popup box
					$('.info-popup').offset({top: z.pageY, left: z.pageX});
				});
				$(document).click(function(){
					$('.info-popup').html('');
					$('.info-popup').hide();
				});
			});
			function flashRed(id, colour){
				setTimeout(function() {
					if(colour === 'red'){
						$('#'+id).css('stroke', 'rgb(230,20,20)');
						$('#'+id).css('stroke-width', '5px');
						flashRed(id, 'grey');
					} else {
						$('#'+id).css('stroke', 'rgb(128,128,128)');
						$('#'+id).css('stroke-width', '3px');
						flashRed(id, 'red');
					}
				}, 500);
			}
			//flash the axis red if below threshold
			for(var j = 0; j < d[i].length; j++){
				if(d[i][j].value < 0.25){
					flashRed(d[i][j].axis, 'red');
				}
			}
			
		}
		
		function randomise(array){
			  var length = array.length;
			  var newArr = [];
			  while(newArr.length < length){
				var randIndex =   Math.floor(length*Math.random());
				if(array[randIndex] !== 0){
					newArr.push(array[randIndex]);
					array.splice(randIndex,1,0);
				}
			  }
			  return newArr;
		}
	};
	
