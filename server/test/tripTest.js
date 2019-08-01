import jwt from 'jsonwebtoken';

import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import status from '../helpers/StatusCode';

const { expect } = chai;

chai.use(chaiHttp);


// ############ trip TEST ############
// Create a token for testing
const token = jwt.sign({ id: 7, is_admin: true }, 'secretKey');

// Test signup for the user

describe('POST Both Admin and Users can see all trips, api/v1/trips', () => {
  it('should return all trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.body.data.trip_id).to.equal(1);
        expect(res.body.data.origin).to.equal('Kigali');
        expect(res.body.data.seating_capacity).to.equal(45);
        expect(res.body.data.status).to.equal('active');
        expect(res.status).to.equal(200);
        // expect(res.body.data.token).to.be.a('string');
        done();
      });
  });
});
