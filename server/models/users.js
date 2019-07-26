import faker from 'faker';

const users = [

  {
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(8, true),
  },
  {
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(8, true),
  },

  // User with invalid email
  {
    email: faker.name.lastName,
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(8, true),
  },

  // User with incomplete info
  {
    email: faker.internet.email(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(8, true),
  },

  // User with incomplte password
  {
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(3, true),
  },

];

export default users;
