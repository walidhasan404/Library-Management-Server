require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const makeUserAdmin = async (email) => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    console.log(`🔍 Looking for user: ${email}`);
    let user = await User.findOne({ email });

    if (!user) {
      console.log('❌ User not found. Creating new user...');
      user = await User.create({
        email,
        name: email.split('@')[0],
        role: 'admin'
      });
      console.log('✅ User created as admin:', user);
    } else if (user.role === 'admin') {
      console.log('✅ User is already an admin!');
    } else {
      console.log('🔄 Updating user to admin...');
      user.role = 'admin';
      await user.save();
      console.log('✅ User updated to admin:', user);
    }

    console.log('\n📋 User Details:');
    console.log('   Email:', user.email);
    console.log('   Name:', user.name);
    console.log('   Role:', user.role);
    console.log('   ID:', user._id);

    await mongoose.disconnect();
    console.log('\n✅ Done! User is now an admin.');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

// Get email from command line or use default
const email = process.argv[2] || 'olidehasan444@gmail.com';
makeUserAdmin(email);

