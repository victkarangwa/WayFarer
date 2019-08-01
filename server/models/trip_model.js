
import jwt from 'jsonwebtoken';
import trips from './trips';


class Trip {
  constructor() {
    this.trips = [{
      trip_id: 1,
      owner: 1,
      bus_license_number: 'RAC 236 S',
      origin: 'Kigali', // starting location
      destination: 'Rubavu',
      seating_capacity: 45,
      trip_date: Date(),
      fare: 3500,
      status: 'active',
      createdOn: Date(),
    },

    ];
  }

    create = (res, data, token) => {
      const newId = this.trips.length + 1;

      let newTrip = {
        trip_id: newId,
        owner: this.getUserId(res, token),
        status: data.status,
        seating_capacity: data.seating_capacity,
        bus_license_number: data.bus_license_number,
        origin: data.origin,
        destination: data.destination,
        trip_date: data.trip_date,
        fare: data.fare,
        createdOn: Date(),
      };
      this.trips.push(newTrip);
      newTrip = { status: 'success', data: newTrip };

      return newTrip;
    };

   getUserId = (res, token) => {
     // decode token for the sake of picking user_id
     // to use in setting trip owner.
     try {
       const decoded = jwt.verify(token, 'secretKey');
       return decoded.id;
     } catch (error) {
       return res.status(400).send({ status: 'error', error: error.message });
     }
   };

   // checks if atrip is currently available in trips[]
      isTripExist = trip_id => this.trips.find(trip => trip.trip_id === parseInt(String, trip_id));

      getAllTrip = () => this.trips;
}

export default new Trip();
