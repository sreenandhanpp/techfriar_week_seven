const { body } = require('express-validator');


module.exports = [
    // Validate Aadhar number
    body('aadhar')
      .notEmpty()
      .withMessage('Aadhar number is required')
      .isLength({ min: 12, max: 12 })
      .withMessage('Aadhar number must be exactly 12 digits')
      .matches(/^[0-9]+$/)
      .withMessage('Aadhar number can only contain digits')
    //   .custom(async (value) => {
    //     // Optional: Check if the Aadhar number exists in the database
    //     // const existingAadhar = await AadharNumber.findOne({ aadharNumber: value }).exec();
    //     if (existingAadhar) {
    //       throw new Error('Aadhar number already exists');
    //     }
    //     return true;
    //   }),
  ];
  
  
  
  
  
  