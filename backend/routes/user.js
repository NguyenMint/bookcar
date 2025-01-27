const mysql = require("mysql2");
const express = require("express");
const router = express.Router();
const connection = require("../db");
const moment = require("moment"); // Don't forget to import moment for time manipulation

const statusMapping = {
  1: "Xác nhận đặt thành công",
  2: "Hoàn thành",
  3: "Hủy đơn hàng",
};

// Helper function to wrap MySQL queries in a promise
const queryPromise = (query, params) => {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

router.post("/appointments", async (req, res) => {
  const {
    UserID,
    ServiceID,
    DateSlot,
    Status,
    BookedByEmployeeID,
    TimeSlotID,
  } = req.body;

  // Validate required fields
  if (!UserID || !ServiceID || !DateSlot || !Status || !TimeSlotID) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Start a transaction
  try {
    await new Promise((resolve, reject) => {
      connection.beginTransaction((err) => {
        if (err) {
          return reject({
            message: "Failed to start transaction",
            statusCode: 500,
          });
        }
        resolve();
      });
    });

    // Check if the timeslot is available
    const checkAvailabilityQuery = `
      SELECT IsAvailable, StartTime, EndTime 
      FROM timeslots 
      WHERE TimeSlotID = ? AND ServiceID = ? AND DateSlot = ?;
    `;

    const availabilityResult = await queryPromise(checkAvailabilityQuery, [
      TimeSlotID,
      ServiceID,
      DateSlot,
    ]);

    // console.log(req.body);

    // Ensure availabilityResult is an array with at least one element
    if (
      !Array.isArray(availabilityResult) ||
      availabilityResult.length === 0 ||
      availabilityResult[0].IsAvailable <= 0
    ) {
      throw { message: "Selected timeslot is not available", statusCode: 400 };
    }

    // Get the price and duration of the service to calculate the end time
    const serviceQuery = `
      SELECT Price, Duration 
      FROM services 
      WHERE ServiceID = ?;
    `;

    const serviceData = await queryPromise(serviceQuery, [ServiceID]);

    if (serviceData.length === 0) {
      throw { message: "Service not found", statusCode: 404 };
    }

    const { Price, Duration } = serviceData[0];

    // Calculate the end time based on the duration
    const endTime = moment(availabilityResult[0].StartTime, "HH:mm:ss")
      .add(Duration, "minutes")
      .format("HH:mm:ss");

    // Proceed with booking the appointment
    const appointmentQuery = `
      INSERT INTO appointments 
      (UserID, ServiceID, Status, BookedByEmployeeID, DateSlot, StartTime) 
      VALUES (?, ?, ?, ?, ?, ?);
    `;

    const appointmentResult = await queryPromise(appointmentQuery, [
      UserID,
      ServiceID,
      Status,
      BookedByEmployeeID,
      DateSlot,
      availabilityResult[0].StartTime,
      endTime,
    ]);

    // Update the availability of the timeslot
    const updateAvailabilityQuery = `
      UPDATE timeslots 
      SET IsAvailable = IsAvailable - 1
      WHERE TimeSlotID = ? AND ServiceID = ?;
    `;

    await queryPromise(updateAvailabilityQuery, [TimeSlotID, ServiceID]);

    // Commit the transaction after everything is successful
    await new Promise((resolve, reject) => {
      connection.commit((err) => {
        if (err) return reject({ message: err.message, statusCode: 500 });
        resolve();
      });
    });

    // Success response
    return res.status(201).json({
      message: "Appointment booked successfully!",
      appointmentId: appointmentResult.insertId,
      Price,
      Duration,
      StartTime: availabilityResult[0].StartTime,
      EndTime: endTime,
    });
  } catch (error) {
    // Rollback in case of error
    try {
      await new Promise((resolve, reject) => {
        connection.rollback((err) => {
          if (err) return reject({ message: err.message, statusCode: 500 });
          resolve();
        });
      });
    } catch (rollbackError) {
      console.error("Error during rollback:", rollbackError);
    }

    // Return the error response
    return res.status(error.statusCode || 500).json({ error: error.message });
  }
});

// Example user route
router.get("/", (req, res) => {
  res.json({ message: "User route is working" });
});

// Fetch user bookings
router.get("/bookings", (req, res) => {
  const { userId } = req.query;

  const query = `
    SELECT DISTINCT
      appointments.AppointmentID, 
      services.ServiceName, 
      services.Price, 
      appointments.Status, 
      appointments.StartTime,   
      appointments.DateSlot 
    FROM appointments 
    JOIN services ON appointments.ServiceID = services.ServiceID 
    WHERE appointments.UserID = ?
    ORDER BY appointments.Status ASC, appointments.AppointmentID DESC;
  `;

  connection.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching bookings" });
    }
    res.json(results);
  });
});

module.exports = router;
