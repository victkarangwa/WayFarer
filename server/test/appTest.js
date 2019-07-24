

import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import status from '../constants/StatusCode';

const { expect } = chai;

chai.use(chaiHttp);

// Test for get all trips
describe('/GET Trips', () => {
  it('It should GET all trips', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .set('accept', 'application/json')
      .end((err, res) => {
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        expect(res.body).to.be.an('array');


        done();
      });
  });
});

// Test for get bookings
// describe('GET Bookings', () => {
//   it('it should get all bookings made by users', (done) => {
//     chai.request(app)
//       .get('/api/v1/bookings')
//       .end((err, res) => {
//         res.body.should.have.status(200);
//         res.body.should.be.a('array');
//         // Add other sp

//         done();
//       });
//   });
// });
