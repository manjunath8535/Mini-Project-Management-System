# 🌐 Preview of Website.

https://github.com/user-attachments/assets/77939287-89d2-4973-b7f7-40a601c82b5a

---

# Tech stacks of this Project.
| Tech Stack Name  | Version |
| ------------- | ------------- |
| React  | 18.3.1  |
| Django  | 6.0  |

---

# To run the project follow below instructions.

## Firstly clone this project with this below command.
```
git clone
```

## 📱 To run Frontend code. Execute below commands.
```
cd frontend
npm install
```
## After executing npm install. Run this below command to start the frontend react project.
```
node node_modules/vite/bin/vite.js
```
or
```
npm run dev
```
* After this can you see the react app is running on port: 5173
---

# 🗃️ To run Backend code. Follow below instructions.

Create a database in **pgAdmin** with a name and give password.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/a32653d2-2aff-43d3-b1f5-f63da397d1c1" />

## Now update the details for database in _settings.py_ file.
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'DB_Name',        
        'USER': 'postgres',         
        'PASSWORD': 'DB_Password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

## After updating the setting.py file. Execute below commands.
```
cd backend
# To the backend project execute below command:
python manage.py runserver.
```
* Now visit localhost:5173 and check the website.
---

## 🚀 Future Improvements & Roadmap

While the current MVP demonstrates the core architecture, here is how I plan to scale the application for production:

### 1. Authentication & User Identity (OAuth2)
*   **Current State:** The app uses a hardcoded demo user (`user@voiceai.com`).
*   **Improvement:** Implement **Google OAuth2** (via `django allauth`) to fetch the user's real name and profile picture. This ensures that comments display the actual author's identity (e.g., "Manjunath") instead of a generic placeholder.

### 2. Multi Tenancy & Data Isolation by User
*   **Current State:** Projects are isolated by Organization slug.
*   **Improvement:** Link Organizations to specific User Accounts. When a user logs in via email, they will strictly see only the projects associated with their account or team, ensuring complete data privacy similar to GitHub or Jira.

### 3. Role Based Access Control (RBAC)
*   **Improvement:** Introduce a `Team` and `Role` model.
    *   **Assigning Work:** Tasks can be assigned to specific roles (e.g., "Frontend Team").
    *   **Permission Scoping:** Implement permissions where only members of the assigned role can reply to or mark a task as "Done". Read only access would be granted to others.

### 4. Advanced Task Scheduling & Notifications
*   **Improvement:** Integrate **Celery with Redis** for background processing.
    *   **Timeline Alerts:** Automatically trigger email or WebSocket notifications when a task deadline is approaching or overdue.
    *   **Daily Digest:** Send a morning summary of assigned tasks to every team member.

---

* And finally, I want to mention that while I built this demo alone, I know that I can't build a perfect product by myself.
* I strongly believe that teamwork is what makes a product truly _complete_. I need code reviews, security suggestions, and feedback from others to make an application truly fast, safe, and secure.
* That collaborative environment is exactly what I'm looking for, and why I want to join VoiceAIWrapper.
