## Database Initialization
```bash
# 根據 Schema 產生 Prisma Client
npx prisma generate 

# 將 Schema 同步至本地資料庫 
npx prisma db push 

# 執行 prisma/seed.ts 
npx prisma db seed  
```

## Development Commands
```bash
# 根據 schema.prisma 產生 Prisma Client
npx prisma generate 

# 建立並同時套用資料庫遷移
npx prisma migrate dev --name <migration name>

# 刪除並重建資料庫
npx prisma migrate reset

# 部署資料庫遷移
npx prisma migrate deploy
```