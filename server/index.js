import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import notesRoutes from "./routes/notesRoutes.js";
import pomodoroRoutes from "./routes/pomodoroRoutes.js";
import timeMachineRoutes from "./routes/timeMachineRoutes.js";
import config from "./config/config.js";
import agenda from "./config/agenda.js"; 
import scheduleEventNotifications from './scheduler/eventNotificationScheduler.js';
import scheduleTaskNotifications  from './scheduler/taskNotificationScheduler.js';
import scheduleOverdueTasks  from './scheduler/overdueTaskScheduler.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("./uploads"));

// Registrazione delle rotte
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/pomodoro", pomodoroRoutes);
app.use("/api/time-machine", timeMachineRoutes);


const startAgenda = async () => {
  try {
    await agenda.start();
    await scheduleEventNotifications();
    await scheduleTaskNotifications();
    await scheduleOverdueTasks();
    console.log("Agenda workers started.");
  } catch (error) {
    console.error("Failed to start Agenda:", error.message);
  }
};

connectDB().then(() => {
  startAgenda().then(() => {
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }).catch(err => {
    console.error("Error starting agenda:", err);
  });
});