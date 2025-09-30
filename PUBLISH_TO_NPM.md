# מדריך פרסום החבילה ל-NPM

## שלב 1: עדכון פרטי החבילה

ערוך את הקובץ `n8n-nodes-icount/package.json`:

1. **שם החבילה** (שורה 2):
   - אם השם `n8n-nodes-icount` תפוס, שנה ל: `@your-username/n8n-nodes-icount`

2. **פרטי המחבר** (שורות 15-17):
   ```json
   "author": {
     "name": "Your Name",
     "email": "your.email@example.com"
   }
   ```

3. **Repository** (שורות 19-22):
   ```json
   "repository": {
     "type": "git",
     "url": "git+https://github.com/yourusername/n8n-nodes-icount.git"
   }
   ```

## שלב 2: בדיקה מקומית

החבילה כבר מקושרת ל-N8N המקומי שלך!

להרצת N8N המקומי:
```bash
cd "c:\Projects\Nodes icount\n8n-local"
npx n8n
```

או הרץ את הקובץ:
```
start-n8n.bat
```

N8N יפתח בכתובת: http://localhost:5678

## שלב 3: התחברות ל-NPM

```bash
npm login
```

הזן את פרטי החשבון שלך ב-npmjs.com

## שלב 4: בדיקה לפני פרסום

```bash
cd "c:\Projects\Nodes icount\n8n-nodes-icount"
npm pack
```

זה ייצור קובץ `.tgz` שמראה בדיוק מה יפורסם.

## שלב 5: פרסום ל-NPM

```bash
cd "c:\Projects\Nodes icount\n8n-nodes-icount"
npm publish
```

אם השם תפוס, פרסם עם scope:
```bash
npm publish --access public
```

## שלב 6: עדכון גרסאות עתידיות

לאחר שינויים:

1. עדכן את הגרסה:
   ```bash
   npm version patch   # 1.0.0 -> 1.0.1
   npm version minor   # 1.0.0 -> 1.1.0
   npm version major   # 1.0.0 -> 2.0.0
   ```

2. בנה מחדש:
   ```bash
   npm run build
   ```

3. פרסם:
   ```bash
   npm publish
   ```

## שלב 7: התקנה על ידי משתמשים

לאחר הפרסום, משתמשי N8N יוכלו להתקין:

```bash
npm install n8n-nodes-icount
```

או דרך ממשק N8N:
1. Settings > Community Nodes
2. Install a community node
3. הזן: `n8n-nodes-icount`

## קישורים חשובים

- **NPM Package**: https://www.npmjs.com/package/n8n-nodes-icount
- **N8N Docs**: https://docs.n8n.io/integrations/community-nodes/
- **iCount API**: https://apiv3.icount.co.il/docs

## בעיות נפוצות

### שם החבילה תפוס
שנה את השם בpackage.json ל:
```json
"name": "@your-username/n8n-nodes-icount"
```

### שגיאת Authentication
ודא שהתחברת:
```bash
npm whoami
```

### החבילה לא מופיעה ב-N8N
ודא שהשם מתחיל ב `n8n-nodes-` והקובץ package.json מכיל:
```json
"keywords": [
  "n8n-community-node-package"
]
```