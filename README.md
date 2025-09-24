# 🚀 EduTrack – Automated Student Attendance & Analytics System  

![EduTrack Banner](https://via.placeholder.com/1200x300.png?text=EduTrack+-+Smart+Education)  

## 📌 Overview  
EduTrack is our solution for **Smart India Hackathon 2025** under the *Smart Education* theme.  
It’s more than just an attendance tracker — **EduTrack unifies attendance, academic management, and analytics into a single, scalable platform**.  

---

## 🎯 Problem Statement  
- Manual attendance is time-consuming, error-prone, and easily manipulated through proxy.  
- Teachers lose valuable teaching time, while institutions lack transparency and real-time insights.  

---

## 💡 Our Solution  
**EduTrack** automates attendance and empowers colleges with actionable data:  

- 📲 **Dynamic QR-Based Attendance** – secure, proxy-proof, instant logging.  
- 📊 **Role-Based Dashboards** – separate views for students, teachers, and admins.  
- ☁️ **Supabase-Powered Backend** – real-time sync, authentication, encrypted storage.  
- 📈 **Analytics & Reports** – attendance trends, defaulters, performance insights.  
- 🧾 **Integrated Services** – timetable, grades, fees, library, assignments, messaging.  
- 📚 **Digital Library** – downloadable study materials & resources.  
- 🏗️ **Scalable & Cloud-Ready** – built with modern, serverless architecture.  

---

## 🛠️ Tech Stack  
**Frontend:** React (Vite) + TypeScript + TailwindCSS + ShadCN/UI  
**Backend & DB:** Supabase (Auth + Postgres)  
**Deployment:** Vercel  
**Tools:** GitHub, VS Code  
**Hardware:** Smartphones (QR scanning), Teacher’s PC/Laptop  

---

## ⚙️ Features  

### ✅ Completed  
- Full database with RLS (row-level security).  
- Authentication & role-based access.  
- Teacher Dashboard: attendance, subject management, lecture scheduling.  
- Admin Dashboard: CRUD for students, teachers, classes, subjects.  
- Real-time statistics & analytics cards.  
- Clean UI with responsive design, validation, and notifications.  

### 🚧 In Progress  
- Timetable management.  
- Reports & advanced analytics.  
- Messaging system (announcements + queries).  
- Digital library with downloadable books/resources.  
- Assignments (upload, submit, grade).  

---

## 🖥️ System Workflow  
1. Teacher generates a dynamic QR → displayed in class.  
2. Student scans QR → attendance recorded instantly in Supabase.  
3. Data syncs in real-time → shown in dashboards.  
4. Reports/alerts → help teachers and admins make decisions.  

---

## 🌟 Impact & Benefits  
- **Students:** Transparent records, fairness, quick access to academic info.  
- **Teachers:** Hours saved, instant analytics, focus more on teaching.  
- **Institutions:** Higher accountability, reduced errors, better engagement.  
- **Wider:** Digital transformation in education, low-cost scalable solution.  

---

## 📸 Screenshots (add later)  
> Replace with actual dashboard/QR scan images for visual impact.  

---

## 🚀 Getting Started  

```bash
# Clone the repo
git clone https://github.com/ASTA91-GIT/Edu-Track-2.git

# Navigate into project
cd Edu-Track-2

# Install dependencies
npm install

# Set up environment variables for Supabase (see .env.example)

# Run the dev server
npm run dev
```

---

## 📂 Project Structure  

```
EduTrack-2/
├── src/               # React + TypeScript frontend
├── public/            # Static assets (PDFs, icons, etc.)
├── supabase/          # DB setup, policies
├── package.json
├── tailwind.config.ts
└── README.md
```

---

## 🔮 Future Roadmap  
- AI-powered insights (predict defaulters, academic risks).  
- Parent dashboards with real-time notifications.  
- ERP/LMS integration via APIs.  
- Mobile app version.  

---

## 👥 Team Quantum Coders  
- **Ram Khandekar** – Team Leader / Full Stack Dev  
- [Add other members here with roles]  

---

## 📜 License  
MIT License. Free to use and adapt with credit.  
