

import chai from 'chai';

import chaiHttp from 'chai-http';

import app from '../index';

import status from '../helpers/StatusCode';

import users from '../models/users';

const { expect } = chai;

chai.use(chaiHttp);

// Let's first grab the faked user info
const fname = users[0].first_name;
const lname = users[0].last_name;
const { email } = users[0];

// ############ SIGNUP TEST ############

// Test signup for the user

describe('POST sign up successful, api/v1/auth/signup', () => {
  it('should return signup successful', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(users[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.RESOURCE_CREATED);
        expect(res.body.status).to.equal('success');
        expect(res.body.data.id).to.equal(1);
        expect(res.body.data.token).to.be.a('string');
        expect(res.body.data.first_name).to.equal(fname);
        expect(res.body.data.last_name).to.equal(lname);
        expect(res.body.data.email).to.equal(email);
        done();
      });
  });
});

describe('POST email already exist, api/v1/auth/signup', () => {
  it('should return {email} already exists', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(users[0])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.statusCode).to.equal(status.REQUEST_CONFLICT);
        expect(res.body.error).to.equal(`${email} already exists`);
        done();
      });
  });
});

describe('POST sign up with short password api/v1/auth/signup', () => {
  it('should return error when user entered short password', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(users[4])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"password" length must be at least 8 characters long');
        done();
      });
  });
});

describe('POST sign up with incomplete data api/v1/auth/signup', () => {
  it('should return error when user signup details is incomplete', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(users[3])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"first_name" is required');
        done();
      });
  });
});

describe('POST sign up with invalid email api/v1/auth/signup', () => {
  it('should return error when user email is invalid', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .set('Accept', 'application/json')
      .send(users[2])
      .end((err, res) => {
        expect(res.body).to.be.an('object');
        expect(res.status).to.equal(status.BAD_REQUEST);
        expect(res.body.error).to.equal('"email" is required');
        done();
      });
  });
});


// ############ SIGNin TEST ############
