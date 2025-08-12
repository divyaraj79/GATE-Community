# 🎓 GATE Question Bank - Crowdsourced Community Platform

A comprehensive, community-driven platform for GATE (Graduate Aptitude Test in Engineering) exam preparation. Built with modern web technologies, this application allows students, teachers, and experts to contribute, share, and practice high-quality exam questions.

## ✨ Features

### 🏠 **Home Dashboard**
- **Hero Section**: Engaging introduction with call-to-action buttons
- **Statistics**: Real-time display of total questions, users, and categories
- **Featured Questions**: Showcase of latest high-quality questions
- **Category Explorer**: Visual representation of subject areas
- **Community CTA**: Encourages user participation

### 📚 **Question Management**
- **Create Questions**: User-friendly form for adding new questions
- **Multiple Choice**: Support for 4-option MCQ format
- **Difficulty Levels**: Easy, Medium, and Hard categorization
- **Subject Categories**: Organized by GATE subjects
- **Tags & Metadata**: Rich tagging system for better searchability
- **Voting System**: Community-driven quality control

### 🔍 **Advanced Search & Filtering**
- **Full-Text Search**: Search across question titles, content, and tags
- **Category Filtering**: Filter by subject area
- **Difficulty Filtering**: Filter by question complexity
- **Year Filtering**: Filter by exam year
- **Real-time Results**: Instant search results with debouncing

### 👥 **User Management**
- **User Registration**: Simple signup process
- **Profile Management**: Customizable user profiles
- **Reputation System**: Gamified contribution tracking
- **Role-based Access**: Student, Teacher, Expert, and Admin roles
- **Activity Tracking**: Monitor user engagement

### 🏷️ **Category System**
- **Subject Organization**: Logical grouping of GATE subjects
- **Visual Icons**: Intuitive category representation
- **Question Counts**: Dynamic tracking of questions per category
- **Hierarchical Structure**: Support for parent-child categories

### 📱 **Responsive Design**
- **Mobile-First**: Optimized for all device sizes
- **Modern UI**: Clean, intuitive interface design
- **Accessibility**: WCAG compliant design elements
- **Cross-Browser**: Works on all modern browsers

## 🛠️ Technology Stack

### **Backend**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **EJS**: Embedded JavaScript templating
- **Express Sessions**: User session management
- **bcryptjs**: Password hashing and security

### **Frontend**
- **Bootstrap 5**: Responsive CSS framework
- **Font Awesome**: Icon library
- **Custom CSS**: Modern, responsive styling
- **Vanilla JavaScript**: Interactive functionality
- **Google Fonts**: Typography optimization

### **Database**
- **MongoDB Atlas**: Cloud-hosted database (recommended)
- **Local MongoDB**: Development database option
- **Mongoose**: MongoDB object modeling
- **Indexing**: Optimized search performance

## 🚀 Quick Start

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd crowd-question-bank
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Configuration**
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```env
MONGODB_URI=mongodb://localhost:27017/question-bank
SESSION_SECRET=your-secret-key-here
PORT=3000
```

### **4. Database Setup**

#### **Option A: Local MongoDB**
```bash
# Start MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

#### **Option B: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env`

### **5. Seed the Database (Optional)**
```bash
# Populate with sample data
node scripts/seed.js
```

### **6. Start the Application**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### **7. Access the Application**
Open your browser and navigate to:
```
http://localhost:3000
```

## 📊 Sample Data

The seed script creates:

### **Categories (6)**
- Computer Science
- Data Structures
- Algorithms
- Database Systems
- Operating Systems
- Computer Networks

### **Users (3)**
- **Dr. John Smith** (Teacher) - Algorithms & Data Structures expert
- **Raj Kumar** (Student) - Programming enthusiast
- **Priya Sharma** (Expert) - Database & Software Engineering

### **Questions (6)**
- Binary Search Time Complexity
- Priority Queue Data Structure
- Database Normalization
- Operating System Deadlocks
- TCP vs UDP Comparison
- Merge Sort Complexity

## 🔧 Configuration

### **MongoDB Atlas Setup**
1. **Create Cluster**: Choose your preferred cloud provider and region
2. **Database Access**: Create a database user with read/write permissions
3. **Network Access**: Add your IP address or `0.0.0.0/0` for all access
4. **Connection String**: Use the provided connection string format

### **Production Deployment**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/question-bank
SESSION_SECRET=very-long-random-secret-key
PORT=3000
```

## 📁 Project Structure

```
crowd-question-bank/
├── models/                 # Database models
│   ├── Question.js        # Question schema
│   ├── User.js           # User schema
│   └── Category.js       # Category schema
├── routes/                # API routes
│   ├── questions.js      # Question endpoints
│   ├── users.js          # User endpoints
│   └── categories.js     # Category endpoints
├── views/                 # EJS templates
│   ├── partials/         # Reusable components
│   ├── index.ejs         # Home page
│   └── layout.ejs        # Main layout
├── public/                # Static assets
│   ├── css/              # Stylesheets
│   └── js/               # JavaScript files
├── scripts/               # Utility scripts
│   └── seed.js           # Database seeding
├── server.js              # Main application file
├── package.json           # Dependencies and scripts
├── env.example            # Environment variables template
└── README.md              # This file
```

## 🎯 Usage Guide

### **For Students**
1. **Browse Questions**: Explore questions by category or difficulty
2. **Practice**: Answer questions and check explanations
3. **Search**: Find specific topics or concepts
4. **Contribute**: Add questions you encounter during studies

### **For Teachers**
1. **Create Questions**: Add high-quality exam questions
2. **Organize Content**: Use proper categories and tags
3. **Review**: Monitor question quality and student feedback
4. **Engage**: Participate in community discussions

### **For Administrators**
1. **Moderate Content**: Review and approve questions
2. **Manage Users**: Monitor user activity and reputation
3. **Analytics**: Track platform usage and engagement
4. **Maintenance**: Ensure system stability and performance

## 🔒 Security Features

- **Password Hashing**: bcryptjs for secure password storage
- **Session Management**: Secure user sessions with MongoDB storage
- **Input Validation**: Server-side validation for all user inputs
- **CSRF Protection**: Built-in Express.js security features
- **Rate Limiting**: Protection against abuse (can be added)

## 🚀 Deployment Options

### **Heroku**
```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set SESSION_SECRET=your-secret

# Deploy
git push heroku main
```

### **Vercel**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### **DigitalOcean App Platform**
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with one click

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **GATE Community**: For inspiration and feedback
- **Open Source Contributors**: For the amazing tools and libraries
- **Educational Institutions**: For supporting open education initiatives

## 📞 Support

- **Issues**: Report bugs and request features via GitHub Issues
- **Discussions**: Join community discussions on GitHub
- **Email**: Contact the development team for support

## 🔮 Future Enhancements

- **Quiz Mode**: Timed practice sessions
- **Progress Tracking**: Individual learning analytics
- **Mobile App**: Native mobile application
- **AI Integration**: Smart question recommendations
- **Collaborative Features**: Question review and editing
- **Export Options**: PDF and print-friendly formats
- **API Access**: Public API for third-party integrations

---

**Built with ❤️ for the GATE community**

*Empowering students through collaborative learning and knowledge sharing.*
