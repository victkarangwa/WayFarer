import faker from 'faker';

const faker_mail = faker.internet.email();
const faker_password = faker.internet.password(8, true);
const users = [

  // ############# Signup users ################

  // 0 Correct user info
  {
    email: faker_mail,
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker_password,
  },

  // 1 Correct user info
  {
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(8, true),
  },

  // 2 User with invalid email
  {
    email: faker.name.lastName,
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(8, true),
  },

  // 3 User with incomplete info
  {
    email: faker.internet.email(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(8, true),
  },

  // 4 User with incomplte password
  {
    email: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    password: faker.internet.password(3, true),
  },


  // ############# Signin users ################
  // 5 Correct registered credentials
  {
    email: faker_mail,
    password: faker_password,
  },
  // 6 Incorrect password
  {
    email: faker_mail,
    password: 'faker_password',
  },
  // 7 email missing
  {
    password: faker_password,
  },
  // 8 Password missing
  {
    email: faker_mail,
  },

  // 9 Invalid email
  {
    email: `${faker_mail}@gmail`,
    password: faker_password,
  },
  // 10 first name with whitespace
  {
    first_name: ' ',
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    password: faker_password,
  },
  // 11 last name with whitespace
  {
    first_name: faker.name.lastName(),
    last_name: ' ',
    email: faker.internet.email(),
    password: faker_password,
  },
  // 12 password with whitespace
  {
    first_name: faker.name.lastName(),
    last_name: ' ',
    email: faker.internet.email(),
    password: faker_password,
  },
];
export default users;
