# 🚀 دليل نشر شركة النسيج الذهبي على GitHub Pages

## خطوات النشر السريعة:

### الخطوة 1️⃣: إعداد GitHub
```bash
# 1. اذهب إلى https://github.com/new
# 2. أنشئ repository جديد باسم: b2b-apparel-erp
# 3. اختر Public (عشان GitHub Pages)
# 4. انسخ رابط الـ repo (HTTPS أو SSH)
```

### الخطوة 2️⃣: تهيئة Git محلياً
```bash
cd "C:\Users\Laptop Code\Desktop\b2b-apparel-erp"

# إذا كان git ليس مهيأ:
git init
git add .
git commit -m "Initial commit: Golden Weave ERP System"

# ربط الـ remote repository
git remote add origin https://github.com/YOUR_USERNAME/b2b-apparel-erp.git
git branch -M main
git push -u origin main
```

### الخطوة 3️⃣: تثبيت gh-pages
```bash
npm install --save-dev gh-pages
```

### الخطوة 4️⃣: تحديث homepage في package.json
✅ تم بالفعل! قط استبدل `YOUR_USERNAME` بـ github username بتاعك:
```json
"homepage": "https://YOUR_USERNAME.github.io/b2b-apparel-erp",
```

### الخطوة 5️⃣: النشر على GitHub Pages
```bash
npm run deploy
```

---

## ✅ بعد النشر:

### تفعيل GitHub Pages:
```
1. روح GitHub repo → Settings
2. اختر Pages (يسار الـ sidebar)
3. Source: Select branch "gh-pages"
4. Save
```

### الموقع سيكون متاح على:
```
https://YOUR_USERNAME.github.io/b2b-apparel-erp
```

---

## 📝 المتطلبات:

- ✅ Node.js و npm مثبتة
- ✅ Git مثبت
- ✅ GitHub Account

---

## 🔄 التحديثات المستقبلية:

بعدها كل مرة بتعدّل الكود:
```bash
# 1. عمل commit:
git add .
git commit -m "تحديث معين"

# 2. push للـ main:
git push origin main

# 3. نشر على GitHub Pages:
npm run deploy
```

---

## 🎯 الهيكل الحالي:

```
b2b-apparel-erp/
├── src/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── types.ts
│   ├── data.ts
│   └── App.tsx
├── public/
│   ├── index.html
│   ├── sewing-machine-logo.png
│   └── favicon.ico
├── package.json (✅ محدث للنشر)
├── DEPLOYMENT_GUIDE.md (هذا الملف)
└── README.md
```

---

## 📊 معلومات المشروع:

- **الاسم**: شركة النسيج الذهبي
- **النوع**: ERP System لمصانع الملابس
- **التقنية**: React 19 + TypeScript + Tailwind CSS
- **الحالة**: جاهز للنشر ✅

---

## 💡 نصائح:

1. استخدم `.gitignore` لتجنب رفع `node_modules`:
```bash
# تحقق أن .gitignore موجود
echo "node_modules/" >> .gitignore
```

2. إذا أردت استخدام custom domain:
- أضف ملف `CNAME` في `public/` بـ domain بتاعك

3. للتطوير المستمر:
```bash
git push origin main  # تحديث الـ main
npm run deploy        # نشر على GitHub Pages
```

---

## 🆘 مشاكل شائعة:

### المشكلة: "gh-pages command not found"
**الحل**: 
```bash
npm install --save-dev gh-pages
```

### المشكلة: "Remote origin already exists"
**الحل**:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/b2b-apparel-erp.git
```

### المشكلة: الموقع فارغ أو 404
**الحل**:
1. تحقق أن branch "gh-pages" موجود
2. تحقق settings → Pages
3. قد تأخذ 5-10 دقائق لأول مرة

---

**✨ شركة النسيج الذهبي جاهزة للعالم! 🌍**
