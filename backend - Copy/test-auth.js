const mongoose = require('mongoose');
require('dotenv').config();

// Import your User model
const User = require('./src/models/User');

// Test database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

// Test User Schema Functions
const testUserSchema = async () => {
  console.log('\n🧪 TESTING USER SCHEMA FUNCTIONS\n');
  
  try {
    // Test 1: Create a new user
    console.log('1. Testing User Creation...');
    const testUser = new User({
      name: 'Dr. John Smith',
      email: 'doctor.john@test.com',
      mobile: '1234567890',
      passwordHash: await User.hashPassword('securepassword123'),
      role: 'doctor'
    });
    
    await testUser.save();
    console.log('✅ User created successfully:', testUser.email);

    // Test 2: Check password verification
    console.log('\n2. Testing Password Verification...');
    const isPasswordValid = await testUser.checkPassword('securepassword123');
    const isPasswordInvalid = await testUser.checkPassword('wrongpassword');
    console.log('✅ Correct password check:', isPasswordValid);
    console.log('✅ Wrong password check:', isPasswordInvalid);

    // Test 3: Test duplicate email prevention
    console.log('\n3. Testing Duplicate Email Prevention...');
    try {
      const duplicateUser = new User({
        name: 'Duplicate User',
        email: 'doctor.john@test.com', // Same email
        passwordHash: await User.hashPassword('password123')
      });
      await duplicateUser.save();
    } catch (error) {
      console.log('✅ Duplicate email prevented:', error.message);
    }

    // Test 4: Test email validation
    console.log('\n4. Testing Email Validation...');
    try {
      const invalidEmailUser = new User({
        name: 'Invalid Email',
        email: 'invalid-email',
        passwordHash: await User.hashPassword('password123')
      });
      await invalidEmailUser.save();
    } catch (error) {
      console.log('✅ Invalid email prevented:', error.errors['email'].message);
    }

    // Test 5: Test role validation
    console.log('\n5. Testing Role Validation...');
    try {
      const invalidRoleUser = new User({
        name: 'Invalid Role',
        email: 'invalidrole@test.com',
        passwordHash: await User.hashPassword('password123'),
        role: 'invalid_role'
      });
      await invalidRoleUser.save();
    } catch (error) {
      console.log('✅ Invalid role prevented');
    }

    // Test 6: Find user by email
    console.log('\n6. Testing User Search...');
    const foundUser = await User.findOne({ email: 'doctor.john@test.com' });
    console.log('✅ User found:', foundUser ? foundUser.name : 'Not found');

    // Test 7: Test Google user creation (no password required)
    console.log('\n7. Testing Google User Creation...');
    const googleUser = new User({
      name: 'Google User',
      email: 'google.user@test.com',
      googleId: 'google123456',
      picture: 'https://example.com/avatar.jpg',
      emailVerified: true
    });
    await googleUser.save();
    console.log('✅ Google user created without password');

    // Test 8: List all users
    console.log('\n8. Listing All Users...');
    const allUsers = await User.find({}).select('name email role createdAt');
    console.log('📋 All users in database:');
    allUsers.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run tests
const runTests = async () => {
  await connectDB();
  await testUserSchema();
  
  // Close connection
  mongoose.connection.close();
  console.log('\n🎉 All tests completed! Database connection closed.');
};

runTests();