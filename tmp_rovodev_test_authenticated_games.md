# 測試已登入用戶的 /api/games API

## 步驟 1: 獲取 Session Cookie

1. 在瀏覽器中登入 hank 或 hank.tsai 用戶
2. 打開開發者工具 (F12)
3. 前往 Application/Storage 標籤
4. 找到 Cookies -> localhost:3000
5. 複製所有 cookie，特別是 Supabase 相關的 cookie (通常以 `sb-` 開頭)

## 步驟 2: 使用 Cookie 測試 API

```bash
# 替換 YOUR_COOKIES_HERE 為從瀏覽器複製的完整 cookie 字符串
curl -X POST http://localhost:3000/api/games \
  -H "Cookie: YOUR_COOKIES_HERE" \
  -F "name=測試遊戲_已登入" \
  -F "description=這是已登入用戶創建的測試遊戲" \
  -F "is_active=true" \
  -F "servers=[\"台服\", \"美服\"]" \
  -F "options[0][name]=100鑽石" \
  -F "options[0][price]=30" \
  -F "options[1][name]=500鑽石" \
  -F "options[1][price]=150" \
  -v
```

## 步驟 3: 獲取 Cookie 的簡單方法

在瀏覽器控制台中執行：
```javascript
console.log(document.cookie)
```

然後複製輸出的 cookie 字符串。

## 範例 (需要替換實際的 cookie)：

```bash
curl -X POST http://localhost:3000/api/games \
  -H "Cookie: sb-localhost-auth-token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...; sb-localhost-auth-token-code-verifier=abc123..." \
  -F "name=測試遊戲" \
  -F "description=測試描述" \
  -F "is_active=true" \
  -F "servers=[\"台服\"]" \
  -F "options[0][name]=基礎包" \
  -F "options[0][price]=10" \
  -v
```