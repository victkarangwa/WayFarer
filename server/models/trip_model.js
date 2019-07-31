
import trips from './trips'


class Trip{
    constructor(){
        this.trips = trips;
    }
      getAllTrip = () =>{
        return this.trips;
      };
  

    
}

export default new Trip;