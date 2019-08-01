import express from 'express';
import bodyParse from 'body-parser';
import path from 'path';
import config from './config/default';
import userRoute from './routes/user_route';
import tripRoute from './routes/trip_route';

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../app.json');

const app = express();
app.use(bodyParse.json());
// Custom path: For signin and signup endpoints
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/v1/auth', userRoute);

// Custom path: Trip endpoints
app.use('/api/v1/trips', tripRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// check if JWT secret is set
// to avoid app crash
// if (!config.get('jwtSecret')) {
// console.log('FATAL ERROR: jwtSecret is not set! FIX run without quotes: \'set wayfarer_jwtSecret=yourSecureKeyhere!\'');
// process.exit(1);
// }
const { port } = config;
app.listen(port, () => console.log(`Listening on port ${port}...`));

export default app;
