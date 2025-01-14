const cron = require("node-cron");
const Event = require("../models/Event");
const User = require("../models/User");
const { checkAndProcessDisputes } = require("../controllers/event");

const updateEventStatus = async () => {
  const currentTime = new Date();

  try {
    const expiredEvents = await Event.find({
      dateTime: { $lte: currentTime },
      status: "ACTIVE", // Filter by status equal to "ACTIVE"
    });

    expiredEvents.forEach(async (event) => {
      event.status = "IN_PROGRESS";

      event.bids.sort((a, b) => b.amount - a.amount);
      event.eligibleBids = event.bids.slice(
        0,
        event.numberOfTickets - event.eventMembers.length
      );

      for (const bid of event.bids) {
        const user = await User.findById(bid.user);

        if (!event.eligibleBids.some((topBid) => topBid._id.equals(bid._id))) {
          // Release blocked amount for non-winning bids
          user.blockedBalance -= bid.amount;
          user.balance += bid.amount;
          await user.save();
        }
      }

      // Iterate through eligible bids and update eventMembers
      for (const eligibleBid of event.eligibleBids) {
        const user = await User.findById(eligibleBid.user);

        event.eventMembers.push({
          amount: eligibleBid.amount,
          image: user.picture, // Assuming the user has a 'picture' field
          user: user._id,
          createdAt: new Date(),
          ranking: 0, // You can set a default ranking if needed
        });
      }

      await event.save();
    });
  } catch (error) {
    console.error("Error updating events:", error);
  }
};

// Schedule the cron job
cron.schedule("*/2 * * * * *", () => {
  // console.log("Running event cron job...");
  updateEventStatus();
});

// Schedule a daily cron job at a specific time (e.g., 2 AM)
cron.schedule("0 2 * * *", async () => {
  // console.log("Running event dispute cron job...");
  checkAndProcessDisputes();
});
