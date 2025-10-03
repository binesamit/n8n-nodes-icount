# הגדרת פרסום אוטומטי ל-npm

## מהו npm Publish Workflow?

Workflow אוטומטי שמפרסם גרסאות חדשות של הפקג' ל-npm בלחיצת כפתור או אוטומטית על release.

## שלבי ההתקנה

### שלב 1: יצירת npm Access Token

1. התחבר ל-[npmjs.com](https://www.npmjs.com/)
2. לחץ על התמונה שלך (למעלה מימין)
3. בחר **"Access Tokens"**
4. לחץ **"Generate New Token"**
5. בחר **"Classic Token"**
6. בחר את הסוג:
   - **Automation:** מומלץ - עובד עם GitHub Actions
   - או **Publish:** גם טוב
7. תן לו שם (לדוגמה: `github-actions-n8n-nodes-icount`)
8. לחץ **"Generate Token"**
9. **העתק את הטוקן מיד!** לא תוכל לראות אותו שוב

> **חשוב:** הטוקן מתחיל ב-`npm_...` - שמור אותו בטוח!

### שלב 2: הוספת הטוקן ל-GitHub Secrets

1. גש לרפוזיטורי ב-GitHub:
   ```
   https://github.com/binesamit/n8n-nodes-icount
   ```

2. לחץ על **"Settings"** (למעלה מימין)

3. בתפריט השמאלי:
   ```
   Security → Secrets and variables → Actions
   ```

4. לחץ על **"New repository secret"**

5. מלא:
   - **Name:** `NPM_TOKEN`
   - **Secret:** הדבק את הטוקן מ-npm

6. לחץ **"Add secret"**

### שלב 3: שימוש ב-Workflow

יש שתי דרכים לפרסם גרסה חדשה:

#### אופציה 1: פרסום ידני (Manual Dispatch)

1. גש ל-GitHub Actions:
   ```
   https://github.com/binesamit/n8n-nodes-icount/actions
   ```

2. בצד שמאל, בחר **"Publish to npm"**

3. לחץ **"Run workflow"** (כפתור ימינה)

4. בחר את ה-branch (בדרך כלל `master`)

5. הזן את מספר הגרסה (לדוגמה: `1.0.59`)

6. לחץ **"Run workflow"**

7. ה-workflow יריץ אוטומטית:
   - ✅ התקנת dependencies
   - ✅ הרצת כל הבדיקות
   - ✅ build (אם יש)
   - ✅ עדכון הגרסה ב-package.json
   - ✅ פרסום ל-npm
   - ✅ יצירת GitHub Release

#### אופציה 2: פרסום על Release (אוטומטי)

1. גש ל-Releases:
   ```
   https://github.com/binesamit/n8n-nodes-icount/releases
   ```

2. לחץ **"Create a new release"**

3. לחץ **"Choose a tag"** והזן גרסה חדשה:
   ```
   v1.0.59
   ```

4. לחץ **"Create new tag"**

5. תן כותרת ל-release:
   ```
   Release v1.0.59
   ```

6. הוסף תיאור של השינויים (Markdown):
   ```markdown
   ## What's Changed
   - Added comprehensive testing infrastructure (309 tests)
   - Added GitHub Actions CI/CD
   - Added Codecov integration
   - Improved documentation

   ## Coverage
   - Overall: ~90%
   - All tests passing ✅
   ```

7. לחץ **"Publish release"**

8. ה-workflow יתחיל אוטומטית ויפרסם ל-npm!

## מבנה הגרסאות (Semantic Versioning)

```
1.0.59
│ │ │
│ │ └─ PATCH: Bug fixes
│ └─── MINOR: New features (backwards compatible)
└───── MAJOR: Breaking changes
```

**דוגמאות:**
- `1.0.59` → `1.0.60` - תיקון באגים
- `1.0.59` → `1.1.0` - תכונה חדשה
- `1.0.59` → `2.0.0` - שינוי שובר תאימות

## מה ה-Workflow עושה?

### שלב 1: בדיקות (Always)
```bash
npm ci              # התקן dependencies נקיה
npm test            # הרץ את כל 309 הבדיקות
npm run build       # אם יש build script
```

### שלב 2: עדכון גרסה
```bash
npm version 1.0.59 --no-git-tag-version
```
זה מעדכן את ה-`package.json` עם הגרסה החדשה

### שלב 3: פרסום ל-npm
```bash
npm publish --access public
```
זה מפרסם את הפקג' ל-npm registry

### שלב 4: יצירת GitHub Release (אוטומטי)
- יוצר tag בגרסה החדשה
- יוצר release עם הערות גרסה
- קושר ל-CHANGELOG

## אימות שהפרסום עבד

### בדוק ב-npm:
```
https://www.npmjs.com/package/n8n-nodes-icount
```
תראה את הגרסה החדשה!

### בדוק ב-GitHub:
```
https://github.com/binesamit/n8n-nodes-icount/releases
```
תראה Release חדש!

### התקן את הגרסה החדשה:
```bash
npm install n8n-nodes-icount@1.0.59
```

## פתרון בעיות

### "npm publish failed - authentication error"
- ודא שהטוקן ב-GitHub Secrets נכון
- ודא שהשם הוא בדיוק `NPM_TOKEN`
- ודא שהטוקן מסוג **Automation** או **Publish**

### "Tests failed"
- ה-workflow לא יפרסם אם הבדיקות נכשלות
- תקן את הבדיקות ונסה שוב
- בדוק ב-Actions logs מה נכשל

### "Version already exists"
- לא ניתן לפרסם אותה גרסה פעמיים
- שנה את מספר הגרסה לגבוה יותר

### "Permission denied"
- ודא שיש לך הרשאות maintainer ב-npm
- ודא שה-package שייך לך או לארגון שלך

## Workflow הידני - צעד אחר צעד

```bash
# 1. ודא שהכל committed
git status

# 2. ודא שהבדיקות עוברות
npm test

# 3. עדכן CHANGELOG אם יש
# ערוך CHANGELOG.md עם השינויים

# 4. Push הכל
git add .
git commit -m "Prepare for v1.0.59"
git push

# 5. גש ל-GitHub Actions ולחץ:
# Actions → Publish to npm → Run workflow
# הזן: 1.0.59
# Run workflow

# 6. המתן שה-workflow יסתיים (~2-3 דקות)

# 7. בדוק שהגרסה עלתה:
# https://www.npmjs.com/package/n8n-nodes-icount

# 8. עדכן לוקאלית:
npm version 1.0.59
git push --tags
```

## Best Practices

### לפני פרסום:
1. ✅ וודא שכל הבדיקות עוברות
2. ✅ עדכן CHANGELOG.md
3. ✅ עדכן README אם צריך
4. ✅ בדוק שהגרסה נכונה
5. ✅ בדוק שאין breaking changes לא מתועדים

### אחרי פרסום:
1. ✅ בדוק ב-npm שהגרסה קיימת
2. ✅ התקן את הגרסה החדשה ובדוק שהיא עובדת
3. ✅ עדכן documentation אם צריך
4. ✅ הודע למשתמשים על גרסה חדשה

## קבצים רלוונטיים

- **`.github/workflows/publish.yml`** - Workflow הפרסום
- **`package.json`** - מכיל את מספר הגרסה
- **`CHANGELOG.md`** - תיעוד השינויים (אופציונלי)

## קישורים שימושיים

- **npm Package:** https://www.npmjs.com/package/n8n-nodes-icount
- **GitHub Releases:** https://github.com/binesamit/n8n-nodes-icount/releases
- **GitHub Actions:** https://github.com/binesamit/n8n-nodes-icount/actions
- **npm Tokens:** https://www.npmjs.com/settings/YOUR_USERNAME/tokens
- **GitHub Secrets:** https://github.com/binesamit/n8n-nodes-icount/settings/secrets/actions

## סיכום מהיר

```bash
# הגדרה חד-פעמית:
1. צור npm token → העתק
2. GitHub → Settings → Secrets → NPM_TOKEN
3. Done! ✅

# לפרסם גרסה חדשה:
GitHub Actions → Publish to npm → Run workflow
Version: 1.0.59 → Run ✅

# או:
GitHub → Releases → Create new release
Tag: v1.0.59 → Publish release ✅
```

---

**שאלות?** פתח issue או צור קשר!
