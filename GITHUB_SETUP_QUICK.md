# ⚡ خطوات النشر السريعة (5 دقائق)

## الخطوات الضرورية فقط:

### 1️⃣ **إنشاء Repo على GitHub**
- اذهب: https://github.com/new
- الاسم: `b2b-apparel-erp`
- اختر: Public
- انسخ الرابط

### 2️⃣ **في Terminal/PowerShell**
```powershell
cd "C:\Users\Laptop Code\Desktop\b2b-apparel-erp"

# إذا كان git ليس مهيأ:
git init
git add .
git commit -m "Initial commit: شركة النسيج الذهبي"

# ربط الـ repo (استبدل USERNAME بـ github username بتاعك)
git remote add origin https://github.com/USERNAME/b2b-apparel-erp.git
git branch -M main
git push -u origin main
```

### 3️⃣ **تثبيت gh-pages**
```powershell
npm install --save-dev gh-pages
```

### 4️⃣ **تعديل package.json**
```json
// الخط 5 في package.json، استبدل USERNAME:
"homepage": "https://USERNAME.github.io/b2b-apparel-erp",
```

### 5️⃣ **النشر**
```powershell
npm run deploy
```

### 6️⃣ **تفعيل GitHub Pages**
- روح: https://github.com/USERNAME/b2b-apparel-erp/settings/pages
- اختر branch: `gh-pages`
- اضغط Save

---

## ✅ تم!

الموقع سيكون على:
```
https://USERNAME.github.io/b2b-apparel-erp
```

---

## 📝 ملاحظات:
- استبدل `USERNAME` بـ github username بتاعك
- قد تأخذ 5 دقائق لأول مرة
- كل push على `main` بينشر تلقائياً

---

**🎉 شركة النسيج الذهبي على الإنترنت!**
