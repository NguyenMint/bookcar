//backend/index.js
const express = require("express");
const mysql = require("mysql2");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const multer = require("multer"); // Import multer
const cloudinary = require("cloudinary").v2; // Import Cloudinary
const fs = require("fs"); // Import fs to check and create the 'uploads' directory if necessary
const connection = require("./db"); // Adjust the path if needed

const app = express();

// Cloudinary configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// Check and create 'uploads' directory if it doesn't exist (optional, if saving locally before upload)
// const uploadDir = './uploads';
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// Enable CORS for the frontend URL (allowing credentials) before other routes
app.use(
  cors({
    origin: "http://" + process.env.IPConfig, // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Enable cookies and credentials
  })
);
//Fetch time to handle services
app.get("/api/server/time", (req, res) => {
  const now = new Date();

  // Convert local time to ISO format
  const localTimeISO = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000
  ).toISOString();
  
  res.json({
    localTimeISO
  });
});

// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cookieParser());

// Test database connection
// app.get('/spa_booking', (req, res) => {
//     connection.query('SELECT * from users', (err, results) => {
//         if (err) {
//             return res.status(500).json({ message: 'Database connection error', error: err });
//         }
//         res.status(200).json({ message: 'Database connected successfully', solution: results });
//     });
// });

// Setup multer for image uploading (saving locally before uploading to Cloudinary)
const storage = multer.memoryStorage(); // Store the file in memory instead of locally

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG, JPG, and PNG files are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Function to upload image to Cloudinary
// const uploadToCloudinary = (file) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload_stream(
//             {
//                 resource_type: 'auto',  // Automatically detects file type (image, video, etc.)
//                 folder: 'uploads',      // Save the image in the 'uploads' folder
//                 // Do not include timestamp or public_id here (Cloudinary will handle this internally)
//             },
//             (error, result) => {
//                 if (error) {console.error("Error uploading image to Cloudinary:", error); // Log the error
//                   reject(error);  // Reject the promise if there's an error
//               } else {
//                   console.log("Image uploaded successfully:", result); // Log the successful upload result
//                   resolve(result);  // Return the result with the image URL and other info
//               }
//           }
//       ).end(file.buffer);  // Pass the file buffer directly to Cloudinary
//   });
// };

// API routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const { log } = require("console");
// const categoryRoutes = require('./routes/catagory');
// const storeRoutes = require('./routes/myStore');

// const hotelRoutes = require('./routes/hotel');
// const MyHotelRoutes = require('./routes/myhotel');
// const roomRoutes = require('./routes/room');
// const bookingRoutes = require('./routes/booking');

// app.use('/api/category', categoryRoutes)
// app.use('/api/users', userRoutes);
// app.use('/api/auth', authRoutes);
// app.use('/api/store', storeRoutes);

// app.use('/api/hotel', hotelRoutes);
// app.use('/api/my-hotels', MyHotelRoutes);
// app.use('/api/room', roomRoutes);
// app.use('/api/bookings', bookingRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// Modify the '/upload-image' route to return the Cloudinary URL
app.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  uploadToCloudinary(req.file)
    .then((result) => {
      // Return the Cloudinary URL directly
      res.status(200).json({
        message: "Image uploaded successfully",
        url: result.secure_url, // The URL returned by Cloudinary (no need for the local 'images' route)
      });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Error uploading image to Cloudinary", error });
    });
});

app.get("/test-db", (req, res) => {
  connection.query("SELECT 1 + 1 AS solution", (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Database connection error", error: err });
    }
    res.status(200).json({
      message: "Database connected successfully",
      solution: results[0].solution,
    });
  });
});
// Serve image uploads (optional, if you want to serve image locally before uploading)
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error
  res.status(500).json({ message: "Internal Server Error" });
});

// Start the server on port 8800
app.listen(5500, () => {
  console.log("Backend server running on port 5500");
});
