# 🎨 Artiste Gallery — Premium Collection

A premium artiste browsing website built with **HTML**, **SCSS (CSS)**, and **JavaScript (jQuery)** featuring full **CRUD** operations powered by a [MockAPI](https://mockapi.io) backend.

## ✨ Features

- **Browse** artistes in an elegant card-based gallery layout
- **Search** artistes by name or genre in real-time
- **Filter** by genre and **sort** by name or date
- **Add** new artistes with image preview
- **Edit** existing artiste details
- **Delete** artistes with confirmation dialog
- **Toast notifications** for all CRUD operations
- **About page** with mission, stats, values, and team profiles
- **Contact page** with form, contact details, social links, and FAQ
- **Responsive** design for mobile, tablet, and desktop
- **Elegant dark & gold** color scheme with Playfair Display typography

## 📁 Project Structure

```
├── index.html          # Gallery page (main CRUD interface)
├── about.html          # About page (mission, stats, values, team)
├── contact.html        # Contact page (form, details, FAQ)
├── css/
│   ├── styles.scss     # SCSS source styles
│   └── styles.css      # Compiled CSS
├── js/
│   └── app.js          # jQuery application logic
├── package.json        # Node.js dependencies (Sass)
└── README.md
```

## 🚀 Getting Started

### 1. Set Up MockAPI Endpoint

1. Go to [MockAPI Dashboard](https://mockapi.io/dashboard) and sign in
2. Create a new resource with the endpoint name: `artiste`
3. Define these fields:
   - `name` (String) — Artiste's full name
   - `genre` (String) — Music genre (e.g., Pop, R&B, Jazz)
   - `image` (String) — URL to the artiste's photo
   - `bio` (String) — Short biography
   - `socials` (String) — Comma-separated social media URLs
4. Copy your API base URL and update `API_BASE` in `js/app.js` if needed

### 2. Compile SCSS (if making style changes)

```bash
npm install          # Install dependencies (Sass)
npx sass css/styles.scss css/styles.css   # Compile SCSS to CSS
```

### 3. Run the Application

Use any local HTTP server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx http-server -p 8080

# Using PHP
php -S localhost:8080
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

## 🎨 Tech Stack

- **HTML5** — Semantic markup
- **SCSS** — CSS preprocessor with variables, nesting, and BEM methodology
- **jQuery 3.7.1** — DOM manipulation and AJAX
- **MockAPI** — REST API mocking service
- **Google Fonts** — Playfair Display + Inter

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/artiste` | Fetch all artistes |
| POST | `/artiste` | Create a new artiste |
| PUT | `/artiste/:id` | Update an artiste |
| DELETE | `/artiste/:id` | Delete an artiste |
