const BookingSchema = require("../MongoDb/models/commonModels/Bookings");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const checkIsBooked = async (proId,userId) => {
  // If the user has previous applications, check if they have already applied for this job
  const isBooked = await BookingSchema.findOne({
    userId: new ObjectId(userId),
    "bookingList._id": new ObjectId(proId),
  });
  if (isBooked) {
    return true;
  } else {
    return false;
  }
};

module.exports = checkIsBooked;
