const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event");
const { authUser } = require("../middlwares/auth");

// Create a new event
router.post("/events", authUser, eventController.createEvent);

// Get a list of events (with pagination)
router.post("/getAllEvents", eventController.getEvents);

// Get a list of events in which user participated and created
router.get(
  "/events/my-events/:userId",
  authUser,
  eventController.getUserEventsHistory
);

// Get event details by ID
router.get("/events/:id", eventController.getEventById);

// Update event details by ID
router.put("/events/:id", authUser, eventController.updateEvent);

// Update event game info by ID
router.put(
  "/events/gameInfo/:id",
  authUser,
  eventController.updateGameInfoOfEvent
);

// Update event details by ID
router.put("/events/cancel/:id", authUser, eventController.updateEvent);

// Delete an event by ID
router.delete("/events/:id", authUser, eventController.deleteEvent);

// Purchase event tickets
router.post(
  "/events/purchase-ticket",
  authUser,
  eventController.purchaseEventTicket
);

// Make a donation to an event
router.post("/events/:eventId/donate", authUser, eventController.makeDonation);

// Event Host submits rankings
router.post(
  "/events/:eventId/rankings",
  authUser,
  eventController.submitRankings
);

// Admin views and verifies event rankings
router.get(
  "/admin/events/:eventId/rankings",
  authUser,
  eventController.viewEventRankings
);

router.put("/event/placeBid", authUser, eventController.placeBid);
router.get("/event/my-bids/:userId", authUser, eventController.getUserBids);
router.get(
  "/event/dispute/:disputeId/:eventId",
  authUser,
  eventController.getDisputeDetails
);
router.post(
  "/events/:eventId/disputes",
  authUser,
  eventController.raiseDispute
);

module.exports = router;
