// 驗證信箱的模板
function mailTemplate(verificationUrl: string) {
  return `<div style="max-width: 600px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
          <div style="background-color: #2563eb; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">歡迎加入師大崇德社集點系統</h1>
          </div>
          
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="font-size: 16px; line-height: 1.6;">您好！感謝您註冊我們的系統。</p>
            <p style="font-size: 16px; line-height: 1.6;">請點擊下方的按鈕以完成電子郵件驗證：</p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #2563eb; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
                 立即驗證帳號
              </a>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.6;">
              如果按鈕無法運作，請複製並貼上以下連結至瀏覽器：<br>
              <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="font-size: 12px; color: #999; text-align: center;">
              此郵件由系統自動發送，請勿直接回覆。<br>
              如果您沒有註冊此帳號，請忽略此郵件。
            </p>
          </div>
        </div>
      `;
}

// 註冊狀態的模板
function statusTemplate(
  title: string,
  message: string,
  buttonText: string,
  url: string,
  isSuccess: boolean,
) {
  return `
    <!DOCTYPE html>
    <html lang="zh-TW">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <title>${title}</title>
    </head>
    <body class="bg-gray-50 flex items-center justify-center min-h-screen">
        <div class="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
            <div class="mb-6">
                ${
                  isSuccess
                    ? `<div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                      <svg class="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>`
                    : `<div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                      <svg class="h-10 w-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>`
                }
            </div>
            <h1 class="text-2xl font-bold text-gray-900 mb-2">${title}</h1>
            <p class="text-gray-600 mb-8">${message}</p>
            <a href="${url}" class="inline-block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200">
                ${buttonText}
            </a>
        </div>
    </body>
    </html>
  `;
}

export { mailTemplate, statusTemplate };
