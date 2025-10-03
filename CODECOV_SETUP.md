# הגדרת Codecov עבור n8n-nodes-icount

## מהו Codecov?

Codecov הוא שירות שמעקב אחרי ה-code coverage של הפרוייקט שלך ומציג אותו בצורה ויזואלית.
הוא מספק badges, דוחות, ו-PR comments עם מידע על ה-coverage.

## שלבי ההתקנה

### שלב 1: הרשמה ל-Codecov

1. גש ל-[Codecov](https://codecov.io/)
2. לחץ על **"Sign up"**
3. בחר **"Sign in with GitHub"**
4. אשר את הגישה עבור GitHub

### שלב 2: הוספת הפרוייקט

1. אחרי ההתחברות, תגיע לדף Repositories
2. חפש את **"n8n-nodes-icount"** ברשימה
3. אם הוא לא מופיע, לחץ על **"Add new repository"**
4. סמן את **"binesamit/n8n-nodes-icount"**
5. לחץ **"Setup repo"**

### שלב 3: קבלת ה-Upload Token

1. בדף הפרוייקט ב-Codecov, לחץ על **"Settings"**
2. בצד שמאל, לחץ על **"General"**
3. גלול למטה ל-**"Repository Upload Token"**
4. העתק את הטוקן (לדוגמה: `abc123def456...`)

> **חשוב:** שמור את הטוקן הזה בטוח - תצטרך אותו בשלב הבא!

### שלב 4: הוספת הטוקן ל-GitHub Secrets

1. גש לרפוזיטורי ב-GitHub:
   ```
   https://github.com/binesamit/n8n-nodes-icount
   ```

2. לחץ על **"Settings"** (למעלה מימין)

3. בתפריט השמאלי, גלול למטה ולחץ על:
   ```
   Security → Secrets and variables → Actions
   ```

4. לחץ על **"New repository secret"**

5. מלא את הפרטים:
   - **Name:** `CODECOV_TOKEN`
   - **Secret:** הדבק את הטוקן שהעתקת מ-Codecov

6. לחץ **"Add secret"**

### שלב 5: אימות התקנה

1. עשה שינוי קטן בקוד (לדוגמה, הוסף רווח ב-README)
2. עשה commit ו-push:
   ```bash
   git add .
   git commit -m "Test Codecov integration"
   git push
   ```

3. גש ל-GitHub Actions:
   ```
   https://github.com/binesamit/n8n-nodes-icount/actions
   ```

4. תראה שה-workflow "Tests" רץ

5. אחרי שה-workflow מסתיים בהצלחה, גש ל-Codecov:
   ```
   https://codecov.io/gh/binesamit/n8n-nodes-icount
   ```

6. תראה את דוח ה-coverage!

## Badge ב-README

ה-badge כבר מוגדר ב-README:
```markdown
[![codecov](https://codecov.io/gh/binesamit/n8n-nodes-icount/branch/master/graph/badge.svg)](https://codecov.io/gh/binesamit/n8n-nodes-icount)
```

הוא יתעדכן אוטומטית אחרי כל push!

## מה קורה אוטומטית?

### על כל Push/PR:
1. ✅ GitHub Actions מריץ את כל הבדיקות
2. ✅ Jest מייצר coverage report (בתיקיית `coverage/`)
3. ✅ Coverage מועלה ל-Codecov
4. ✅ Codecov מנתח את הקבצים
5. ✅ Badge ב-README מתעדכן
6. ✅ (על PR) Codecov מוסיף comment עם השינויים

### דוח Coverage כולל:
- 📊 אחוז Coverage כולל
- 📈 Coverage לפי קובץ
- 🔍 שורות שלא מכוסות
- 📉 השוואה בין commits
- 🎯 Coverage trends לאורך זמן

## קבצים שנוצרו

1. **`.github/workflows/test.yml`**
   - עודכן עם Codecov action v5
   - משתמש ב-`CODECOV_TOKEN` מ-secrets
   - מעלה `lcov.info` ל-Codecov

2. **`.codecov.yml`**
   - הגדרות Codecov
   - Target coverage: 85%
   - Threshold: 2%
   - Ignore של test files

## פתרון בעיות נפוצות

### הטוקן לא עובד
- ודא שהעתקת את הטוקן המלא מבלי רווחים
- ודא שהשם ב-GitHub Secrets הוא בדיוק `CODECOV_TOKEN`

### Coverage לא מועלה
- בדוק שה-workflow עבר בהצלחה ב-Actions
- בדוק ב-logs של ה-step "Upload coverage to Codecov"
- ודא שקובץ `coverage/lcov.info` נוצר

### Badge לא מתעדכן
- המתן 5-10 דקות אחרי ה-commit
- רענן את הדף עם Ctrl+F5
- נקה cache של הדפדפן

## קישורים שימושיים

- **Codecov Dashboard:** https://codecov.io/gh/binesamit/n8n-nodes-icount
- **GitHub Actions:** https://github.com/binesamit/n8n-nodes-icount/actions
- **תיעוד Codecov:** https://docs.codecov.com/docs
- **GitHub Secrets:** https://github.com/binesamit/n8n-nodes-icount/settings/secrets/actions

## סיכום צעדים

```bash
# 1. הרשם ל-Codecov (אם עוד לא)
https://codecov.io/signup

# 2. הוסף את הפרוייקט ב-Codecov
# 3. העתק את הטוקן מ-Codecov Settings

# 4. הוסף ל-GitHub Secrets:
# Settings → Secrets and variables → Actions → New repository secret
# Name: CODECOV_TOKEN
# Value: <הטוקן_שהעתקת>

# 5. עשה push (זה יפעיל את ה-workflow)
git push

# 6. בדוק ב-Codecov שה-coverage עלה
https://codecov.io/gh/binesamit/n8n-nodes-icount
```

## תוצאה סופית

אחרי ההתקנה, תקבל:
- ✅ Badge ירוק ב-README עם אחוז ה-coverage
- ✅ דוח coverage מפורט ב-Codecov
- ✅ Comments אוטומטיים על Pull Requests
- ✅ מעקב אחרי שינויים ב-coverage לאורך זמן

---

**עזרה נוספת?**
פתח issue ב-GitHub או צור קשר עם המתחזק.
