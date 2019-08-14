import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();
const pool = new Pool({ connectionString: process.env.DB_URL });

pool.on('error', (err) => {
  console.log(err);
});

const createTables = pool.query(`DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    user_id SERIAL NOT NULL PRIMARY KEY,
	first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
	email VARCHAR NOT NULL,
	password VARCHAR NOT NULL,
	is_admin BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO users (
     first_name, last_name, email, password, is_admin
    ) VALUES (
         'Vicky',
         'Boffin',
        'vickyboffin@gmail.com',
        '$2b$10$9DhD.e2mZV/Nma8SEOk.g.F9IJJ17N7IICSeYB8ACrUxXQB20lMjG',
        true
);

DROP TABLE IF EXISTS trips CASCADE;
CREATE TABLE trips(
    trip_id SERIAL NOT NULL PRIMARY KEY,
    bus_license_number VARCHAR NOT NULL,
	origin VARCHAR NOT NULL,
    destination VARCHAR NOT NULL,
    seating_capacity INTEGER NOT NULL,
    seating_available INTEGER NOT NULL,
	trip_date VARCHAR NOT NULL,
	fare FLOAT(2) NOT NULL,
    status VARCHAR DEFAULT 'active',
    created_on VARCHAR NOT NULL
); 
INSERT INTO trips (bus_license_number, origin, destination, seating_capacity, seating_available, trip_date, fare, status, created_on )
   VALUES (
       'RAC 256 V',
       'Kenya',
       'Burundi',
        40,
        40,
       '11082019',
       80000,
       'active',
        '11082019'
       
);

DROP TABLE IF EXISTS bookings CASCADE;
CREATE TABLE bookings(
    booking_id  SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
	trip_id INTEGER NOT NULL,
    bus_license_number VARCHAR NOT NULL,
    trip_date VARCHAR NOT NULL,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE cascade,
    FOREIGN KEY (trip_id) REFERENCES trips(trip_id) ON DELETE cascade
); 
INSERT INTO bookings (user_id, trip_id, bus_license_number, trip_date, first_name, last_name, email )
   VALUES (
       1,
       1,
       'RAC 256 V',
       '11082019',
       'Vicky',
       'Boffin',
       'vickyboffin@gmail.com'
);

`);

export default createTables;
