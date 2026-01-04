require("dotenv").config();
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI);

// Define schemas
const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  emaildata: { emailAddress: String, isVerified: Boolean },
  phoneData: { phoneNumber: String, isVerified: Boolean },
  role: String,
});

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    office: { type: mongoose.Schema.Types.ObjectId, ref: "Office" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
    startDate: Date,
    endDate: Date,
    totalPrice: Number,
    status: String,
    driverAge: Number,
  },
  { timestamps: true }
);

const notificationSchema = new mongoose.Schema(
  {
    type: String,
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    phoneNumber: String,
    message: String,
    scheduledFor: Date,
    status: String,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Reservation =
  mongoose.models.Reservation ||
  mongoose.model("Reservation", reservationSchema);
const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

async function createTestReservation() {
  try {
    console.log("🔍 Finding test user, office, and category...");

    // Find first user
    const user = await User.findOne();
    if (!user) throw new Error("No users found");

    // Find first office
    const Office = mongoose.model("Office");
    const office = await Office.findOne();
    if (!office) throw new Error("No offices found");

    // Find first category
    const Category = mongoose.model("Category");
    const category = await Category.findOne();
    if (!category) throw new Error("No categories found");

    // Create reservation with pickup time 3 hours and 2 minutes from now
    const now = new Date();
    const pickupTime = new Date(now.getTime() + 3 * 60 * 60 * 1000 + 2 * 60 * 1000); // 3h 2min from now
    const returnTime = new Date(pickupTime.getTime() + 24 * 60 * 60 * 1000); // 24h later

    console.log("\n📅 Creating test reservation:");
    console.log(`   User: ${user.name} ${user.lastName}`);
    console.log(`   Phone: ${user.phoneData.phoneNumber}`);
    console.log(`   Office: ${office.name}`);
    console.log(`   Pickup: ${pickupTime.toLocaleString()}`);
    console.log(`   Return: ${returnTime.toLocaleString()}`);

    const reservation = await Reservation.create({
      user: user._id,
      office: office._id,
      category: category._id,
      startDate: pickupTime,
      endDate: returnTime,
      totalPrice: 100,
      status: "confirmed",
      driverAge: 25,
    });

    console.log("\n✅ Reservation created!");
    console.log(`   ID: ${reservation._id}`);

    // Schedule notifications
    console.log("\n📲 Scheduling reminder notifications...");

    const pickupTimes = [
      pickupTime,
      new Date(pickupTime.getTime() + 15 * 60 * 1000),
      new Date(pickupTime.getTime() + 30 * 60 * 1000),
      new Date(pickupTime.getTime() + 45 * 60 * 1000),
    ];

    for (const time of pickupTimes) {
      const reminderTime = new Date(time.getTime() - 3 * 60 * 60 * 1000);

      if (reminderTime > now) {
        await Notification.create({
          type: "reservation_reminder",
          reservation: reservation._id,
          user: user._id,
          phoneNumber: user.phoneData.phoneNumber,
          message: `Reminder: Van pickup in 3hrs at ${office.name}. Time: ${time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} ${time.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}. SuccessVanHire.co.uk`,
          scheduledFor: reminderTime,
          status: "pending",
        });

        console.log(
          `   ✓ Reminder scheduled for: ${reminderTime.toLocaleString()}`
        );
        console.log(`     (Pickup at: ${time.toLocaleTimeString()})`);
      }
    }

    // Check pending notifications
    const pendingNotifications = await Notification.find({
      reservation: reservation._id,
      status: "pending",
    }).sort({ scheduledFor: 1 });

    console.log(`\n📋 Total pending notifications: ${pendingNotifications.length}`);
    console.log("\n⏰ Scheduled reminders:");
    pendingNotifications.forEach((notif, idx) => {
      const timeUntil = Math.round(
        (notif.scheduledFor.getTime() - now.getTime()) / 1000 / 60
      );
      console.log(
        `   ${idx + 1}. ${notif.scheduledFor.toLocaleString()} (in ${timeUntil} minutes)`
      );
    });

    console.log("\n✅ Test reservation created successfully!");
    console.log(
      "\n💡 The cron job will send SMS in ~2 minutes when the first reminder is due."
    );
    console.log(
      "   Make sure your cron job is running: /api/notifications/cron"
    );

    process.exit(0);
  } catch (error) {
    console.log("❌ Error:", error.message);
    process.exit(1);
  }
}

createTestReservation();
