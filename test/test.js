///
// TEST.JS
///


process.env.NODE_ENV = 'test';

//Depedencies
var chai 		= require('chai');
var chaiHttp 	= require('chai-http');
var server 		= require('../server');
var should 		= chai.should();

chai.use(chaiHttp);


describe('Jobs', () => {
 /*
  * Test the /POST job route
  */
  describe('/POST job', () => {
      it('it should POST a job', (done) => {
        let job = {
            url: "https://www.google.com"
        }
        chai.request(server)
            .post('/job')
            .send(job)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.job.should.have.property('url');
                console.log(res.body);
                done();
            });
      });

  });

  /*
  * Test the /GET/:id job route
  */
  describe('/GET/:id job', () => {
      it('it should GET a job by the given id', (done) => {
            chai.request(server)
            .get('/job/597aac991256ed7295e93e41')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('_id').eql("597aac991256ed7295e93e41");
                console.log(res.body);
                done();
            });

      });
	})
});