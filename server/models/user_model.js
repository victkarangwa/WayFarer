import jwt from 'jsonwebtoken';
import _ from 'lodash';

class User{
    constructor(){
        this.users = [];
    }

    create = (payload) =>{
        const currentId = this.users.length + 1;
    
      let newUser = {  
      token: this.generateAuthToken(currentId,payload.is_admin), 
      id: currentId,
      first_name: payload.first_name ,
      last_name: payload.last_name, 
      email: payload.email,
      password: payload.password,
      is_admin:payload.is_admin
    };
     this.users.push(newUser);
     newUser = {'status':'success',
     'data': _.pick(newUser,['token','id',
     'first_name','last_name','email'])};
     
    return newUser;
    };

    isEmailTaken = email => {
        return this.users.find(u => u.email === email);
    };
 
    generateAuthToken = (id,admin)=>{
        const token  = jwt.sign({id: id,is_admin:admin},'secretKey');
        return token;
     };

}

export default new User;