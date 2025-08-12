# 🚀 Quick Startup Guide

## Prerequisites
- ✅ Node.js installed (v14 or higher)
- ✅ MongoDB running (local or Atlas)
- ✅ Dependencies installed (`npm install` completed)

## 🚀 Quick Start

### 1. Create Environment File
Create a `.env` file in the root directory with:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/question-bank

# Session Secret
SESSION_SECRET=gate-question-bank-dev-secret-key-2024

# Server Port
PORT=3000

# Node Environment
NODE_ENV=development
```

### 2. Start MongoDB
**Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod
```

**Option B: Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: MongoDB Atlas**
- Use your Atlas connection string in `.env`

### 3. Seed Database (Optional)
```bash
node scripts/seed.js
```

### 4. Start Application
```bash
# Development mode
npm run dev

# OR Production mode
npm start
```

### 5. Access Application
Open browser: `http://localhost:3000`

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running
- Verify connection string in `.env`
- Ensure network access (for Atlas)

### Port Already in Use
- Change PORT in `.env` file
- Or kill process using port 3000

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📱 Sample Users (after seeding)
- **Teacher**: smith@university.edu / password123
- **Student**: raj@student.edu / password123  
- **Expert**: priya@techcorp.com / password123

## 🎯 Next Steps
1. Explore the application
2. Add your own questions
3. Customize categories
4. Deploy to production

---
**Need help?** Check the main README.md for detailed documentation.
