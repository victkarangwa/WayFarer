// import jwt from 'jsonwebtoken';

// import chai from 'chai';

// import chaiHttp from 'chai-http';

// import app from '../index';

// import booking from '../models/bookings';

// import status from '../helpers/StatusCode';

// const { expect } = chai;

// chai.use(chaiHttp);


// // ############ trip TEST ############
// // Create a true token for testing
// const token = jwt.sign({ id: 1, is_admin: true }, 'secretKey');
// const token0 = jwt.sign({ id: 1, is_admin: false }, 'secretKey');

// // Create a false token for testing
// const NonUsertoken = jwt.sign({ id: 0, is_admin: true }, 'secretKey');

// describe('POST User can book a seat, api/v2/booking', () => {
//   it('should create a booking successfully', (done) => {
//     chai.request(app)
//       .post('/api/v2/bookings')
//       .send(booking[0])
//       .set('x-auth-token', token)
//       .set('Accept', 'application/json')
//       .end((err, res) => {
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal(status.RESOURCE_CREATED);
//         expect(res.status).to.equal(status.RESOURCE_CREATED);
//         // expect(res.body.data.token).to.be.a('string');
//         done();
//       });
//   });
// });

// describe('POST User tries to book unavailable trip', () => {
//   it('should return an error', (done) => {
//     chai.request(app)
//       .post('/api/v2/bookings')
//       .send(booking[1])
//       .set('x-auth-token', token)
//       .set('Accept', 'application/json')
//       .end((err, res) => {
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal(status.NOT_FOUND);
//         expect(res.body.error).to.equal('The Trip you are trying to book is not found!');
//         expect(res.status).to.equal(status.NOT_FOUND);
//         // expect(res.body.data.token).to.be.a('string');
//         done();
//       });
//   });
// });

// describe('POST User book without access', () => {
//   it('should return an error', (done) => {
//     chai.request(app)
//       .post('/api/v2/bookings')
//       .send(booking[1])
//       .set('x-auth-token', NonUsertoken)
//       .set('Accept', 'application/json')
//       .end((err, res) => {
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal(status.NOT_FOUND);
//         expect(res.body.error).to.equal('The User associated with this token doesn\'t exist.');
//         expect(res.status).to.equal(status.NOT_FOUND);
//         // expect(res.body.data.token).to.be.a('string');
//         done();
//       });
//   });
// });


// describe('POST User book without choosing trip', () => {
//   it('should return an error', (done) => {
//     chai.request(app)
//       .post('/api/v2/bookings')
//       // .send(booking[1])
//       .set('x-auth-token', token)
//       .set('Accept', 'application/json')
//       .end((err, res) => {
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal(status.BAD_REQUEST);
//         expect(res.body.error).to.equal('"trip_id" is required');
//         expect(res.status).to.equal(status.BAD_REQUEST);
//         // expect(res.body.data.token).to.be.a('string');
//         done();
//       });
//   });
// });

// describe('DELETE User delete a booking', () => {
//   it('should delete a booking successfully', (done) => {
//     chai.request(app)
//       .delete('/api/v2/bookings/1')
//       .set('x-auth-token', token)
//       .set('Accept', 'application/json')
//       .end((err, res) => {
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
//         expect(res.body.data.message).to.equal('Booking deleted successfully');
//         expect(res.status).to.equal(status.REQUEST_SUCCEDED);
//         // expect(res.body.data.token).to.be.a('string');
//         done();
//       });
//   });
// });

// describe('DELETE User delete a booking without access', () => {
//   it('should return an error', (done) => {
//     chai.request(app)
//       .delete('/api/v2/bookings/1')
//       .set('x-auth-token', NonUsertoken)
//       .set('Accept', 'application/json')
//       .end((err, res) => {
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal(status.NOT_FOUND);
//         expect(res.body.error).to.equal('The User associated with this token doesn\'t exist.');
//         // expect(res.body.data.token).to.be.a('string');
//         done();
//       });
//   });
// });

// describe('GET User view all booking', () => {
//   it('should return all user bookings', (done) => {
//     chai.request(app)
//       .get('/api/v2/bookings')
//       .set('x-auth-token', token0)
//       .set('Accept', 'application/json')
//       .end((err, res) => {
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
//         expect(res.status).to.equal(status.REQUEST_SUCCEDED);
//         // expect(res.body.data.token).to.be.a('string');
//         done();
//       });
//   });
// });

// describe('GET User view all booking', () => {
//   it('should return all user bookings', (done) => {
//     chai.request(app)
//       .get('/api/v2/bookings')
//       .set('x-auth-token', token)
//       .set('Accept', 'application/json')
//       .end((err, res) => {
//         expect(res.body).to.be.an('object');
//         expect(res.body.status).to.equal(status.REQUEST_SUCCEDED);
//         expect(res.status).to.equal(status.REQUEST_SUCCEDED);
//         // expect(res.body.data.token).to.be.a('string');
//         done();
//       });
//   });
// });
