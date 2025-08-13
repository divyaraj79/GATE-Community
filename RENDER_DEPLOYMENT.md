# Render Deployment Guide

Simple deployment guide for deploying the Question Bank application to Render.

## 🚀 Quick Deploy to Render

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, etc.).

### 2. Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**
2. **Click "New +" and select "Web Service"**
3. **Connect your Git repository**
4. **Configure the service:**

   - **Name**: `question-bank` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Choose your plan (Free tier works for testing)

### 3. Environment Variables

Add these environment variables in Render:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
SESSION_SECRET=your_super_secure_session_secret
```

### 4. MongoDB Setup

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Add it to `MONGODB_URI` environment variable

#### Option B: Render MongoDB
1. Create a new MongoDB service in Render
2. Use the provided connection string

### 5. Deploy

Click "Create Web Service" and wait for deployment to complete.

## 🔒 Security Features

Your app includes:
- **Rate Limiting**: Prevents abuse
- **Input Validation**: Sanitizes user inputs
- **Security Headers**: Protects against common attacks
- **CSRF Protection**: Prevents cross-site request forgery

## 📊 Monitoring

- **Logs**: View in Render dashboard
- **Health Check**: Your app automatically logs requests and errors
- **Performance**: Built-in performance monitoring

## 🚨 Troubleshooting

### Common Issues

1. **Build Fails**
   - Check if all dependencies are in `package.json`
   - Verify Node.js version compatibility

2. **App Won't Start**
   - Check environment variables
   - Verify MongoDB connection string
   - Check logs in Render dashboard

3. **Database Connection Issues**
   - Ensure MongoDB is accessible from Render
   - Check IP whitelist settings
   - Verify connection string format

### Getting Help

1. Check Render logs in the dashboard
2. Verify environment variables
3. Test MongoDB connection locally first
4. Check the application logs for specific errors

## 📝 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment mode | Yes | `production` |
| `PORT` | Server port | Yes | `10000` |
| `MONGODB_URI` | MongoDB connection string | Yes | `mongodb+srv://...` |
| `SESSION_SECRET` | Session encryption key | Yes | `your-secret-key` |
| `LOG_LEVEL` | Logging level | No | `info` |

## 🎯 Next Steps

After successful deployment:

1. **Test your application** - Visit the provided URL
2. **Set up custom domain** (optional)
3. **Configure monitoring** (optional)
4. **Set up backups** for your database

## 📚 Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Node.js Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)




