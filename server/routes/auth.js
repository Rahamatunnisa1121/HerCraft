const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Innovation = require('../models/Innovation');
const Purchase = require('../models/Purchases');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kishan'; // Use a strong secret key in production

// Middleware to verify the token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied: No Token Provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or Expired Token' });
    req.userId = decoded.id; // Store user ID for later use
    next();
  });
};

// Signup route
router.post('/signup', async (req, res) => {
  const { username, email, dob, password } = req.body;

  if (!username || !email || !dob || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, dob, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user data (protected route)
router.get('/user', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT /api/user/update-profile - Update profile information
router.put('/settings/profile', authenticateToken, async (req, res) => {
  const { username, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { username, email },
      { new: true }
    ).select('-password');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// PUT /api/settings/change-password - Change password
router.put('/settings/change-password', authenticateToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect current password' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// POST /api/innovations - Add a new innovation
router.post('/innovations', authenticateToken, async (req, res) => {
  const {
    name, cost, description, upiId, address, contact, itemImage,
  } = req.body;

  try {
    const innovation = new Innovation({
      name,
      cost,
      description,
      userId: req.userId, // Using authenticated user ID
      upiId,
      address,
      contact,
      itemImage,
    });

    const savedInnovation = await innovation.save();
    res.status(201).json(savedInnovation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add innovation' });
  }
});

// PUT /api/innovations/:id - Update an innovation by ID
router.put('/innovations/:id', authenticateToken, async (req, res) => {
  const { name, cost, rating, description } = req.body;
  const { id } = req.params;

  try {
    const innovation = await Innovation.findById(id);
    if (!innovation) {
      return res.status(404).json({ message: 'Innovation not found' });
    }

    if (innovation.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this innovation' });
    }

    innovation.name = name || innovation.name;
    innovation.cost = cost || innovation.cost;
    innovation.rating = rating || innovation.rating;
    innovation.description = description || innovation.description;
    await innovation.save();

    res.status(200).json({ message: 'Innovation updated successfully', innovation });
  } catch (error) {
    console.error('Error updating innovation:', error);
    res.status(500).json({ message: 'Failed to update innovation' });
  }
});

// GET /api/innovations - Get all innovations by authenticated user
router.get('/innovations', authenticateToken, async (req, res) => {
  try {
    const innovations = await Innovation.find({ userId: req.userId }).select('name cost description image totalSold');

    res.json(innovations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch innovations' });
  }
});

// GET /api/innovations1 - Get all innovations
router.get('/innovations1', async (req, res) => {
  try {
    const innovations = await Innovation.find().sort({ createdAt: -1 });
    res.status(200).json(innovations);
  } catch (error) {
    console.error('Error fetching innovations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/innovations/:id - Delete an innovation by ID
router.delete('/innovations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const innovation = await Innovation.findById(id);

    if (!innovation || innovation.userId.toString() !== req.userId) {
      return res.status(404).json({ message: 'Innovation not found or not authorized to delete' });
    }

    await Innovation.deleteOne({ _id: id });
    res.status(200).json({ message: 'Innovation deleted successfully' });
  } catch (error) {
    console.error('Error deleting innovation:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/innovations/:id/buy - Buy an innovation
router.patch('/innovations/:innovationId/buy', authenticateToken, async (req, res) => {
  const { innovationId } = req.params;
  const { buyerId, cost, address, mobile } = req.body;

  try {
    // Find the innovation being bought
    const innovation = await Innovation.findById(innovationId);
    if (!innovation) {
      return res.status(404).json({ message: 'Innovation not found' });
    }

    // Create the purchase record
    const purchase = new Purchase({
      buyerId,
      sellerId: innovation.userId,
      itemId: innovation._id,
      cost,
      purchaseDate: new Date(),
    });

    // Save the purchase record
    await purchase.save();

    // Update the totalSold and earnings in the Innovation model
    innovation.totalSold += 1;
    innovation.earned += cost;
    await innovation.save();

    // Simulate UPI linking (redirect user in frontend to their UPI app)
    res.status(201).json({
      message: 'Purchase successful',
      purchase,
    });
  } catch (error) {
    console.error('Error processing purchase:', error);
    res.status(500).json({ message: 'Error processing purchase', error });
  }
});

router.patch('/innovations/:id/update-sales',authenticateToken, async (req, res) => {
  const { cost } = req.body;
  try {
    const innovation = await Innovation.findById(req.params.id);
    if (!innovation) return res.status(404).send('Innovation not found.');

    innovation.totalSold += 1;
    innovation.earned += cost;
    await innovation.save();

    res.status(200).send(innovation);
  } catch (err) {
    res.status(500).send({ error: 'Failed to update innovation sales.' });
  }
});

router.post('/purchases', authenticateToken, async (req, res) => {
  try {
    const { productId, productName, cost } = req.body;
    const userId = req.userId;  // Get user ID from the token

    const newPurchase = new Purchase({
      userId,
      productId,
      productName,
      cost,
    });

    await newPurchase.save();
    res.status(201).json({ message: 'Purchase recorded successfully', purchase: newPurchase });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error recording purchase' });
  }
});

// routes/purchases.js
// Get all orders for a user
router.get('/purchases', authenticateToken, async (req, res) => {
  try {
    const userId = req.userId;  // Get user ID from the token

    // Find all purchases made by the current user and populate the address and contact fields
    const purchases = await Purchase.find({ userId })
      .populate({
        path: 'productId',  // Path to the referenced field (productId)
        select: 'address contact'  // Specify the fields you want to populate
      })
      .exec();

    res.json(purchases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});





// POST /api/purchases - Log a purchase
router.get('/purchases/:userId',authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const purchases = await Purchase.find({ buyerId: userId })
      .populate('itemId')  // Fetch the innovation details
      .populate('sellerId'); // Fetch the seller details

    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error });
  }
});

module.exports = router;
