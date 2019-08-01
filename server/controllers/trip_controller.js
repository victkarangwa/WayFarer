import Joi from 'joi';
import Trip from '../models/trip_model';
import lodash from 'lodash';
class TripController{

    findAllTrip = (req,res) =>{
      const trips = Trip.getAllTrip();
      if(trips.length === 0){
        return res.status(200).send({'status': 'success','data':'No trips yet!' });
      }
      return res.status(200).send({'status': 'success','data':trips});
    };

    
}

export default TripController;