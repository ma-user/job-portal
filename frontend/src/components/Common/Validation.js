import validator from 'validator';


class ValidateFields {
  
  validateEmail(email) {
    var check1=!validator.isEmpty(email);
    var check2=!validator.isEmail(email);
    if (!check1) {
      return 'Email is required';
    } else if (check2) {
      return 'Invalid Email';
    }
    else
       return false;
  }

  validateUsername(username) {
    var check1=validator.isEmpty(username)
    if (!check1) {
      return false;
      
    } 
    else
      return 'This field is required';
  }

  validateNumber(para) {
    var type=typeof para
    if(type !== 'string')
      para=para.toString();
    if(!/^\d+$/.test(para)){
      return 'Value must be an integer';
    }
    else if("0">para){
      return 'Value must be positive'
    }
    else
    return false;
  }

  validatePassword(password) {
    var check1=validator.isEmpty(password)
    var check2=!validator.isLength(password, { min: 6 })
    if (check1) {
      return 'Password is required';
    } else if (check2) {
      return 'Password should be minimum 6 characters';
    }
    else
    return false;
  }

  validateBigDate(temp) {
   
    var para=temp.replace(/^\s+|\s+$/gm,'');
    
    var check0=para.length===16
    var split=para.split('-');
    
    var check1=/^\d+$/.test(split[0])
     check1= check1&&split[0].length===4;
     check1= check1&&split[0]>2000;

    var check2=/^\d+$/.test(split[1]);
     check2= check2&&split[1].length===2;
    check2= check2&&split[1]<13&&split[1]>0

    var check3=/^\d+$/.test(split[2]);
    check3= check3&&split[2].length===2;
   check3= check3&&split[2]<32&&split[2]>0;

   var check4=/^\d+$/.test(split[3]);
    check4= check4&&split[3].length===2;
   check4= check4&&split[3]<24;

   var check5=/^\d+$/.test(split[4]);
    check5= check5&&split[4].length===2;
   check5= check5&&split[4]<60;

    if(!check0 || !check1 || !check2 || !check3 || !check4 || !check5){
      return 'Enter Valid Date';
      
    }
    else
           return false;
    
  }
  
}

const validateFields = new ValidateFields();
export { validateFields };