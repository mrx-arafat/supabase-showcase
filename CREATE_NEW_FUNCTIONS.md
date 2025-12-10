# 📚 How to Create New Edge Functions

Great! You now have a working Edge Function system. Here's how to create more functions.

## 🚀 Quick Summary

Your self-hosted Supabase is set up to run Edge Functions from:
```
/var/www/supabase-g7cn.x-cloud.app/volumes/functions/
```

---

## 📝 Step-by-Step: Create a New Function

### **Example: Create a "send-welcome-email" Function**

#### **Step 1: Create the Folder on Your Server**

SSH into your server and run:
```bash
mkdir /var/www/supabase-g7cn.x-cloud.app/volumes/functions/send-welcome-email
```

#### **Step 2: Create the index.ts File**

```bash
touch /var/www/supabase-g7cn.x-cloud.app/volumes/functions/send-welcome-email/index.ts
```

#### **Step 3: Edit and Add Your Code**

Open the file and paste your function code. Example:

```typescript
console.log("send-welcome-email function loaded");

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    // TODO: Add your email sending logic here
    // Example: connect to SendGrid, Resend, or your email service

    const message = `Welcome email sent to ${email}`;

    return new Response(
      JSON.stringify({
        success: true,
        message,
        timestamp: new Date().toISOString(),
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to send email",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
```

#### **Step 4: Save the File**

Use your preferred editor:
```bash
nano /var/www/supabase-g7cn.x-cloud.app/volumes/functions/send-welcome-email/index.ts
# Edit the file, then press Ctrl+X, Y, Enter to save
```

#### **Step 5: Restart the Functions Service**

**This is CRITICAL!** Every time you add or modify a function, you must restart:

```bash
# Navigate to your Supabase directory
cd /var/www/supabase-g7cn.x-cloud.app

# Restart the functions service
sudo docker compose restart functions --no-deps
```

Wait a few seconds for the service to restart.

#### **Step 6: Test Your Function**

**Via curl:**
```bash
curl -X POST "https://supabase-g7cn.x-cloud.app/functions/v1/send-welcome-email" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John"}'
```

**Via your app:**
```typescript
const { data, error } = await fetch(
  'https://supabase-g7cn.x-cloud.app/functions/v1/send-welcome-email',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'user@example.com', name: 'John' })
  }
).then(r => r.json());
```

---

## 📂 Your Function Structure

```
/var/www/supabase-g7cn.x-cloud.app/volumes/functions/
├── hello-world/
│   └── index.ts          (Your working function!)
├── send-welcome-email/
│   └── index.ts          (Example: to be created)
└── [your-function]/
    └── index.ts          (Add more functions this way)
```

---

## 🔗 Function Endpoints

Once deployed, access any function at:
```
https://supabase-g7cn.x-cloud.app/functions/v1/{function-name}
```

Examples:
- `https://supabase-g7cn.x-cloud.app/functions/v1/hello-world`
- `https://supabase-g7cn.x-cloud.app/functions/v1/send-welcome-email`
- `https://supabase-g7cn.x-cloud.app/functions/v1/process-payment`

---

## 📋 Common Function Examples

### **Example 1: Send Email**

```typescript
Deno.serve(async (req) => {
  const { to, subject, body } = await req.json();
  
  // Use SendGrid, Resend, or your email service
  // await sendEmail(to, subject, body);
  
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
```

### **Example 2: Call External API**

```typescript
Deno.serve(async (req) => {
  const { query } = await req.json();
  
  const response = await fetch('https://api.example.com/search', {
    method: 'POST',
    body: JSON.stringify({ query })
  });
  
  const data = await response.json();
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
```

### **Example 3: Database Operation**

```typescript
Deno.serve(async (req) => {
  const { userId, action } = await req.json();
  
  // Connect to your database
  // const result = await db.query(...);
  
  return new Response(JSON.stringify({ result: "success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
});
```

---

## ✅ Checklist for New Functions

```
☐ Create folder: /var/www/supabase-g7cn.x-cloud.app/volumes/functions/{name}/
☐ Create file: index.ts inside that folder
☐ Add function code
☐ Save the file
☐ Restart functions: sudo docker compose restart functions --no-deps
☐ Wait 5-10 seconds for restart
☐ Test with curl or your app
☐ Done!
```

---

## 🐛 Troubleshooting

### Function returns 404
- Function folder doesn't exist
- Service hasn't restarted yet
- Check folder name matches URL

### Function returns 500
- Syntax error in your code
- Check server logs for details
- Verify Deno syntax is correct

### Changes not taking effect
- **FORGOT TO RESTART!** This is the most common issue
- Always run: `sudo docker compose restart functions --no-deps`
- Wait 5-10 seconds after restart

---

## 📝 Important Reminders

✅ **Always restart the service** after creating/modifying functions
✅ **Use correct folder structure** - Name must match URL
✅ **Include CORS headers** - Needed for browser requests
✅ **Handle errors gracefully** - Return proper HTTP status codes
✅ **Test before deploying** - Use curl to test first

---

## 📞 Need Help?

Check your function logs:
```bash
# View recent logs
sudo docker compose logs functions --tail=50

# Follow logs in real-time
sudo docker compose logs -f functions
```

---

**Now you're ready to create unlimited Edge Functions!** 🚀
