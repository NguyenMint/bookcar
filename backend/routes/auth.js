//backend/routes/auth.js
const mysql = require("mysql2");
const moment = require("moment");

const express = require("express");
const router = express.Router();
const connection = require("../db"); // Adjust the path if needed

// Login endpoint
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username hoặc password không được để trống" });
  }

  // Query to find the user by email
  const query = "SELECT * FROM users WHERE username = ? AND password = ?";
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error("Error querying database:", err);
      return res.status(500).json({ message: "Server error" });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ message: "Tên đăng nhập hoặc mật khẩu sai" });
    }

    // Successful login
    const user = results[0];
    res.status(200).json({ message: "Đăng nhập thành công", user });
  });
});
router.get("/service", (req, res) => {
  connection.query("SELECT * from services", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database connection error", error: err });
    }
    res
      .status(200)
      .json({ message: "Database connected successfully", solution: results });
  });
});

router.post("/appointments", (req, res) => {
  const {
    UserID,
    CustomerName,
    CustomerPhone,
    ServiceID,
    DateSlot,
    Status,
    BookedByEmployeeID,
  } = req.body;

  const query = `INSERT INTO appointments (UserID, CustomerName, CustomerPhone, ServiceID, DateSlot, Status, BookedByEmployeeID) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    query,
    [
      UserID,
      CustomerName,
      CustomerPhone,
      ServiceID,
      DateSlot,
      Status,
      BookedByEmployeeID,
    ],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: error.message });
      }

      res.status(201).json({
        message: "Appointment booked successfully",
        AppointmentID: results.insertId,
      });
    }
  );
});
router.get("/availableSlots", (req, res) => {
  const { serviceId } = req.query;

  if (!serviceId) {
    return res.status(400).json({ error: "ServiceID is required" });
  }

  const query = `SELECT * FROM timeslots WHERE ServiceID = ? AND DateSlot >= CURDATE();`;
  connection.query(query, [serviceId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

router.get("/bookings", async (req, res) => {
  const sql = `SELECT 
      appointments.AppointmentID,
      users.FullName AS CustomerName,
      services.ServiceName,
      users.Email AS email,
      DATE_FORMAT(appointments.DateSlot, '%Y-%m-%d') AS DateSlot,
      appointments.StartTime,
      appointments.Status,
      services.Price
    FROM appointments
    JOIN users ON appointments.UserID = users.UserID
    JOIN services ON appointments.ServiceID = services.ServiceID ORDER BY appointments.Status ASC, appointments.AppointmentID DESC`;

  connection.query(sql, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database connection error", error: err });
    }
    res
      .status(200)
      .json({ message: "Database connected successfully", solution: results });
  });
});
router.put("/bookings/:bookingId", async (req, res) => {
  const { bookingId } = req.params; // Extract booking ID from URL
  const { Status } = req.body; // Extract the new status from the request body

  if (!bookingId) {
    return res.status(400).json({ error: "Booking ID is required" });
  }

  if (typeof Status === "undefined") {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const result = await connection.execute(
      `
      UPDATE appointments 
      SET Status = ? 
      WHERE AppointmentID = ?
      `,
      [Status, bookingId]
    );
    // Check if result contains the expected affectedRows property
    const affectedRows = result?.[0]?.affectedRows || result?.affectedRows;

    if (affectedRows === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.status(200).json({ message: "Booking status updated successfully" });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.post("/addUser", async (req, res) => {
//   const { FullName, Username, Password, PhoneNumber, Email } = req.body;

//   if (!FullName || !Username || !Password) {
//     return res.status(400).json({
//       error: "FullName, Username, and Password are required fields.",
//     });
//   }
//   console.log(req.body);

//   try {
//     // Insert user into the database
//     const [result] = await connection.execute(
//       `
//       INSERT INTO users (FullName, Username, Password, PhoneNumber, Email, Role, CreatedDate)
//       VALUES (?, ?, ?, ?, ?, 0, NOW())
//       `,
//       [FullName, Username, Password, PhoneNumber || null, Email || null]
//     );

//     const newUserId = result.insertId;

//     res.status(201).json({
//       message: "User added successfully.",
//       UserID: newUserId,
//     });
//   } catch (error) {
//     console.error("Error adding new user:", error);
//     res.status(500).json({
//       error: "An error occurred while adding the user.",
//     });
//   }
// });

router.post("/addUser", (req, res) => {
  const { Page, FullName, Username, Password, PhoneNumber, Email } = req.body;

  if (!FullName || !Username || !Password) {
    return res.status(400).json({
      error:
        "FullName, Username, Password, ServiceID, and DateSlot are required fields.",
    });
  }

  const userQuery = `
    INSERT INTO users (FullName, Username, Password, PhoneNumber, Email, Role, CreatedDate)
    VALUES (?, ?, ?, ?, ?, 0, NOW())
  `;

  connection.query(
    userQuery,
    [FullName, Username, Password, PhoneNumber || null, Email || null],
    (userErr, userResults) => {
      if (userErr) {
        return res.status(500).json({ error: userErr.message });
      }

      const newUserId = userResults.insertId;

      if (Page === "SignUp") {
        // If it's a "SignUp", respond right after user creation
        return res.status(201).json({
          message: "User added successfully",
          UserID: newUserId,
        });
      }

      res.status(201).json({
        message: "User and appointment added successfully",
        UserID: newUserId,
      });
    }
  );
});
router.get("/findUserByPhoneNumber", (req, res) => {
  const { phone } = req.query;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const query = "SELECT * FROM users WHERE PhoneNumber = ?";
  connection.query(query, [phone], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      res.json({ exists: true, user: results[0] });
    } else {
      res.json({ exists: false });
    }
  });
});

router.get("/customer-bookings", async (req, res) => {
  const query = `
          SELECT 
        appointments.userid, fullname,
        COUNT(*) AS BookingCount 
      FROM appointments join users on appointments.UserID = users.UserID
      WHERE Status = 3 
      GROUP BY userid ORDER BY BookingCount desc
    `;
  connection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length > 0) {
      res.json({ exists: true, user: results });
    } else {
      res.json({ exists: false });
    }
  });

  // try {
  //   const query = `
  //     SELECT
  //       userid,
  //       COUNT(*) AS BookingCount
  //     FROM appointments
  //     WHERE Status = 3
  //     GROUP BY userid
  //   `;
  //   const result = await connection.query(query);
  //   res.status(200).json(result.rows);
  // } catch (error) {
  //   res.status(500).json({ error: "Failed to fetch booking counts." });
  // }
});

// router.post("/send", async (req, res) => {
//   const { appointmentId, email } = req.body;

//   try {
//     // Fetch booking details from the database
//     const booking = await Booking.findById(appointmentId); // Replace with your DB query
//     if (!booking) return res.status(404).send("Booking not found");

//     const transporter = nodemailer.createTransport({
//       service: "Gmail", // Or your email service provider
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: "Your Booking is Confirmed",
//       text: `Dear ${booking.CustomerName},\n\nYour booking for ${booking.ServiceName} on ${booking.DateSlot} at ${booking.StartTime} has been confirmed.\n\nThank you for choosing us!\n\nBest regards,\nSPA Team`,
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).send("Email sent successfully");
//   } catch (error) {
//     console.error("Error sending email:", error);
//     res.status(500).send("Failed to send email");
//   }
// });
module.exports = router;
