require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust path if needed

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Seed admin function
const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: "admin@taskapp.com" });
    if (existing) {
      console.log("ℹ️ Admin already exists.");
    } else {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const adminUser = new User({
        name: "Admin",
        email: "admin@taskapp.com",
        password: hashedPassword,
        role: "admin",
      });
      await adminUser.save();
      console.log("🎉 Admin user seeded successfully!");
    }
  } catch (err) {
    console.error("❌ Error while seeding admin:", err);
  } finally {
    mongoose.disconnect();
  }
};

seedAdmin();
