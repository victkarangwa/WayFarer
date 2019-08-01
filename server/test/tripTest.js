import jwt from 'jsonwebtoken';

import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import trip from '../models/trips';

import status from '../helpers/StatusCode';

const { expect } = chai;

chai.use(chaiHttp);


// ############ trip TEST ############
// Create a token for testing
const token = jwt.sign({ id: 7, is_admin: true }, 'secretKey');

// Test to View all trips

describe('POST Both Admin and Users can see all trips, api/v1/trips', () => {
  it('should return all trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.body.data[0].trip_id).to.equal(1);
        expect(res.body.data[0].origin).to.equal('Kigali');
        expect(res.body.data[0].seating_capacity).to.equal(45);
        expect(res.body.data[0].status).to.equal('active');
        expect(res.status).to.equal(status.REQUEST_SUCCEDED);
        // expect(res.body.data.token).to.be.a('string');
        done();
      });
  });
});

// Test to create a new trip

describe('POST Admin can create a trip, api/v1/trips', () => {
  it('should create a new trip successfully', (done) => {
    chai.request(app)
      .post('/api/v1/trips')
      .set('x-auth-token', token)
      .set('Accept', 'application/json')
      .send(trip[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal('success');
        expect(res.status).to.equal(status.RESOURCE_CREATED);
        // expect(res.body.data.token).to.be.a('string');
        done();
      });
  });
});
