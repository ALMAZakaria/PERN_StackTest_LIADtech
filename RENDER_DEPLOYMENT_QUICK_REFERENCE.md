# 🚀 Render Deployment Quick Reference

## ⚠️ Critical Settings

| Setting | Value |
|---------|-------|
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

## 🔑 Required Environment Variables

```
NODE_ENV=production
PORT=10000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
REDIS_URL=your_redis_connection_string
```

## 📋 Deployment Checklist

- [ ] Root Directory set to `backend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] Environment variables configured
- [ ] Database created on Render
- [ ] Redis instance created on Render

## 🗄️ Post-Deployment Database Setup

After successful deployment, run:

```bash
# In Render shell or via SSH
npm run post-deploy
```

Or manually:

```bash
npx prisma generate
npx prisma migrate deploy
```

## 🔍 Health Check

Test your deployment:
```
https://your-service.onrender.com/health
https://your-service.onrender.com/status
https://your-service.onrender.com/
```

## ❌ Common Issues

1. **"Could not read package.json"** → Set Root Directory to `backend`
2. **Build fails** → Check TypeScript compilation locally first
3. **Database connection fails** → Verify DATABASE_URL and permissions
4. **Port issues** → Use `process.env.PORT` in your code

## 📚 Full Documentation

See `RENDER_DEPLOYMENT_GUIDE.md` for complete instructions.
