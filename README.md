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
# 啟動開發伺服器
npm run dev   

# 使用 Prettier 格式化程式碼文件
npm run format

# 開啟 GUI 瀏覽器查看/編輯資料庫內容
npx prisma studio  
```