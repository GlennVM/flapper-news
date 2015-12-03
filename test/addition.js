'use strict';

describe('addition', function () {
 it('should add 1+1 correctly', function (done) {
   var onePlusOne = 1 + 1;
   onePlusOne.should.equal(2);
   // must call done() so that mocha know that we are... done.
   // Useful for async tests.
   done();
 });

 it('should add 2+2 correctly', function(done){
 		var twoPlusTwo = 2+2;
 		twoPlusTwo.should.equal(4);
 		done();
 });
});
