# Deploying CCC Nepal Trekking Tours to Namecheap (Subdomain + Subfolder via GitHub & cPanel)

This repository is pre-configured for **Namecheap cPanel** with **Setup Node.js App** (`server.js`) and **PostgreSQL** (`database/nepal_trekking_tours.sql`).

---

## Step 1: Create the Subdomain Mapped to a Subfolder in Namecheap cPanel
1. Log in to your **Namecheap cPanel**.
2. Go to **Domains** → **Domains** (or **Subdomains**).
3. Click **Create A New Domain**:
   - **Domain**: e.g., `trekking.yourdomain.com`
   - **Share document root**: **Uncheck** *"Share document root (/home/USER/public_html)"*
   - **Document Root (Subfolder)**: Set to `/home/YOUR_CPANEL_USER/trekking.yourdomain.com` (or `/public_html/trekking`)
4. Click **Submit**.
5. *(If using Namecheap BasicDNS/AdvancedDNS)*: Ensure an **A Record** (or **CNAME**) for `trekking` points to your Namecheap hosting server IP.

---

## Step 2: Clone This GitHub Repository into the Subfolder in cPanel
1. In Namecheap cPanel, open **Files** → **Git™ Version Control** (or open **Advanced** → **Terminal**).
2. Click **Create**:
   - **Clone a Repository**: Toggle **ON**
   - **Clone URL**: `https://github.com/rsmridha/ccc-nepal-trekking-tours.git`
   - **Repository Path**: `/home/YOUR_CPANEL_USER/trekking.yourdomain.com`
   - **Repository Name**: `ccc-nepal-trekking-tours`
3. Click **Create** to pull all project files directly from GitHub into your Namecheap subfolder.

---

## Step 3: Set Up the PostgreSQL Database in Namecheap cPanel
1. In cPanel, go to **Databases** → **PostgreSQL Databases**.
2. **Create Database**: e.g., `YOURUSER_nepal_trekking`
3. **Create PostgreSQL User**: e.g., `YOURUSER_admin` with a strong password.
4. **Add User to Database**: Select the user and database and click **Submit**.
5. **Import the Database**:
   - **Option A (phpPgAdmin)**: Open **phpPgAdmin** in cPanel → select your database → click **SQL** → upload and execute `database/nepal_trekking_tours.sql`.
   - **Option B (cPanel Terminal / Node Migration)**: Once `DATABASE_URL` is set in Step 4, run `npm run db:migrate` to automatically create and seed all tables.

---

## Step 4: Configure & Start the Node.js App in Namecheap cPanel
1. In cPanel, go to **Software** → **Setup Node.js App** → click **Create Application**:
   - **Node.js version**: Select `20.x` or `22.x`
   - **Application mode**: `Production`
   - **Application root**: `trekking.yourdomain.com` (the subfolder where Git cloned the repo)
   - **Application URL**: Select your subdomain (`trekking.yourdomain.com`)
   - **Application startup file**: `server.js`
2. Scroll down to **Environment variables** and add:
   - `DATABASE_URL` = `postgresql://YOURUSER_admin:YOUR_DB_PASS@localhost:5432/YOURUSER_nepal_trekking`
   - `NEXT_PUBLIC_SITE_URL` = `https://trekking.yourdomain.com`
3. Click **Create**.
4. Click **Run NPM Install** (or open cPanel **Terminal**, enter the virtual environment command shown at the top of the Node.js App page, and run):
   ```bash
   npm install
   npm run build
   ```
5. Click **Restart** in **Setup Node.js App**.

Your full website (`https://trekking.yourdomain.com`) and protected Admin WebApp CMS (`https://trekking.yourdomain.com/admin/login`) are now live!
