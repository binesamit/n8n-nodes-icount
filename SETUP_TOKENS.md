# 🔧 הגדרת Tokens למערכת CI/CD

## סקירה מהירה

לאחר שדחפת את הקוד ל-GitHub, יש להגדיר 2 tokens כדי שהכל יעבוד:

1. **CODECOV_TOKEN** - לדיווח coverage אוטומטי
2. **NPM_TOKEN** - לפרסום גרסאות חדשות ל-npm

## ✅ משימות להשלמה

### 1️⃣ הגדרת Codecov (5 דקות)

**למה זה נחוץ?** Badge של coverage ב-README + דוחות מפורטים

📖 **מדריך מפורט:** [CODECOV_SETUP.md](CODECOV_SETUP.md)

**צעדים מהירים:**
```
1. https://codecov.io/ → Sign in with GitHub
2. Add repository: binesamit/n8n-nodes-icount
3. Settings → Copy Upload Token
4. GitHub → Settings → Secrets → Actions
5. New secret: CODECOV_TOKEN = <token>
```

### 2️⃣ הגדרת npm Publishing (5 דקות)

**למה זה נחוץ?** פרסום גרסאות חדשות בלחיצת כפתור

📖 **מדריך מפורט:** [NPM_PUBLISH_SETUP.md](NPM_PUBLISH_SETUP.md)

**צעדים מהירים:**
```
1. https://npmjs.com/ → Access Tokens
2. Generate New Token → Automation
3. Copy token (npm_...)
4. GitHub → Settings → Secrets → Actions
5. New secret: NPM_TOKEN = <token>
```

## 📍 GitHub Secrets Location

```
https://github.com/binesamit/n8n-nodes-icount/settings/secrets/actions
```

**צריך להוסיף:**
- ✅ `CODECOV_TOKEN` - מ-Codecov
- ✅ `NPM_TOKEN` - מ-npm

## 🎯 מה קורה אחרי ההגדרה?

### Coverage אוטומטי ✅
- כל push → GitHub Actions מריץ בדיקות
- Coverage מועלה ל-Codecov
- Badge ב-README מתעדכן
- דוחות מפורטים ב-Codecov

### פרסום אוטומטי ✅
- Actions → Publish to npm → Run workflow
- או: Create Release → אוטומטית נפרסם
- בדיקות → Build → Publish ל-npm

## 🔍 איך לבדוק שהכל עובד?

### בדיקת Codecov:
```bash
git commit -m "Test coverage" --allow-empty
git push
```
→ גש ל-Actions ובדוק שה-workflow עבר
→ גש ל-https://codecov.io/gh/binesamit/n8n-nodes-icount

### בדיקת npm Publish:
→ Actions → Publish to npm → Run workflow (בלי לפרסם באמת)
→ בדוק שהכל ירוק עד שלב הפרסום

## ⚠️ חשוב לדעת

### Codecov Token:
- ✅ חד-פעמי - מגדירים פעם אחת
- ✅ לא צריך לחדש
- ✅ אם Badge לא עובד → בדוק שהטוקן נכון

### npm Token:
- ⚠️ שמור בטוח - גישה לפרסום הפקג' שלך
- ⚠️ אל תשתף עם אף אחד
- ⚠️ אם חושד בפריצה → מחק ויצור חדש

## 📚 מדריכים מפורטים

| מדריך | תוכן | זמן |
|-------|------|-----|
| [CODECOV_SETUP.md](CODECOV_SETUP.md) | הגדרת Codecov + טיפים | 10 דק' |
| [NPM_PUBLISH_SETUP.md](NPM_PUBLISH_SETUP.md) | פרסום אוטומטי + ניהול גרסאות | 15 דק' |
| [TESTING.md](TESTING.md) | מערכת הבדיקות המלאה | 20 דק' |

## 🎓 למה זה שווה?

### לפני:
```
❌ coverage ידני
❌ npm publish ידני
❌ אין מעקב אחרי איכות הקוד
❌ אין automation
```

### אחרי:
```
✅ Coverage אוטומטי על כל PR
✅ פרסום בלחיצת כפתור
✅ Badges מתעדכנים אוטומטית
✅ מעקב אחרי trends
✅ דוחות מפורטים
✅ CI/CD מלא
```

## 🚀 התחל עכשיו

1. **תעדוף:** התחל עם Codecov (יותר חשוב)
2. **זמן:** 10-15 דקות סה"כ
3. **תועלת:** לכל החיים של הפרוייקט

### Codecov קודם (מומלץ):
1. פתח [CODECOV_SETUP.md](CODECOV_SETUP.md)
2. עקוב אחרי השלבים
3. בדוק שזה עובד

### npm Publishing אחר כך:
1. פתח [NPM_PUBLISH_SETUP.md](NPM_PUBLISH_SETUP.md)
2. עקוב אחרי השלבים
3. בדוק עם run workflow (בלי לפרסם)

## ❓ שאלות נפוצות

**Q: האם חובה להגדיר את שני ה-tokens?**
A: Codecov - מומלץ מאוד. npm - רק אם רוצה לפרסם גרסאות.

**Q: מה אם אני שוכח את הטוקן?**
A: אפשר תמיד ליצור חדש ולהחליף ב-GitHub Secrets.

**Q: זה בטוח לשים tokens ב-GitHub?**
A: כן! Secrets מוצפנים ולא נגישים לאף אחד.

**Q: כמה זמן זה לוקח?**
A: Codecov: 5 דקות. npm: 5 דקות. סה"כ: 10 דקות.

## 📞 עזרה

- **בעיות עם Codecov?** ראה [CODECOV_SETUP.md](CODECOV_SETUP.md) → פתרון בעיות
- **בעיות עם npm?** ראה [NPM_PUBLISH_SETUP.md](NPM_PUBLISH_SETUP.md) → פתרון בעיות
- **שאלות כלליות?** פתח issue ב-GitHub

---

**מוכן להתחיל?** 👉 [CODECOV_SETUP.md](CODECOV_SETUP.md)
