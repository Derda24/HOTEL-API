// index.js
import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// Sample in-memory hotel data (for a real project, use a database)
let hotels = [
  {
    id: 1,
    name: "Hotel Sunshine",
    location: "Istanbul",
    description: "A comfortable hotel in the heart of Istanbul.",
    price: 100,
    amenities: ["WiFi", "Breakfast", "Gym"],
    rating: 4.5,
    available_rooms: 10,
    created_at: new Date()
  },
  {
    id: 2,
    name: "Seaside Resort",
    location: "Antalya",
    description: "Enjoy a relaxing seaside experience.",
    price: 150,
    amenities: ["Pool", "Beach Access", "Spa"],
    rating: 4.7,
    available_rooms: 5,
    created_at: new Date()
  }
];

// Create an Express Router to group all hotel API endpoints under "/hotel-api"
const router = express.Router();

/* --- GET /hotels ---
   Returns a list of all hotels. */
router.get('/hotels', (req, res) => {
  // Sort hotels by created_at in descending order (latest first)
  const sortedHotels = hotels.sort((a, b) => b.created_at - a.created_at);
  res.json(sortedHotels);
});

/* --- GET /hotels/:id ---
   Returns the details of the hotel with the specified ID. */
router.get('/hotels/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hotel = hotels.find(h => h.id === id);
  if (!hotel) {
    return res.status(404).json({ error: "Hotel not found" });
  }
  res.json(hotel);
});

/* --- POST /hotels ---
   Adds a new hotel entry. */
router.post('/hotels', (req, res) => {
  const { name, location, description, price, amenities, rating, available_rooms } = req.body;
  if (!name || !location || !price || !amenities) {
    return res.status(400).json({ error: "Missing required fields: name, location, price, amenities" });
  }
  const newHotel = {
    id: hotels.length + 1,
    name,
    location,
    description: description || "",
    price,
    amenities,
    rating: rating || null,
    available_rooms: available_rooms || null,
    created_at: new Date()
  };
  hotels.push(newHotel);
  res.status(201).json(newHotel);
});

/* --- PUT /hotels/:id ---
   Updates the hotel entry with the specified ID. */
router.put('/hotels/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const hotel = hotels.find(h => h.id === id);
  if (!hotel) {
    return res.status(404).json({ error: "Hotel not found" });
  }
  const { name, location, description, price, amenities, rating, available_rooms } = req.body;
  if (name) hotel.name = name;
  if (location) hotel.location = location;
  if (description) hotel.description = description;
  if (price) hotel.price = price;
  if (amenities) hotel.amenities = amenities;
  if (rating) hotel.rating = rating;
  if (available_rooms) hotel.available_rooms = available_rooms;
  res.json(hotel);
});

/* --- DELETE /hotels/:id ---
   Deletes the hotel with the specified ID. */
router.delete('/hotels/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = hotels.findIndex(h => h.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Hotel not found" });
  }
  const deletedHotel = hotels.splice(index, 1);
  res.json(deletedHotel[0]);
});

/* --- GET /hotels/search ---
   Searches hotels based on location and price range. */
router.get('/hotels/search', (req, res) => {
  const { location, min_price, max_price } = req.query;
  let result = hotels;

  if (location) {
    result = result.filter(hotel => hotel.location.toLowerCase().includes(location.toLowerCase()));
  }
  if (min_price) {
    result = result.filter(hotel => hotel.price >= parseFloat(min_price));
  }
  if (max_price) {
    result = result.filter(hotel => hotel.price <= parseFloat(max_price));
  }
  res.json(result);
});

// Use the router with the base path "/hotel-api"
app.use('/hotel-api', router);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
