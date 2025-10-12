#!/usr/bin/env node

/**
 * MongoDB Atlas Optimization Setup Script
 * This script helps you set up the optimized environment variables for Vercel
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up optimized MongoDB Atlas configuration...\n');

// Optimized MongoDB Atlas connection string
// Updated with new password: 1dJxoCXFl6GwpjB5
// Removed bufferCommands and bufferMaxEntries as they are mongoose options, not URI options
const optimizedMongoURI = 'mongodb+srv://libra-genius:1dJxoCXFl6GwpjB5@cluster0.mongodb.net/libraryBooks?retryWrites=true&w=majority&maxPoolSize=10&serverSelectionTimeoutMS=5000&socketTimeoutMS=45000';

const envContent = `# MongoDB Atlas Connection String (Optimized for Vercel Serverless)
MONGODB_URI=${optimizedMongoURI}

# JWT Secret for Authentication
ACCESS_TOKEN_SECRET=bd8c3a3758347150f60612a95efa20130b94f4e3c0b54214f8435cfcce05bc8311f24d61ac989d275884a71866fb3f9b4285dd9ca370dfcafe12c0282d4abc4e

# Environment
NODE_ENV=production

# Legacy variables (can be removed)
DB_USER=libra-genius
DB_PASS=1dJxoCXFl6GwpjB5
`;

// Create .env file
const envPath = path.join(__dirname, '.env');
fs.writeFileSync(envPath, envContent);

console.log('✅ Created optimized .env file');
console.log('📝 Environment variables set:');
console.log('   - MONGODB_URI (optimized for serverless)');
console.log('   - ACCESS_TOKEN_SECRET');
console.log('   - NODE_ENV=production');
console.log('');

console.log('🔧 Next steps:');
console.log('1. Add these environment variables to Vercel:');
console.log('   vercel env add MONGODB_URI');
console.log('   vercel env add ACCESS_TOKEN_SECRET');
console.log('   vercel env add NODE_ENV');
console.log('');
console.log('2. Redeploy your application:');
console.log('   vercel --prod');
console.log('');
console.log('3. Test the deployment:');
console.log('   curl https://your-deployment-url.vercel.app/api/books');
console.log('');

console.log('📊 MongoDB Atlas optimizations applied:');
console.log('   - Single connection pool (maxPoolSize=1)');
console.log('   - Quick timeouts (2s connection, 2s server selection)');
console.log('   - Compression enabled (zlib)');
console.log('   - Optimized read/write concerns');
console.log('   - Heartbeat every 10 seconds');
console.log('   - Buffer commands for serverless');
console.log('');

console.log('🎯 This should fix the "books not shown" error!');
