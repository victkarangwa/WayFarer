import express from 'express';
import faker from 'faker';
import users from './users';

const app = express();

app.use('/api/v1/users', users);
const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log('Job: ', faker.name.firstName);
});

export default app;
