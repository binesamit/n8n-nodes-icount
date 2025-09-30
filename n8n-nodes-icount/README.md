# n8n-nodes-icount

נוד קהילתי עבור n8n לעבודה עם מערכת iCount - מערכת הנהלת חשבונות ישראלית.

[n8n](https://n8n.io/) היא פלטפורמת אוטומציה עם [רישיון fair-code](https://docs.n8n.io/reference/license/).

## התקנה

1. פתח את n8n
2. עבור להגדרות (Settings) → Community Nodes
3. לחץ על "Install a community node"
4. הזן: `n8n-nodes-icount`
5. לחץ על Install

או עקוב אחר [מדריך ההתקנה](https://docs.n8n.io/integrations/community-nodes/installation/) במסמכי n8n.

## הגדרת Credentials (אישורי גישה)

לפני שתתחיל, תצטרך ליצור API Token ב-iCount:

1. היכנס ל-iCount
2. עבור להגדרות → API
3. צור API Token חדש
4. העתק את ה-Token

### יצירת Credentials ב-n8n

1. פתח את עורך ה-workflow
2. הוסף נוד iCount
3. לחץ על "Credential to connect with"
4. לחץ על "+ Create New"
5. הזן את ה-API Token שלך
6. שמור

**שים לב:** יש להשתמש ב-API Token ולא ב-cid/user/pass!

---

## משאבים (Resources)

### 📄 Document (מסמכים)

ניהול מסמכים חשבונאיים - חשבוניות, קבלות, הצעות מחיר ועוד.

### 👥 Customer (לקוחות)

ניהול לקוחות - יצירה, עדכון, שליפה ורשימות.

---

## פעולות Document (מסמכים)

### 1. Create - יצירת מסמך חדש

**מתי להשתמש:** כשאתה רוצה ליצור חשבונית, קבלה, הצעת מחיר או מסמך אחר.

**שדות חובה:**
- **Document Type (סוג מסמך):**
  - `invoice` - חשבונית מס
  - `invrec` - חשבונית מס קבלה
  - `receipt` - קבלה
  - `refund` - חשבונית זיכוי
  - `order` - הזמנה
  - `offer` - הצעת מחיר
  - `delivery` - תעודת משלוח
  - `deal` - עסקה

- **Client Name (שם לקוח):** שם מלא של הלקוח

**שדות אופציונליים חשובים:**
- **Client ID:** מזהה לקוח קיים במערכת
- **Email:** כתובת מייל לשליחת המסמך
- **VAT ID (ח.פ):** מספר עוסק מורשה
- **Phone:** טלפון
- **Address:** כתובת

**Items (פריטים):**
- **Description:** תיאור הפריט
- **Quantity:** כמות
- **Unit Price:** מחיר יחידה
- **VAT (מע"מ):** אחוז מע"מ (ברירת מחדל: 17)

**דוגמה:**
```
Document Type: invoice
Client Name: עמית כהן
Email: amit@example.com
VAT ID: 123456789
Items:
  - Description: שירותי ייעוץ
    Quantity: 10
    Unit Price: 500
    VAT: 17
```

**פלט:**
- `doc_id` - מזהה המסמך (UUID)
- `doc_number` - מספר המסמך
- `pdf_link` - קישור להורדת PDF

---

### 2. Update - עדכון מסמך קיים

**מתי להשתמש:** כשאתה רוצה לשנות פרטים במסמך קיים שעדיין לא סגור.

**שדות חובה:**
- **Document Type:** סוג המסמך (invoice, invrec, וכו')
- **Document Number:** מספר המסמך לעדכון

**שדות לעדכון:**
- **Client Name:** שם לקוח חדש
- **Items:** פריטים חדשים (יחליפו את הקיימים)
- **Email, Phone, Address:** פרטי קשר מעודכנים

**דוגמה:**
```
Document Type: invoice
Document Number: 2007
Client Name: עמית כהן (עודכן)
Email: amit.new@example.com
```

---

### 3. Cancel - ביטול מסמך

**מתי להשתמש:** כשאתה רוצה לבטל מסמך (ייווצר מסמך ביטול במערכת).

**שדות חובה:**
- **Document Type:** סוג המסמך
- **Document Number:** מספר המסמך לביטול

**שדות אופציונליים:**
- **Refund Credit Card (זיכוי כרטיס אשראי):**
  - `OFF` (כבוי) - רק ביטול המסמך
  - `ON` (דלוק) - גם ביטול עסקת אשראי אם קיימת
- **Cancellation Reason:** סיבת הביטול

**דוגמה:**
```
Document Type: invoice
Document Number: 2007
Refund Credit Card: OFF
Cancellation Reason: הלקוח ביקש לבטל
```

**חשוב:** אם Refund Credit Card מסומן, המערכת תנסה לבטל גם את עסקת כרטיס האשראי. אם אין עסקה - תקבל שגיאה.

---

### 4. Close - סגירת מסמך

**מתי להשתמש:** כשאתה רוצה לסגור מסמך (למשל, לסמן הזמנה כ"הושלמה").

**שדות חובה:**
- **Document Type:** סוג המסמך
- **Document Number:** מספר המסמך

**שדות אופציונליים:**
- **Based On Documents:** רשימת מסמכי בסיס (JSON)

**דוגמה:**
```
Document Type: order
Document Number: 1001
Based On Documents: [{"doctype": "offer", "docnum": 500}]
```

---

### 5. Get - קבלת מסמך ספציפי

**מתי להשתמש:** כשאתה רוצה לקבל את כל הפרטים של מסמך מסוים.

**שדות חובה:**
- **Document Type:** סוג המסמך
- **Document Number:** מספר המסמך

**דוגמה:**
```
Document Type: invoice
Document Number: 2007
```

**פלט:**
- כל פרטי המסמך
- פרטי לקוח
- פריטים
- מחירים וסכומים
- קישור ל-PDF

---

### 6. Search - חיפוש מסמכים

**מתי להשתמש:** כשאתה רוצה למצוא מסמכים לפי קריטריונים שונים.

**שדות:**
- **Return All:** האם להחזיר את כל התוצאות (עד 1000)
- **Max Results:** מספר מקסימלי של תוצאות (אם Return All כבוי)
- **Detail Level:** רמת פירוט (0-10)
  - `0` - בסיסי (doctype + docnum)
  - `1` - סטנדרטי (+ תאריך, לקוח, סכום)
  - `10` - מלא (הכל)

**פילטרים:**
- **Client ID:** חיפוש לפי מזהה לקוח
- **Client Name:** חיפוש לפי שם לקוח
- **Email:** חיפוש לפי מייל
- **Document Type:** סינון לפי סוג מסמך
- **Document Number:** מספר מסמך ספציפי
- **Document Status:**
  - `0` - פתוח
  - `1` - סגור
  - `2` - סגור חלקית
- **Start Date / End Date:** טווח תאריכים
- **Sort Field:** שדה למיון (תאריך, מספר, שם לקוח)
- **Sort Order:** סדר מיון (ASC / DESC)

**דוגמה - חיפוש חשבוניות של לקוח:**
```
Return All: true
Detail Level: Complete (Everything)
Filters:
  Client ID: 2
  Document Type: invoice
  Start Date: 2025-01-01
  Sort Field: תאריך הנפקה
  Sort Order: DESC
```

---

### 7. List - רשימת מסמכים

**מתי להשתמש:** כשאתה רוצה לקבל רשימה של כל המסמכים (ללא פילטרים).

**שדות:**
- **Return All:** האם להחזיר הכל
- **Limit:** מספר מקסימלי של תוצאות

**דוגמה:**
```
Return All: false
Limit: 50
```

---

### 8. Get Document URL - קבלת קישור למסמך

**מתי להשתמש:** כשאתה רוצה לקבל קישור לצפייה במסמך (PDF) ללא הורדה.

**שדות חובה:**
- **Document Type:** סוג המסמך
- **Document Number:** מספר המסמך

**שדות אופציונליים:**
- **Language:** שפה (עברית/אנגלית)
- **Original Document:** מקור או עותק
- **Hide ILS Prices:** להסתיר מחירי שקלים (למסמכים במטבע זר)
- **Document Language:** שפת המסמך (עוקפת את שפת ה-API)
- **Email To:** מייל למעקב

**דוגמה:**
```
Document Type: invoice
Document Number: 2007
Language: עברית
Original Document: true
```

**פלט:**
- `url` - קישור ישיר למסמך PDF

---

## פעולות Customer (לקוחות)

### 1. Upsert - יצירה או עדכון לקוח

**מתי להשתמש:** כשאתה רוצה להוסיף לקוח חדש או לעדכן קיים.

**איך זה עובד:**
- המערכת מחפשת לקוח לפי ח.פ או מייל
- אם נמצא - מעדכנת
- אם לא - יוצרת חדש

**שדות חובה:**
- **Client Name:** שם הלקוח

**שדות אופציונליים:**
- **Email:** מייל
- **Phone:** טלפון
- **Mobile:** נייד
- **VAT ID (ח.פ):** מספר עוסק
- **Address, City, Zip:** כתובת מלאה
- **Payment Terms:** תנאי תשלום (בימים)

**דוגמה:**
```
Client Name: חברת הדוגמה בע"מ
Email: info@example.co.il
Phone: 03-1234567
Mobile: 050-1234567
VAT ID: 123456789
Address: רחוב הדוגמה 1
City: תל אביב
Zip: 12345
Payment Terms: 30
```

**פלט:**
- `client_id` - מזהה הלקוח במערכת
- כל פרטי הלקוח

---

### 2. Get - קבלת לקוח לפי מזהה

**מתי להשתמש:** כשיש לך מזהה לקוח ואתה רוצה לקבל את כל הפרטים שלו.

**שדות חובה:**
- **Client ID:** מזהה הלקוח

**דוגמה:**
```
Client ID: 2
```

**פלט:**
- כל פרטי הלקוח
- היסטוריית פעילות
- מסמכים פתוחים

---

### 3. List - רשימת לקוחות

**מתי להשתמש:** כשאתה רוצה לקבל רשימה של כל הלקוחות במערכת.

**שדות:**
- **Return All:** האם להחזיר את כל הלקוחות
- **Limit:** מספר מקסימלי (אם Return All כבוי)

**דוגמה:**
```
Return All: true
```

**פלט:**
- מערך של כל הלקוחות עם כל הפרטים

---

### 4. Get Open Docs - קבלת מסמכים פתוחים ללקוחות

**מתי להשתמש:** כשאתה רוצה לראות אילו לקוחות יש להם מסמכים פתוחים (חובות).

**שדות אופציונליים:**
- **Client ID:** לסנן לקוח ספציפי
- **Options:**
  - **Document Type:** סוג מסמך ספציפי
  - **Get Items:** לכלול גם פרטי פריטים
  - **Email:** סינון לפי מייל
  - **Client Name:** סינון לפי שם

**דוגמה - כל המסמכים הפתוחים:**
```
(השאר ריק לקבלת הכל)
```

**דוגמה - מסמכים פתוחים של לקוח ספציפי:**
```
Client ID: 2
Options:
  Get Items: true
```

**פלט:**
- רשימת מסמכים פתוחים
- סכומים לתשלום
- פרטי לקוחות

---

## דוגמאות Workflow מלאות

### דוגמה 1: יצירת חשבונית מ-Webhook

```
1. Webhook (קבלת הזמנה)
   ↓
2. iCount - Upsert Customer
   - Client Name: {{ $json.customer_name }}
   - Email: {{ $json.customer_email }}
   - Phone: {{ $json.customer_phone }}
   ↓
3. iCount - Create Document
   - Document Type: invoice
   - Client ID: {{ $('iCount').item.json.client_id }}
   - Client Name: {{ $json.customer_name }}
   - Items:
     - Description: {{ $json.product_name }}
     - Quantity: {{ $json.quantity }}
     - Unit Price: {{ $json.price }}
   ↓
4. Send Email
   - To: {{ $json.customer_email }}
   - Subject: חשבונית מספר {{ $('iCount1').item.json.doc_number }}
   - Body: קישור למסמך: {{ $('iCount1').item.json.pdf_link }}
```

---

### דוגמה 2: דוח יומי של מסמכים פתוחים

```
1. Schedule Trigger (כל יום בבוקר)
   ↓
2. iCount - Get Open Docs
   - Return All: true
   ↓
3. Filter (רק חובות מעל 30 יום)
   ↓
4. Send Email (דוח למנהל)
```

---

### דוגמה 3: סנכרון לקוחות מ-CRM

```
1. HTTP Request (קבלת לקוחות מ-CRM)
   ↓
2. Loop Over Items
   ↓
3. iCount - Upsert Customer
   - Client Name: {{ $json.name }}
   - Email: {{ $json.email }}
   - Phone: {{ $json.phone }}
   - VAT ID: {{ $json.vat_id }}
   ↓
4. Set (שמירת מזהים)
```

---

### דוגמה 4: חיפוש וביטול חשבוניות

```
1. iCount - Search Documents
   - Document Type: invoice
   - Client ID: 2
   - Document Status: פתוח
   ↓
2. Filter (לפי קריטריון מסוים)
   ↓
3. iCount - Cancel
   - Document Type: invoice
   - Document Number: {{ $json.docnum }}
   - Cancellation Reason: ביטול אוטומטי
```

---

## שגיאות נפוצות ופתרונות

### שגיאה: "auth_required"
**פתרון:** ודא שה-API Token נכון ונוצר ב-iCount.

### שגיאה: "bad_doctype"
**פתרון:** השתמש בערכים הנכונים: invoice, invrec, receipt, refund, order, offer, delivery, deal

### שגיאה: "missing_client_name"
**פתרון:** חובה למלא שם לקוח בעת יצירת מסמך.

### שגיאה: "doc_not_found"
**פתרון:** ודא שמספר המסמך וסוג המסמך נכונים.

### רשימת לקוחות/מסמכים ריקה
**פתרון:** בדוק את ה-debug output בתגובה, ייתכן שהתשובה ממוקמת בשדה אחר.

---

## טיפים וטריקים

### שימוש ב-Expressions
```javascript
// שימוש בתאריך נוכחי
{{ $now.format('yyyy-MM-dd') }}

// חישוב סכום כולל
{{ $json.quantity * $json.price * 1.17 }}

// שרשור טקסט
{{ "חשבונית ללקוח " + $json.client_name }}
```

### Loop על פריטים
אם יש לך כמה פריטים, השתמש ב-Loop:
```
1. Set (הכן מערך פריטים)
2. Loop Over Items
3. iCount - Create Document (פריט אחד בכל פעם)
```

### שמירת תוצאות
השתמש ב-Set node לשמירת מזהים:
```javascript
{
  "invoice_id": "{{ $('iCount').item.json.doc_id }}",
  "invoice_number": "{{ $('iCount').item.json.doc_number }}",
  "pdf_url": "{{ $('iCount').item.json.pdf_link }}"
}
```

---

## משאבים נוספים

- [תיעוד API של iCount](https://apiv3.icount.co.il/docs)
- [תיעוד n8n](https://docs.n8n.io/)
- [דוגמאות Workflows](https://n8n.io/workflows)

## תמיכה

לבעיות ושאלות:
- [פתח issue ב-GitHub](https://github.com/binesamit/n8n-nodes-icount/issues)
- [קהילת n8n](https://community.n8n.io/)

## רישיון

MIT

---

**גרסה נוכחית:** 1.0.33

**עדכון אחרון:** ינואר 2025
