//test node and express backend services
describe('API calls', function(){
		it('should get correct employee data', function(){
			expect(employees[3].name).toEqual("Simon");
		});

		it('should get stats', function(){
			expect(dayStats.monday[0].axis).toEqual("totalVisitors");
		});
});

describe('test config', function(){
		it('maximums should be set to true', function{
			for(var prop in maximums){
				expect(maximums[prop].reset).toBeTruthy();
			}
		})
});