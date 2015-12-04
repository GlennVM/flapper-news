var expect = require("chai").expect;
var app = require("../app");
var request = require('supertest');
var agent = request.agent(app);

describe("Init", function() {
    it("starts a new testing env", function(done) {
        expect("test").to.equal("test");
        done();
    });
});

describe("GET /posts", function() {
    it('should respond with 200 in case of valid request', function() {
        agent.get('/posts')
            .send()
            .end(function(err, res) {
                if(err) {return done(err);}
                var fetchedData = JSON.parse(res.text);
                expect(fetchedData).to.be.an('array');
                expect(fetchedData).to.not.empty;

                var post = fetchedData[0];

                if(post) {
                    expect(post).to.have.all.keys("__v","_id","comments","upvotes");
                    expect(post.comments).to.be.an('array');
                    expect(post.upvotes).to.be.a('number');
                }
                done();
            });
    });
});


describe('true', function(){
	it('should be true', function(done){
		var val = true;
		val.should.equal(true);
		done();
	});
});

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
