# 🎓 PeerWork — Campus Micro-Freelancing Marketplace

> A modern, peer-to-peer micro-freelancing marketplace exclusively engineered for university and college students. Students can post quick tasks, hire skilled peers, collaborate in realtime, and get paid with milestone campus escrow protection.

---

## 🌟 Key Highlights

- **University-Centric Profiles:** College email authentication (`.edu`, `.ac.in`), campus verification badge, branch, year of study, skills matrix, and peer reputation score.
- **The Gig Marketplace (Task Board):** Instant micro-task search, multi-category filtering (*Web Dev, Python/AI, UI/UX Design, Video & Reels, LaTeX Formatting, Assignment Help*), and budget range filters.
- **Streamlined Client Flow:** Multi-step modal to publish micro-tasks with budget, turnaround deadline, and required skills tags.
- **Proposal & Hiring System:** Freelancers submit pitches and delivery estimates; clients review applicant profiles, star ratings, and click **"Hire Peer"** to lock in escrow.
- **Dedicated Order Workspace & Collaboration Space:**
  - Milestone progress tracking (*Hired ➔ In Progress ➔ Deliverable Submitted ➔ Approved & Paid*).
  - Realtime project chat and discussion stream.
  - Deliverable link submission (GitHub PRs, Google Drive, Figma files, code sandbox).
  - **"Approve & Release Payment"** action with confetti celebration.
  - 5-Star peer rating and review feedback dialog.
- **Campus Wallet & Escrow Protocol:**
  - Mock/Integrated Escrow holding funds safely during project lifecycle.
  - Simulated UPI deposit (*GPay, PhonePe, Paytm*) and instant UPI withdrawal.
  - Full transaction ledger tracking credits, debits, and escrow releases.
- **Interactive Persona Switcher:** Switch between student client (Priya - SRCC), fullstack freelancer (Arnav - IIT Delhi), ML engineer (Rohit - DTU), UI designer (Ananya - NSUT), and video editor (Kabir - BITS Pilani) with 1 click to test both sides of the marketplace!

---

## 🛠️ Tech Stack & Architecture

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS with custom campus brand palette (`campus`, `brand`), subtle gradients, glassmorphism, and responsive dark/light mode.
- **State & Transitions:** React Context (`MarketplaceContext`), Framer Motion, Canvas Confetti.
- **Icons:** Lucide React.
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Triggers, Realtime).
- **Deployment:** Vercel ready.

---

## 🗄️ Database Schema & Supabase Setup

The complete migration file is located at:
`supabase/migrations/20250101000000_peerwork_schema.sql`

### Tables Included:
1. `profiles`: `id`, `email`, `full_name`, `college_name`, `branch`, `year`, `avatar_url`, `skills`, `role`, `bio`, `verified_student`, `rating_average`, `rating_count`, `wallet_balance`.
2. `gigs`: `id`, `client_id`, `title`, `description`, `category`, `required_skills`, `budget`, `currency`, `deadline`, `turnaround_time`, `status`.
3. `proposals`: `id`, `gig_id`, `freelancer_id`, `cover_message`, `bid_amount`, `estimated_days`, `status`.
4. `orders`: `id`, `gig_id`, `client_id`, `freelancer_id`, `proposal_id`, `amount`, `status`, `deliverable_note`, `deliverable_links`, `submitted_at`, `completed_at`.
5. `order_messages`: `id`, `order_id`, `sender_id`, `message`, `attachment_url`, `created_at`.
6. `reviews`: `id`, `order_id`, `reviewer_id`, `reviewee_id`, `rating`, `comment`.
7. `transactions`: `id`, `user_id`, `order_id`, `amount`, `type`, `description`.

### Applying Migrations:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in your Supabase dashboard.
3. Paste the contents of `supabase/migrations/20250101000000_peerwork_schema.sql` and click **Run**.
4. The tables, RLS policies, indexes, and triggers (`on_auth_user_created` & `update_profile_rating`) will be created automatically.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Set your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

*(Note: If you run PeerWork without Supabase credentials, it automatically activates Demo Campus Mode with rich preloaded university student data and interactive local state so everything works out of the box!)*

---

## 🚀 Getting Started Locally

```bash
cd peerwork
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deploying to Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. If located in a subfolder, set the Root Directory to `peerwork`.
4. Add the Environment Variables `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Click **Deploy**.
