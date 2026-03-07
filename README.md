# 🌸 Women's Day Wish Experience

A beautifully animated web experience that celebrates Women's Day with personalized messages, interactive mini-games, and storytelling.

Each recipient receives a unique link that opens a cinematic celebration page created specifically for them.



# ✨ Features

- 🎬 Cinematic landing sequence
- 📖 Storytelling journey
- ⭐ Self-reflection rating game
- 🎡 Personality wheel
- 💌 Hidden appreciation scratch cards
- 📸 Personalized message section
- 🎵 Background music experience
- 🌸 Floating petals and parallax animations
- 📱 Instagram story generator
- 🔗 Shareable wish links
- 📷 QR code sharing
- 🧑‍💻 Admin dashboard to create and manage wishes



# 🧰 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- TailwindCSS
- Framer Motion

### Backend
- Supabase (PostgreSQL database)
- Supabase Storage (image uploads)

### Other Libraries
- Canvas Confetti
- QRCode.react
- React Router
- Lucide Icons

### Deployment
- Vercel


# 📂 Project Structure
```
src
│
├── components
│   ├── wish
│   │   ├── HeroSection
│   │   ├── StoryMode
│   │   ├── RatingGame
│   │   ├── FunPersonalityWheel
│   │   ├── HiddenAppreciation
│   │   ├── StoryGenerator
│   │   ├── PersonalMessage
│   │   └── LandingSequence
│
├── pages
│   ├── AdminDashboard
│   └── WishExperience
│
├── lib
│   ├── supabase.ts
│   └── wishStore.ts
│
└── components/ui
├── FloatingPetals
├── ParallaxPetals
└── FloatingGradient

```


# 🚀 Getting Started

## 1️⃣ Clone the repository

```

git clone [https://github.com/your-username/womens-day-wishes.git](https://github.com/your-username/womens-day-wishes.git)
cd womens-day-wishes

```



## 2️⃣ Install dependencies

```

npm install

```



## 3️⃣ Setup environment variables

Create a `.env` file in the root folder.

```

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_ADMIN_PASSWORD=your_admin_password

```

You can find Supabase values in:

```

Supabase Dashboard
→ Project Settings
→ API

```



## 4️⃣ Run the project

```

npm run dev

```

Open in browser:

```

[http://localhost:8080](http://localhost:8080)

```



# 🗄 Supabase Database Setup

Create a table called:

```

wishes

```

### Columns

| Column | Type |
|------|------|
| id | text |
| name | text |
| nickname | text |
| photo | text |
| message | text |
| compliment_style | text |
| relationship | text |
| appreciation_images | text[] |
| created_at | bigint |



# 🔐 Enable Row Level Security

Add the following policies.

### Allow Read

```

create policy "Allow public read"
on public.wishes
for select
to public
using (true);

```

### Allow Insert

```

create policy "Allow public insert"
on public.wishes
for insert
to public
with check (true);

```

### Allow Update

```

create policy "Allow public update"
on public.wishes
for update
to public
using (true)
with check (true);

```

### Allow Delete

```

create policy "Allow public delete"
on public.wishes
for delete
to public
using (true);

```



# 📦 Deployment

Recommended platform:

```

Vercel

```

### Steps

1. Push project to GitHub
2. Import repository into Vercel
3. Add environment variables
4. Deploy



# Fix React Router refresh issue

Create a file:

```

vercel.json

```
```

{
"rewrites": [
{ "source": "/(.*)", "destination": "/" }
]
}

```



# 🔐 Admin Dashboard

Access the admin panel:

```

/admin

```

Login using the password defined in:

```

VITE_ADMIN_PASSWORD

```

Admin features:

- Create wish
- Edit wish
- Delete wish
- Upload images
- Generate QR code
- Share via WhatsApp


# 📱 User Flow

```

Admin creates wish
↓
Wish saved in Supabase
↓
Shareable link generated
↓
Recipient opens link
↓
Personalized Women's Day experience starts

```


# 🎨 UI Highlights

The app focuses on storytelling and emotional engagement through:

- Smooth scroll reveal animations
- Parallax petals
- Floating gradient backgrounds
- Interactive mini-games
- Cinematic transitions

The goal is to create a **memorable celebration experience rather than a simple message page.**




# 🙌 Acknowledgements

- Supabase
- Framer Motion
- TailwindCSS
- Vite
- Lucide Icons

