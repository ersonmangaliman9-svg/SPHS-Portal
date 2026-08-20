import React, { useState, useMemo, useContext, createContext, useEffect, useRef, useId } from "react";
import {
  Home, Megaphone, BookOpen, ClipboardList, HelpCircle, GraduationCap, CalendarCheck,
  CalendarDays, PartyPopper, FolderOpen, MessageSquare, Bell, ListChecks, User, Settings,
  Search, Menu, X, Sun, Moon, Monitor, Plus, Check, ChevronRight, ChevronLeft, Pin,
  Paperclip, Clock, MapPin, Users, BarChart3, TrendingUp, Filter, Trash2, Edit2, Download,
  Send, CheckCircle2, AlertCircle, Circle, LogOut, Award, Building2, UserCog, FileText,
  Upload, ArrowLeft, MoreVertical, School, ShieldCheck, ChevronDown, RefreshCw
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
  PieChart, Pie, Cell, RadialBarChart, RadialBar,
} from "recharts";

/* ============================================================================
   DESIGN TOKENS — "Report Card" identity: pine green + honor gold, ledger
   typography, stamp-style status badges, dashed perforation borders.
============================================================================ */

const LIGHT = {
  bg: "#F5F2EA", surface: "#FFFFFF", surface2: "#EEE8D8", ink: "#1B2A22",
  inkSoft: "#5C6B60", line: "#DCD3BC", pine: "#1F5C4C", pineDeep: "#123B31",
  pineSoft: "#E4EFE9", gold: "#B9861E", goldSoft: "#F4E5BA", red: "#AE4335",
  redSoft: "#F6E0DB", blue: "#3A6EA5", blueSoft: "#E1EAF3",
};
const DARK = {
  bg: "#0F1714", surface: "#17221D", surface2: "#1E2A24", ink: "#EDEAE0",
  inkSoft: "#93A69A", line: "#2A3A32", pine: "#4C9C80", pineDeep: "#2F6B55",
  pineSoft: "#1B3129", gold: "#E1B84C", goldSoft: "#2E2712", red: "#E08B79",
  redSoft: "#3A2320", blue: "#7FA9D4", blueSoft: "#1C2A38",
};

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
    .spnhs-root { font-family: 'Inter', system-ui, sans-serif; }
    .spnhs-display { font-family: 'Fraunces', Georgia, serif; }
    .spnhs-mono { font-family: 'IBM Plex Mono', monospace; }
    .spnhs-root * { box-sizing: border-box; }
    .spnhs-root ::-webkit-scrollbar { width: 8px; height: 8px; }
    .spnhs-root ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 8px; }
    .spnhs-perf {
      background-image: radial-gradient(circle, var(--line) 1.4px, transparent 1.6px);
      background-size: 10px 100%;
      background-position: top center;
    }
    .spnhs-stamp {
      transform: rotate(-3deg);
      border: 2px solid currentColor;
      letter-spacing: 0.06em;
    }
    .spnhs-fade-in { animation: spnhsFade .25s ease both; }
    @keyframes spnhsFade { from { opacity:0; transform: translateY(4px);} to {opacity:1; transform: translateY(0);} }
    .spnhs-btn { transition: transform .12s ease, opacity .12s ease, background .12s ease; }
    .spnhs-btn:active { transform: scale(0.97); }
    .spnhs-card-hover { transition: box-shadow .15s ease, transform .15s ease; }
    .spnhs-card-hover:hover { transform: translateY(-2px); }
    input, textarea, select, button { font-family: inherit; }
    input::placeholder, textarea::placeholder { color: var(--inkSoft); opacity: 0.7; }
    .spnhs-focus:focus-visible { outline: 2px solid var(--pine); outline-offset: 2px; }
  `}</style>
);

/* ============================================================================
   MOCK DATA
============================================================================ */

const TEACHERS = [
  { id: "T-001", name: "Juan Dela Cruz", subject: "Mathematics", email: "j.delacruz@sphs.edu.ph", advisory: "Grade 10 - Rizal", status: "Active" },
  { id: "T-002", name: "Ana Bautista", subject: "Science", email: "a.bautista@sphs.edu.ph", advisory: "Grade 9 - Bonifacio", status: "Active" },
  { id: "T-003", name: "Ramon Villanueva", subject: "English", email: "r.villanueva@sphs.edu.ph", advisory: "Grade 10 - Aguinaldo", status: "Active" },
  { id: "T-004", name: "Carla Mendoza", subject: "Filipino", email: "c.mendoza@sphs.edu.ph", advisory: "Grade 8 - Luna", status: "Active" },
  { id: "T-005", name: "Leo Fernandez", subject: "Araling Panlipunan", email: "l.fernandez@sphs.edu.ph", advisory: "Grade 11 - STEM", status: "Active" },
  { id: "T-006", name: "Grace Ramos", subject: "MAPEH", email: "g.ramos@sphs.edu.ph", advisory: "Grade 11 - HUMSS", status: "Active" },
  { id: "T-007", name: "Mark Villareal", subject: "TLE / Computer", email: "m.villareal@sphs.edu.ph", advisory: "Grade 7 - Ilang-Ilang", status: "On Leave" },
  { id: "T-008", name: "Rosario Aquino", subject: "Mathematics", email: "r.aquino@sphs.edu.ph", advisory: "Grade 9 - Silang", status: "Active" },
  { id: "T-009", name: "Bayani Cruz", subject: "Science", email: "b.cruz@sphs.edu.ph", advisory: "Grade 7 - Sampaguita", status: "Active" },
  { id: "T-010", name: "Trisha Padua", subject: "English", email: "t.padua@sphs.edu.ph", advisory: "Grade 8 - Del Pilar", status: "Active" },
  { id: "T-011", name: "Noel Santiago", subject: "Filipino", email: "n.santiago@sphs.edu.ph", advisory: "Grade 12 - STEM", status: "Active" },
  { id: "T-012", name: "Ivy Concepcion", subject: "Araling Panlipunan", email: "i.concepcion@sphs.edu.ph", advisory: "Grade 12 - ABM", status: "Active" },
];

const STUDENTS = [
  // Grade 10 - Rizal
  { id: "2026-00123", name: "Maria Santos", section: "Grade 10 - Rizal", avg: 92.3, attendance: 96, status: "Active" },
  { id: "2026-00124", name: "Jose Ramirez", section: "Grade 10 - Rizal", avg: 88.1, attendance: 94, status: "Active" },
  { id: "2026-00125", name: "Angel Cruz", section: "Grade 10 - Rizal", avg: 90.7, attendance: 98, status: "Active" },
  { id: "2026-00126", name: "Paolo Garcia", section: "Grade 10 - Rizal", avg: 85.4, attendance: 89, status: "Active" },
  { id: "2026-00127", name: "Bianca Torres", section: "Grade 10 - Rizal", avg: 94.6, attendance: 99, status: "Active" },
  { id: "2026-00128", name: "Nico Aquino", section: "Grade 10 - Rizal", avg: 79.8, attendance: 82, status: "Active" },
  { id: "2026-00129", name: "Ella Navarro", section: "Grade 10 - Rizal", avg: 91.2, attendance: 95, status: "Active" },
  { id: "2026-00130", name: "Miguel Torres", section: "Grade 10 - Rizal", avg: 87.0, attendance: 91, status: "Active" },
  { id: "2026-00131", name: "Sofia Reyes", section: "Grade 10 - Rizal", avg: 93.5, attendance: 97, status: "Active" },
  { id: "2026-00132", name: "Carlo Padilla", section: "Grade 10 - Rizal", avg: 82.9, attendance: 88, status: "Active" },
  { id: "2026-00133", name: "Trisha Domingo", section: "Grade 10 - Rizal", avg: 89.9, attendance: 93, status: "Active" },
  // Grade 10 - Aguinaldo
  { id: "2026-01001", name: "Patricia Uy", section: "Grade 10 - Aguinaldo", avg: 90.1, attendance: 95, status: "Active" },
  { id: "2026-01002", name: "Jhun Rosario", section: "Grade 10 - Aguinaldo", avg: 84.6, attendance: 88, status: "Active" },
  { id: "2026-01003", name: "Samantha Diaz", section: "Grade 10 - Aguinaldo", avg: 92.8, attendance: 97, status: "Active" },
  { id: "2026-01004", name: "Enzo Marasigan", section: "Grade 10 - Aguinaldo", avg: 81.3, attendance: 86, status: "Active" },
  // Grade 9 - Bonifacio
  { id: "2026-00201", name: "Rafael Ocampo", section: "Grade 9 - Bonifacio", avg: 86.2, attendance: 92, status: "Active" },
  { id: "2026-00202", name: "Kim Villareal", section: "Grade 9 - Bonifacio", avg: 90.0, attendance: 95, status: "Active" },
  { id: "2026-00203", name: "Kenneth Alvarez", section: "Grade 9 - Bonifacio", avg: 83.4, attendance: 89, status: "Active" },
  { id: "2026-00204", name: "Michelle Corpuz", section: "Grade 9 - Bonifacio", avg: 91.6, attendance: 96, status: "Active" },
  // Grade 9 - Silang
  { id: "2026-00901", name: "Vince Mangubat", section: "Grade 9 - Silang", avg: 87.7, attendance: 93, status: "Active" },
  { id: "2026-00902", name: "Charlene Ferrer", section: "Grade 9 - Silang", avg: 92.4, attendance: 97, status: "Active" },
  { id: "2026-00903", name: "Bea Lozada", section: "Grade 9 - Silang", avg: 80.9, attendance: 85, status: "Active" },
  { id: "2026-00904", name: "Ronnie Castañeda", section: "Grade 9 - Silang", avg: 88.0, attendance: 91, status: "Active" },
  // Grade 8 - Luna
  { id: "2026-00801", name: "Yna Castillo", section: "Grade 8 - Luna", avg: 89.3, attendance: 94, status: "Active" },
  { id: "2026-00802", name: "Brix Salazar", section: "Grade 8 - Luna", avg: 85.0, attendance: 90, status: "Active" },
  { id: "2026-00803", name: "Camille Rosales", section: "Grade 8 - Luna", avg: 93.1, attendance: 98, status: "Active" },
  { id: "2026-00804", name: "Justin Panganiban", section: "Grade 8 - Luna", avg: 78.6, attendance: 83, status: "Active" },
  // Grade 8 - Del Pilar
  { id: "2026-00811", name: "Riza Custodio", section: "Grade 8 - Del Pilar", avg: 90.8, attendance: 95, status: "Active" },
  { id: "2026-00812", name: "Emman Velasco", section: "Grade 8 - Del Pilar", avg: 84.2, attendance: 88, status: "Active" },
  { id: "2026-00813", name: "Louise Marquez", section: "Grade 8 - Del Pilar", avg: 91.5, attendance: 96, status: "Active" },
  { id: "2026-00814", name: "Adrian Bagsic", section: "Grade 8 - Del Pilar", avg: 82.0, attendance: 87, status: "Active" },
  // Grade 7 - Sampaguita
  { id: "2026-00701", name: "Kyla Mercado", section: "Grade 7 - Sampaguita", avg: 88.9, attendance: 93, status: "Active" },
  { id: "2026-00702", name: "Ronel Bautista", section: "Grade 7 - Sampaguita", avg: 85.7, attendance: 90, status: "Active" },
  { id: "2026-00703", name: "Faith Domingo", section: "Grade 7 - Sampaguita", avg: 92.0, attendance: 97, status: "Active" },
  { id: "2026-00704", name: "Julian Pascual", section: "Grade 7 - Sampaguita", avg: 79.4, attendance: 84, status: "Active" },
  // Grade 7 - Ilang-Ilang
  { id: "2026-00711", name: "Angelica Robles", section: "Grade 7 - Ilang-Ilang", avg: 90.6, attendance: 95, status: "Active" },
  { id: "2026-00712", name: "Dave Manalo", section: "Grade 7 - Ilang-Ilang", avg: 83.1, attendance: 88, status: "Active" },
  { id: "2026-00713", name: "Precious Aguilar", section: "Grade 7 - Ilang-Ilang", avg: 94.2, attendance: 99, status: "Active" },
  { id: "2026-00714", name: "Kurt Espino", section: "Grade 7 - Ilang-Ilang", avg: 81.8, attendance: 86, status: "Active" },
  // Grade 11 - STEM
  { id: "2026-00301", name: "Diego Salvador", section: "Grade 11 - STEM", avg: 88.8, attendance: 90, status: "Disabled" },
  { id: "2026-00302", name: "Faye Almario", section: "Grade 11 - STEM", avg: 91.4, attendance: 96, status: "Active" },
  { id: "2026-00303", name: "Gio Trinidad", section: "Grade 11 - STEM", avg: 84.9, attendance: 89, status: "Active" },
  { id: "2026-00304", name: "Nadine Bartolome", section: "Grade 11 - STEM", avg: 93.0, attendance: 98, status: "Active" },
  // Grade 11 - HUMSS
  { id: "2026-01101", name: "Marco Villagracia", section: "Grade 11 - HUMSS", avg: 86.5, attendance: 91, status: "Active" },
  { id: "2026-01102", name: "Isabel Ramos", section: "Grade 11 - HUMSS", avg: 90.9, attendance: 95, status: "Active" },
  { id: "2026-01103", name: "Timothy Cabrera", section: "Grade 11 - HUMSS", avg: 80.5, attendance: 85, status: "Active" },
  { id: "2026-01104", name: "Angela Buenaventura", section: "Grade 11 - HUMSS", avg: 92.7, attendance: 97, status: "Active" },
  // Grade 12 - STEM
  { id: "2026-01201", name: "Karen Sison", section: "Grade 12 - STEM", avg: 89.6, attendance: 94, status: "Active" },
  { id: "2026-01202", name: "Paul Anthony Lim", section: "Grade 12 - STEM", avg: 85.3, attendance: 89, status: "Active" },
  { id: "2026-01203", name: "Michaela Bautista", section: "Grade 12 - STEM", avg: 93.8, attendance: 98, status: "Active" },
  { id: "2026-01204", name: "Renz Villaflor", section: "Grade 12 - STEM", avg: 82.4, attendance: 87, status: "Active" },
  // Grade 12 - ABM
  { id: "2026-01301", name: "Cristina Aranda", section: "Grade 12 - ABM", avg: 91.0, attendance: 96, status: "Active" },
  { id: "2026-01302", name: "Joshua Del Rosario", section: "Grade 12 - ABM", avg: 84.7, attendance: 90, status: "Active" },
  { id: "2026-01303", name: "Kimberly Santos", section: "Grade 12 - ABM", avg: 92.2, attendance: 97, status: "Active" },
  { id: "2026-01304", name: "Aldrin Feliciano", section: "Grade 12 - ABM", avg: 79.9, attendance: 83, status: "Active" },
];

const SECTIONS = [
  { id: "S-1", name: "Grade 7 - Sampaguita", adviser: "Bayani Cruz", grade: "Grade 7", students: 30 },
  { id: "S-2", name: "Grade 7 - Ilang-Ilang", adviser: "Mark Villareal", grade: "Grade 7", students: 29 },
  { id: "S-3", name: "Grade 8 - Luna", adviser: "Carla Mendoza", grade: "Grade 8", students: 40 },
  { id: "S-4", name: "Grade 8 - Del Pilar", adviser: "Trisha Padua", grade: "Grade 8", students: 37 },
  { id: "S-5", name: "Grade 9 - Bonifacio", adviser: "Ana Bautista", grade: "Grade 9", students: 38 },
  { id: "S-6", name: "Grade 9 - Silang", adviser: "Rosario Aquino", grade: "Grade 9", students: 36 },
  { id: "S-7", name: "Grade 10 - Rizal", adviser: "Juan Dela Cruz", grade: "Grade 10", students: 41 },
  { id: "S-8", name: "Grade 10 - Aguinaldo", adviser: "Ramon Villanueva", grade: "Grade 10", students: 39 },
  { id: "S-9", name: "Grade 11 - STEM", adviser: "Leo Fernandez", grade: "Grade 11", strand: "STEM", students: 36 },
  { id: "S-10", name: "Grade 11 - HUMSS", adviser: "Grace Ramos", grade: "Grade 11", strand: "HUMSS", students: 35 },
  { id: "S-11", name: "Grade 12 - STEM", adviser: "Noel Santiago", grade: "Grade 12", strand: "STEM", students: 34 },
  { id: "S-12", name: "Grade 12 - ABM", adviser: "Ivy Concepcion", grade: "Grade 12", strand: "ABM", students: 32 },
];

// Each teacher carries 3+ classes (subject × section) spread across multiple grade
// levels — e.g. Juan Dela Cruz teaches Mathematics in Grades 7, 9, 10, and 11.
const SUBJECTS = [
  // Juan Dela Cruz — Mathematics (Grades 7, 9, 10, 11)
  { id: "SUB-1", name: "Mathematics", teacher: "Juan Dela Cruz", section: "Grade 10 - Rizal", color: "pine", schedule: "MWF · 8:00 – 9:00 AM", room: "Room 201" },
  { id: "SUB-2", name: "Mathematics", teacher: "Juan Dela Cruz", section: "Grade 9 - Bonifacio", color: "pine", schedule: "MWF · 9:00 – 10:00 AM", room: "Room 105" },
  { id: "SUB-3", name: "Mathematics", teacher: "Juan Dela Cruz", section: "Grade 7 - Sampaguita", color: "pine", schedule: "TTh · 8:00 – 9:00 AM", room: "Room 302" },
  { id: "SUB-4", name: "General Mathematics", teacher: "Juan Dela Cruz", section: "Grade 11 - STEM", color: "pine", schedule: "TTh · 1:00 – 2:00 PM", room: "Room 401" },
  // Rosario Aquino — Mathematics (Grades 8, 9, 10, 12)
  { id: "SUB-5", name: "Mathematics", teacher: "Rosario Aquino", section: "Grade 9 - Silang", color: "pine", schedule: "MWF · 10:00 – 11:00 AM", room: "Room 106" },
  { id: "SUB-6", name: "Mathematics", teacher: "Rosario Aquino", section: "Grade 8 - Luna", color: "pine", schedule: "MWF · 1:00 – 2:00 PM", room: "Room 208" },
  { id: "SUB-7", name: "Statistics and Probability", teacher: "Rosario Aquino", section: "Grade 12 - STEM", color: "pine", schedule: "TTh · 9:30 – 10:30 AM", room: "Room 405" },
  { id: "SUB-8", name: "Mathematics", teacher: "Rosario Aquino", section: "Grade 10 - Aguinaldo", color: "pine", schedule: "TTh · 11:00 AM – 12:00 PM", room: "Room 203" },
  // Ana Bautista — Science (Grades 7, 9, 10, 11)
  { id: "SUB-9", name: "Science", teacher: "Ana Bautista", section: "Grade 10 - Rizal", color: "blue", schedule: "MWF · 9:00 – 10:00 AM", room: "Science Lab 1" },
  { id: "SUB-10", name: "Science", teacher: "Ana Bautista", section: "Grade 9 - Bonifacio", color: "blue", schedule: "MWF · 10:00 – 11:00 AM", room: "Science Lab 2" },
  { id: "SUB-11", name: "Science", teacher: "Ana Bautista", section: "Grade 7 - Ilang-Ilang", color: "blue", schedule: "TTh · 8:00 – 9:00 AM", room: "Science Lab 1" },
  { id: "SUB-12", name: "Earth and Life Science", teacher: "Ana Bautista", section: "Grade 11 - HUMSS", color: "blue", schedule: "TTh · 2:00 – 3:00 PM", room: "Science Lab 2" },
  // Bayani Cruz — Science (Grades 7, 8, 12)
  { id: "SUB-13", name: "Science", teacher: "Bayani Cruz", section: "Grade 7 - Sampaguita", color: "blue", schedule: "MWF · 8:00 – 9:00 AM", room: "Science Lab 2" },
  { id: "SUB-14", name: "Science", teacher: "Bayani Cruz", section: "Grade 8 - Del Pilar", color: "blue", schedule: "MWF · 11:00 AM – 12:00 PM", room: "Science Lab 1" },
  { id: "SUB-15", name: "Physical Science", teacher: "Bayani Cruz", section: "Grade 12 - ABM", color: "blue", schedule: "TTh · 1:00 – 2:00 PM", room: "Science Lab 2" },
  // Ramon Villanueva — English (Grades 7, 10, 12)
  { id: "SUB-16", name: "English", teacher: "Ramon Villanueva", section: "Grade 10 - Rizal", color: "gold", schedule: "TTh · 8:00 – 9:30 AM", room: "Room 105" },
  { id: "SUB-17", name: "English", teacher: "Ramon Villanueva", section: "Grade 10 - Aguinaldo", color: "gold", schedule: "TTh · 9:30 – 11:00 AM", room: "Room 107" },
  { id: "SUB-18", name: "English", teacher: "Ramon Villanueva", section: "Grade 7 - Sampaguita", color: "gold", schedule: "MWF · 9:00 – 10:00 AM", room: "Room 303" },
  { id: "SUB-19", name: "Practical Research 2", teacher: "Ramon Villanueva", section: "Grade 12 - STEM", color: "gold", schedule: "MWF · 1:00 – 2:00 PM", room: "Room 406" },
  // Trisha Padua — English (Grades 8, 9, 11)
  { id: "SUB-20", name: "English", teacher: "Trisha Padua", section: "Grade 8 - Del Pilar", color: "gold", schedule: "MWF · 8:00 – 9:00 AM", room: "Room 209" },
  { id: "SUB-21", name: "English", teacher: "Trisha Padua", section: "Grade 9 - Silang", color: "gold", schedule: "MWF · 10:00 – 11:00 AM", room: "Room 108" },
  { id: "SUB-22", name: "English for Academic and Professional Purposes", teacher: "Trisha Padua", section: "Grade 11 - STEM", color: "gold", schedule: "TTh · 2:00 – 3:00 PM", room: "Room 402" },
  // Carla Mendoza — Filipino (Grades 7, 8, 10)
  { id: "SUB-23", name: "Filipino", teacher: "Carla Mendoza", section: "Grade 10 - Rizal", color: "red", schedule: "TTh · 10:00 – 11:30 AM", room: "Room 108" },
  { id: "SUB-24", name: "Filipino", teacher: "Carla Mendoza", section: "Grade 8 - Luna", color: "red", schedule: "MWF · 9:00 – 10:00 AM", room: "Room 210" },
  { id: "SUB-25", name: "Filipino", teacher: "Carla Mendoza", section: "Grade 7 - Ilang-Ilang", color: "red", schedule: "MWF · 11:00 AM – 12:00 PM", room: "Room 304" },
  // Noel Santiago — Filipino (Grades 9, 11, 12)
  { id: "SUB-26", name: "Filipino sa Piling Larang (Akademik)", teacher: "Noel Santiago", section: "Grade 12 - STEM", color: "red", schedule: "TTh · 8:00 – 9:00 AM", room: "Room 407" },
  { id: "SUB-27", name: "Filipino", teacher: "Noel Santiago", section: "Grade 9 - Bonifacio", color: "red", schedule: "TTh · 11:00 AM – 12:00 PM", room: "Room 109" },
  { id: "SUB-28", name: "Komunikasyon at Pananaliksik sa Wika at Kulturang Pilipino", teacher: "Noel Santiago", section: "Grade 11 - HUMSS", color: "red", schedule: "MWF · 2:00 – 3:00 PM", room: "Room 403" },
  // Leo Fernandez — Araling Panlipunan (Grades 8, 10, 11)
  { id: "SUB-29", name: "Araling Panlipunan", teacher: "Leo Fernandez", section: "Grade 10 - Rizal", color: "blue", schedule: "MWF · 10:00 – 11:00 AM", room: "Room 110" },
  { id: "SUB-30", name: "Understanding Culture, Society and Politics", teacher: "Leo Fernandez", section: "Grade 11 - STEM", color: "blue", schedule: "TTh · 9:00 – 10:00 AM", room: "Room 404" },
  { id: "SUB-31", name: "Araling Panlipunan", teacher: "Leo Fernandez", section: "Grade 8 - Del Pilar", color: "blue", schedule: "TTh · 1:00 – 2:00 PM", room: "Room 211" },
  // Ivy Concepcion — Araling Panlipunan (Grades 7, 9, 12)
  { id: "SUB-32", name: "Applied Economics", teacher: "Ivy Concepcion", section: "Grade 12 - ABM", color: "blue", schedule: "MWF · 9:00 – 10:00 AM", room: "Room 408" },
  { id: "SUB-33", name: "Araling Panlipunan", teacher: "Ivy Concepcion", section: "Grade 9 - Silang", color: "blue", schedule: "MWF · 11:00 AM – 12:00 PM", room: "Room 111" },
  { id: "SUB-34", name: "Araling Panlipunan", teacher: "Ivy Concepcion", section: "Grade 7 - Sampaguita", color: "blue", schedule: "TTh · 10:00 – 11:00 AM", room: "Room 305" },
  // Grace Ramos — MAPEH (Grades 9, 10, 11, 12)
  { id: "SUB-35", name: "MAPEH", teacher: "Grace Ramos", section: "Grade 10 - Rizal", color: "gold", schedule: "TTh · 1:00 – 2:30 PM", room: "Covered Court" },
  { id: "SUB-36", name: "Physical Education and Health 1", teacher: "Grace Ramos", section: "Grade 11 - HUMSS", color: "gold", schedule: "MWF · 2:00 – 3:30 PM", room: "Covered Court" },
  { id: "SUB-37", name: "MAPEH", teacher: "Grace Ramos", section: "Grade 9 - Bonifacio", color: "gold", schedule: "TTh · 9:00 – 10:30 AM", room: "Gymnasium" },
  { id: "SUB-38", name: "Physical Education and Health 3", teacher: "Grace Ramos", section: "Grade 12 - STEM", color: "gold", schedule: "MWF · 8:00 – 9:30 AM", room: "Gymnasium" },
  // Mark Villareal — TLE / Computer (Grades 7, 8, 10)
  { id: "SUB-39", name: "TLE / Computer", teacher: "Mark Villareal", section: "Grade 10 - Rizal", color: "pine", schedule: "F · 1:00 – 3:00 PM", room: "Computer Lab" },
  { id: "SUB-40", name: "TLE / Computer", teacher: "Mark Villareal", section: "Grade 7 - Ilang-Ilang", color: "pine", schedule: "W · 10:00 AM – 12:00 PM", room: "Computer Lab" },
  { id: "SUB-41", name: "TLE / Computer", teacher: "Mark Villareal", section: "Grade 8 - Luna", color: "pine", schedule: "Th · 1:00 – 3:00 PM", room: "Computer Lab" },
];


const initialAnnouncements = [
  { id: "A-1", title: "Enrollment for School Year 2026–2027 starts August 25", body: "Old and new students may enroll online through the SPHS Portal or in person at the Registrar's Office. Please bring your Form 138 and Good Moral Certificate.", category: "School", author: "Dr. Corazon Reyes", authorRole: "admin", audience: "Everyone", date: "2026-08-15", pinned: true, image: null },
  { id: "A-2", title: "Grade 10 Mathematics assignment due tomorrow", body: "Reminder: Problem Set 4 (Quadratic Functions) is due tomorrow, 8:00 AM. Late submissions will be marked accordingly.", category: "Class", author: "Juan Dela Cruz", authorRole: "teacher", audience: "Grade 10 - Rizal", date: "2026-08-17", pinned: false, image: null },
  { id: "A-3", title: "SPHS Foundation Day — September 15", body: "Join us in celebrating 42 years of SPHS! Expect a parade, exhibits, and a program at the covered court. Attendance is required for all sections.", category: "Events", author: "Dr. Corazon Reyes", authorRole: "admin", audience: "Everyone", date: "2026-08-14", pinned: true, image: null },
  { id: "A-4", title: "Brownout advisory for Thursday morning", body: "MORE Electric has scheduled a preventive maintenance shutdown from 6:00–10:00 AM Thursday. Classes will proceed; bring extra water.", category: "Emergency", author: "Dr. Corazon Reyes", authorRole: "admin", audience: "Everyone", date: "2026-08-13", pinned: false, image: null },
  { id: "A-5", title: "Quarterly exam schedule released", body: "First Quarter Examination Week is set for September 8–12. Check the Calendar tab for your section's exact schedule per subject.", category: "Academic", author: "Dr. Corazon Reyes", authorRole: "admin", audience: "Everyone", date: "2026-08-12", pinned: false, image: null },
  { id: "A-6", title: "Bring your permission slip for the Science Fair", body: "Grade 10 - Rizal students joining the Science Fair booth must submit signed permission slips by Friday.", category: "Reminder", author: "Ana Bautista", authorRole: "teacher", audience: "Grade 10 - Rizal", date: "2026-08-11", pinned: false, image: null },
];

const initialEvents = [
  { id: "E-1", title: "SPHS Foundation Day", date: "2026-09-15", start: "7:00 AM", end: "4:00 PM", location: "School Grounds", organizer: "Dr. Corazon Reyes", description: "42nd Founding Anniversary celebration with parade, booths, and cultural program.", participants: 1240, going: true },
  { id: "E-2", title: "Sports Festival", date: "2026-09-22", start: "7:00 AM", end: "5:00 PM", location: "Covered Court & Field", organizer: "Grace Ramos", description: "Intramurals featuring basketball, volleyball, and track events per grade level.", participants: 980, going: false },
  { id: "E-3", title: "Parent-Teacher Conference", date: "2026-08-29", start: "1:00 PM", end: "4:00 PM", location: "Classrooms", organizer: "Dr. Corazon Reyes", description: "Quarterly conference to discuss student progress with advisers.", participants: 640, going: true },
  { id: "E-4", title: "Science Fair", date: "2026-09-05", start: "8:00 AM", end: "3:00 PM", location: "Multipurpose Hall", organizer: "Ana Bautista", description: "Student research and investigatory projects on display, judged by grade level.", participants: 300, going: false },
  { id: "E-5", title: "First Quarter Exam Week", date: "2026-09-08", start: "7:30 AM", end: "12:00 PM", location: "Respective Classrooms", organizer: "Registrar's Office", description: "Quarterly examinations for all grade levels.", participants: 1500, going: true },
];

const initialAssignments = [
  { id: "AS-1", title: "Problem Set 4: Quadratic Functions", subject: "Mathematics", teacher: "Juan Dela Cruz", due: "2026-08-19", points: 50, status: "Pending", instructions: "Answer items 1–20 on page 84. Show complete solutions on graphing paper.", attachments: ["problem-set-4.pdf"] },
  { id: "AS-2", title: "Lab Report: Chemical Reactions", subject: "Science", teacher: "Ana Bautista", due: "2026-08-21", points: 30, status: "Pending", instructions: "Summarize the reactions observed during Tuesday's experiment. Include your hypothesis and conclusion.", attachments: ["lab-report-template.docx"] },
  { id: "AS-3", title: "Essay: My Filipino Identity", subject: "Filipino", teacher: "Carla Mendoza", due: "2026-08-14", points: 40, status: "Graded", grade: 38, feedback: "Malalim na pagninilay. Pagbutihin ang balarila sa ikalawang talata.", instructions: "Sumulat ng 500-salitang sanaysay tungkol sa iyong pagkakakilanlan bilang Pilipino.", attachments: [] },
  { id: "AS-4", title: "Reading Response: Noli Me Tangere Ch. 5–8", subject: "English", teacher: "Ramon Villanueva", due: "2026-08-16", points: 25, status: "Submitted", instructions: "Write a one-page reflection connecting the chapters to present-day society.", attachments: [] },
  { id: "AS-5", title: "Map Analysis: Regions of the Philippines", subject: "Araling Panlipunan", teacher: "Leo Fernandez", due: "2026-08-10", points: 20, status: "Overdue", instructions: "Label the 17 regions and identify their major industries.", attachments: ["blank-map.pdf"] },
  { id: "AS-6", title: "Fitness Log — Week 3", subject: "MAPEH", teacher: "Grace Ramos", due: "2026-08-23", points: 15, status: "Pending", instructions: "Record your daily physical activity for the week using the provided template.", attachments: [] },
];

const initialQuizzes = [
  { id: "Q-1", title: "Quadratic Equations — Short Quiz", subject: "Mathematics", teacher: "Juan Dela Cruz", questions: [
      { id: 1, type: "mcq", q: "What is the standard form of a quadratic equation?", options: ["ax + b = 0", "ax² + bx + c = 0", "ax³ + b = 0", "a/x + b = 0"], answer: 1 },
      { id: 2, type: "tf", q: "A quadratic equation always has two real solutions.", options: ["True", "False"], answer: 1 },
      { id: 3, type: "mcq", q: "The graph of a quadratic function is a:", options: ["Straight line", "Parabola", "Circle", "Hyperbola"], answer: 1 },
      { id: 4, type: "mcq", q: "Which formula finds the roots of ax² + bx + c = 0?", options: ["Pythagorean theorem", "Quadratic formula", "Slope formula", "Distance formula"], answer: 1 },
    ], timeLimit: 10, points: 20, due: "2026-08-20", status: "Not Started" },
  { id: "Q-2", title: "Cell Structure & Function", subject: "Science", teacher: "Ana Bautista", questions: [
      { id: 1, type: "mcq", q: "Which organelle is the 'powerhouse of the cell'?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"], answer: 1 },
      { id: 2, type: "tf", q: "Plant cells have a cell wall.", options: ["True", "False"], answer: 0 },
      { id: 3, type: "mcq", q: "Which structure controls what enters and exits the cell?", options: ["Cell membrane", "Cytoplasm", "Vacuole", "Nucleolus"], answer: 0 },
    ], timeLimit: 8, points: 15, due: "2026-08-25", status: "Completed", score: 13 },
];

const gradesData = {
  "Mathematics": { activities: 91, quizzes: 88, exams: 90, projects: 95, final: 91 },
  "Science": { activities: 87, quizzes: 90, exams: 88, projects: 92, final: 89 },
  "English": { activities: 95, quizzes: 92, exams: 94, projects: 96, final: 94 },
  "Filipino": { activities: 90, quizzes: 89, exams: 91, projects: 93, final: 91 },
  "Araling Panlipunan": { activities: 88, quizzes: 85, exams: 87, projects: 90, final: 87 },
  "MAPEH": { activities: 96, quizzes: 94, exams: 93, projects: 97, final: 95 },
};

const initialMaterials = [
  { id: "M-1", title: "Quadratic Functions — Reviewer", subject: "Mathematics", teacher: "Juan Dela Cruz", type: "PDF", category: "Reviewer", size: "1.2 MB", date: "2026-08-10" },
  { id: "M-2", title: "Module 3: Cell Biology", subject: "Science", teacher: "Ana Bautista", type: "PDF", category: "Module", size: "3.4 MB", date: "2026-08-08" },
  { id: "M-3", title: "Noli Me Tangere — Slides", subject: "English", teacher: "Ramon Villanueva", type: "Presentation", category: "Slides", size: "5.1 MB", date: "2026-08-05" },
  { id: "M-4", title: "Panitikang Pilipino — Video Lecture", subject: "Filipino", teacher: "Carla Mendoza", type: "Video", category: "Lecture", size: "82 MB", date: "2026-08-02" },
  { id: "M-5", title: "Mapa ng mga Rehiyon", subject: "Araling Panlipunan", teacher: "Leo Fernandez", type: "Image", category: "Reference", size: "800 KB", date: "2026-07-30" },
];

const initialTasks = [
  { id: "TK-1", title: "Finish Mathematics assignment", group: "today", done: false, due: "2026-08-19", source: "Assignment" },
  { id: "TK-2", title: "Review Science lesson", group: "today", done: false, due: "2026-08-18", source: "Personal" },
  { id: "TK-3", title: "Submit English project", group: "today", done: true, due: "2026-08-18", source: "Assignment" },
  { id: "TK-4", title: "Science quiz — Cell Structure", group: "upcoming", done: false, due: "2026-08-25", source: "Quiz" },
  { id: "TK-5", title: "Research presentation outline", group: "upcoming", done: false, due: "2026-08-27", source: "Personal" },
];

const initialNotifications = [
  { id: "N-1", title: "New announcement posted", body: "SPHS Foundation Day — September 15", time: "2h ago", read: false, kind: "announcement" },
  { id: "N-2", title: "Assignment deadline approaching", body: "Problem Set 4 is due tomorrow", time: "4h ago", read: false, kind: "assignment" },
  { id: "N-3", title: "Grade posted", body: "Your Filipino essay has been graded: 38/40", time: "1d ago", read: false, kind: "grade" },
  { id: "N-4", title: "New message from Juan Dela Cruz", body: "Please see me after class about your submission.", time: "1d ago", read: true, kind: "message" },
  { id: "N-5", title: "Schedule change", body: "MAPEH moved to Covered Court this week", time: "2d ago", read: true, kind: "schedule" },
];

const initialConversations = [
  { id: "C-1", withName: "Juan Dela Cruz", withRole: "Mathematics Teacher", unread: 1, messages: [
      { from: "them", text: "Hi Maria, please see me after class about your Problem Set 3 submission.", time: "Yesterday, 3:40 PM" },
      { from: "me", text: "Good afternoon po, sir! I'll drop by after MAPEH.", time: "Yesterday, 3:52 PM" },
    ] },
  { id: "C-2", withName: "Ana Bautista", withRole: "Science Teacher", unread: 0, messages: [
      { from: "them", text: "Great work on the lab report outline!", time: "Mon, 10:15 AM" },
    ] },
  { id: "C-3", withName: "Grade 10 - Rizal (Class)", withRole: "Class Group", unread: 0, messages: [
      { from: "them", text: "Reminder: bring your PE uniform tomorrow.", time: "Mon, 8:00 AM" },
    ] },
];

const scheduleToday = [
  { subject: "Mathematics", teacher: "Juan Dela Cruz", time: "8:00 – 9:00 AM", room: "Room 201" },
  { subject: "Science", teacher: "Ana Bautista", time: "9:00 – 10:00 AM", room: "Science Lab 1" },
  { subject: "Araling Panlipunan", teacher: "Leo Fernandez", time: "10:00 – 11:00 AM", room: "Room 110" },
  { subject: "English", teacher: "Ramon Villanueva", time: "1:00 – 2:30 PM", room: "Room 105" },
];

const attendanceHistory = [
  { date: "2026-08-17", status: "Present" }, { date: "2026-08-14", status: "Present" },
  { date: "2026-08-13", status: "Late" }, { date: "2026-08-12", status: "Present" },
  { date: "2026-08-11", status: "Present" }, { date: "2026-08-10", status: "Excused" },
  { date: "2026-08-07", status: "Present" }, { date: "2026-08-06", status: "Absent" },
];

const enrollmentTrend = [
  { year: "2021", value: 2180 }, { year: "2022", value: 2260 }, { year: "2023", value: 2340 },
  { year: "2024", value: 2410 }, { year: "2025", value: 2480 }, { year: "2026", value: 2550 },
];
const attendanceTrend = [
  { month: "Mar", value: 93 }, { month: "Apr", value: 91 }, { month: "May", value: 88 },
  { month: "Jun", value: 90 }, { month: "Jul", value: 94 }, { month: "Aug", value: 95 },
];
const completionTrend = [
  { subject: "Math", value: 88 }, { subject: "Sci", value: 92 }, { subject: "Eng", value: 95 },
  { subject: "Fil", value: 90 }, { subject: "AP", value: 84 }, { subject: "MAPEH", value: 97 },
];

const CATEGORY_META = {
  School: { color: "pine" }, Academic: { color: "blue" }, Events: { color: "gold" },
  Emergency: { color: "red" }, Reminder: { color: "gold" }, Class: { color: "pine" },
};

/* ============================================================================
   CONTEXT
============================================================================ */

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

/* ============================================================================
   SMALL UI PRIMITIVES
============================================================================ */

function Badge({ children, tone = "pine", stamp = false, small = false }) {
  const { c } = useApp();
  const toneMap = {
    pine: { bg: c.pineSoft, fg: c.pine }, gold: { bg: c.goldSoft, fg: c.gold },
    red: { bg: c.redSoft, fg: c.red }, blue: { bg: c.blueSoft, fg: c.blue },
    ink: { bg: c.surface2, fg: c.inkSoft },
  };
  const t = toneMap[tone] || toneMap.pine;
  return (
    <span
      className={stamp ? "spnhs-stamp" : ""}
      style={{
        background: stamp ? "transparent" : t.bg, color: t.fg,
        borderRadius: stamp ? 6 : 999, padding: small ? "2px 8px" : "4px 10px",
        fontSize: small ? 11 : 12, fontWeight: 700, display: "inline-flex", alignItems: "center",
        gap: 4, whiteSpace: "nowrap", textTransform: stamp ? "uppercase" : "none",
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style, hover = false, onClick }) {
  const { c } = useApp();
  return (
    <div
      onClick={onClick}
      className={hover ? "spnhs-card-hover" : ""}
      style={{
        background: c.surface, border: `1px solid ${c.line}`, borderRadius: 16,
        padding: 18, cursor: onClick ? "pointer" : "default", ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, children, action }) {
  const { c } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {Icon && <Icon size={18} color={c.pine} />}
        <h3 className="spnhs-display" style={{ margin: 0, fontSize: 18, fontWeight: 600, color: c.ink }}>{children}</h3>
      </div>
      {action}
    </div>
  );
}

function Button({ children, onClick, variant = "primary", icon: Icon, size = "md", style, type = "button", disabled }) {
  const { c } = useApp();
  const sizes = { sm: { padding: "6px 12px", fontSize: 13 }, md: { padding: "9px 16px", fontSize: 14 }, lg: { padding: "12px 20px", fontSize: 15 } };
  const variants = {
    primary: { background: c.pine, color: "#fff", border: `1px solid ${c.pine}` },
    secondary: { background: "transparent", color: c.pine, border: `1px solid ${c.pine}` },
    ghost: { background: "transparent", color: c.ink, border: `1px solid transparent` },
    danger: { background: "transparent", color: c.red, border: `1px solid ${c.red}` },
    gold: { background: c.gold, color: "#fff", border: `1px solid ${c.gold}` },
  };
  return (
    <button
      type={type} onClick={onClick} disabled={disabled}
      className="spnhs-btn spnhs-focus"
      style={{
        ...sizes[size], ...variants[variant], borderRadius: 10, fontWeight: 600,
        display: "inline-flex", alignItems: "center", gap: 6, cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1, ...style,
      }}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

function EmptyState({ icon: Icon, title, body }) {
  const { c } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "48px 20px", color: c.inkSoft }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: c.surface2, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <Icon size={26} color={c.inkSoft} />
      </div>
      <div className="spnhs-display" style={{ fontSize: 16, fontWeight: 600, color: c.ink, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13.5 }}>{body}</div>
    </div>
  );
}

function Skeleton({ h = 16, w = "100%", style }) {
  const { c } = useApp();
  return <div style={{ height: h, width: w, background: c.surface2, borderRadius: 6, ...style, animation: "spnhsPulse 1.1s ease-in-out infinite" }} />;
}

function ErrorState({ title = "Something went wrong.", body = "Please try again.", onRetry }) {
  const { c } = useApp();
  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ width: 52, height: 52, borderRadius: "50%", background: c.redSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
        <AlertCircle size={24} color={c.red} />
      </div>
      <div className="spnhs-display" style={{ fontSize: 15.5, fontWeight: 600, color: c.ink, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 13, color: c.inkSoft, marginBottom: onRetry ? 16 : 0 }}>{body}</div>
      {onRetry && <Button variant="secondary" icon={RefreshCw} onClick={onRetry}>Retry</Button>}
    </div>
  );
}

function SkeletonPage() {
  const { c } = useApp();
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        {[0, 1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton h={12} w="50%" style={{ marginBottom: 12 }} />
            <Skeleton h={26} w="40%" />
          </Card>
        ))}
      </div>
      <Card style={{ marginBottom: 14 }}>
        <Skeleton h={14} w="30%" style={{ marginBottom: 16 }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: i < 2 ? `1px solid ${c.line}` : "none" }}>
            <Skeleton h={34} w={34} style={{ borderRadius: 9, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Skeleton h={12} w="60%" style={{ marginBottom: 8 }} />
              <Skeleton h={10} w="35%" />
            </div>
          </div>
        ))}
      </Card>
      <style>{`@keyframes spnhsPulse { 0%,100% { opacity: 1; } 50% { opacity: 0.55; } }`}</style>
    </div>
  );
}

function Modal({ title, onClose, children, width = 520 }) {
  const { c } = useApp();
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,20,0.55)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="spnhs-fade-in"
        style={{ background: c.surface, borderRadius: 18, width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto", border: `1px solid ${c.line}` }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: `1px solid ${c.line}`, position: "sticky", top: 0, background: c.surface, zIndex: 1 }}>
          <h3 className="spnhs-display" style={{ margin: 0, fontSize: 18, color: c.ink }}>{title}</h3>
          <button onClick={onClose} className="spnhs-focus" style={{ background: "none", border: "none", cursor: "pointer", color: c.inkSoft, padding: 4 }}><X size={20} /></button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  const { c } = useApp();
  return (
    <label style={{ display: "block", marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 600, color: c.inkSoft, marginBottom: 5 }}>{label}</div>
      {children}
    </label>
  );
}

function inputStyle(c) {
  return { width: "100%", padding: "9px 12px", borderRadius: 9, border: `1px solid ${c.line}`, background: c.bg, color: c.ink, fontSize: 14 };
}

function statusTone(status) {
  const map = { Pending: "gold", Submitted: "blue", Graded: "pine", Overdue: "red", "Not Started": "ink", "In Progress": "blue", Late: "red", Completed: "pine" };
  return map[status] || "ink";
}

/* ============================================================================
   LAYOUT: Sidebar / TopNav / BottomNav
============================================================================ */

const NAV = {
  student: [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "feed", label: "Feed", icon: Megaphone },
    { key: "subjects", label: "Subjects", icon: BookOpen },
    { key: "assignments", label: "Assignments", icon: ClipboardList },
    { key: "quizzes", label: "Quizzes", icon: HelpCircle },
    { key: "grades", label: "Grades", icon: GraduationCap },
    { key: "attendance", label: "Attendance", icon: CalendarCheck },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
    { key: "events", label: "Events", icon: PartyPopper },
    { key: "materials", label: "Materials", icon: FolderOpen },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "tasks", label: "Tasks", icon: ListChecks },
    { key: "profile", label: "Profile", icon: User },
  ],
  teacher: [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "feed", label: "Feed", icon: Megaphone },
    { key: "classes", label: "Classes", icon: Users },
    { key: "assignments", label: "Assignments", icon: ClipboardList },
    { key: "quizzes", label: "Quizzes", icon: HelpCircle },
    { key: "grades", label: "Gradebook", icon: GraduationCap },
    { key: "attendance", label: "Attendance", icon: CalendarCheck },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
    { key: "events", label: "Events", icon: PartyPopper },
    { key: "materials", label: "Materials", icon: FolderOpen },
    { key: "messages", label: "Messages", icon: MessageSquare },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "profile", label: "Profile", icon: User },
  ],
  admin: [
    { key: "dashboard", label: "Home", icon: Home },
    { key: "students", label: "Students", icon: Users },
    { key: "teachers", label: "Teachers", icon: UserCog },
    { key: "sections", label: "Sections", icon: Building2 },
    { key: "subjects", label: "Subjects", icon: BookOpen },
    { key: "feed", label: "Announcements", icon: Megaphone },
    { key: "events", label: "Events", icon: PartyPopper },
    { key: "calendar", label: "Calendar", icon: CalendarDays },
    { key: "reports", label: "Reports", icon: FileText },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
    { key: "profile", label: "Settings", icon: Settings },
  ],
};

const MOBILE_NAV = {
  student: ["dashboard", "subjects", "calendar", "notifications", "profile"],
  teacher: ["dashboard", "classes", "calendar", "notifications", "profile"],
  admin: ["dashboard", "students", "calendar", "notifications", "profile"],
};

function Seal({ size = 40 }) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const arcId = "sealArc" + rawId;
  const petalCount = 20;
  const petals = Array.from({ length: petalCount }, (_, i) => {
    const angle = (i / petalCount) * Math.PI * 2;
    return { x: 50 + 34 * Math.cos(angle), y: 50 + 34 * Math.sin(angle) };
  });
  const leafSide = (dir) => {
    const n = 7;
    const leaves = [];
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      leaves.push({ x: 50 + dir * (6 + t * 24), y: 78 - t * 34, rot: dir * (18 + t * 58), scale: 1 - t * 0.22 });
    }
    return leaves;
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ flexShrink: 0, display: "block" }} aria-label="Santa Praxedes High School seal">
      <circle cx="50" cy="50" r="48" fill="#FFFFFF" stroke="#D9DDE3" strokeWidth="0.6" />
      {petals.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="10.5" fill="#1E4E9C" />
      ))}
      <circle cx="50" cy="50" r="30.5" fill="#FFFFFF" stroke="#1E4E9C" strokeWidth="1.4" />

      <path id={arcId} d="M 15,55 A 35,35 0 1 1 85,55" fill="none" />
      <text fontSize="6.3" fontWeight="700" fill="#1E4E9C" letterSpacing="0.4">
        <textPath href={"#" + arcId} xlinkHref={"#" + arcId} startOffset="50%" textAnchor="middle">
          STA. PRAXEDES HIGH SCHOOL
        </textPath>
      </text>

      {leafSide(-1).map((l, i) => (
        <ellipse key={"l" + i} cx={l.x} cy={l.y} rx={3.4 * l.scale} ry={1.6 * l.scale} fill="#3E8E4C" transform={`rotate(${l.rot} ${l.x} ${l.y})`} />
      ))}
      {leafSide(1).map((l, i) => (
        <ellipse key={"r" + i} cx={l.x} cy={l.y} rx={3.4 * l.scale} ry={1.6 * l.scale} fill="#3E8E4C" transform={`rotate(${-l.rot} ${l.x} ${l.y})`} />
      ))}

      <path d="M50,53 L29,57.5 L29,67 L50,63.5 Z" fill="#FFFFFF" stroke="#2B2B2B" strokeWidth="0.8" />
      <path d="M50,53 L71,57.5 L71,67 L50,63.5 Z" fill="#FFFFFF" stroke="#2B2B2B" strokeWidth="0.8" />
      <line x1="50" y1="53" x2="50" y2="63.5" stroke="#2B2B2B" strokeWidth="0.7" />
      <line x1="33" y1="59" x2="47" y2="56.5" stroke="#BFBFBF" strokeWidth="0.5" />
      <line x1="33" y1="62.5" x2="47" y2="60" stroke="#BFBFBF" strokeWidth="0.5" />
      <line x1="67" y1="59" x2="53" y2="56.5" stroke="#BFBFBF" strokeWidth="0.5" />
      <line x1="67" y1="62.5" x2="53" y2="60" stroke="#BFBFBF" strokeWidth="0.5" />

      <path d="M42,52 L58,52 L54.5,58 L45.5,58 Z" fill="#D9A62B" stroke="#B4841C" strokeWidth="0.5" />
      <rect x="48.5" y="58" width="3" height="4.5" fill="#D9A62B" />
      <ellipse cx="50" cy="63" rx="6" ry="1.6" fill="#D9A62B" stroke="#B4841C" strokeWidth="0.4" />

      <path d="M50,29 C45.5,35 41.5,40.5 44.5,46.5 C46.5,50.5 53.5,50.5 55.5,46.5 C58.5,40.5 54.5,35 50,29 Z" fill="#E2532B" />
      <path d="M50,34 C47.3,38 45,41.5 47,45.5 C48.2,48 51.8,48 53,45.5 C55,41.5 52.7,38 50,34 Z" fill="#F5C518" />

      <text x="50" y="77.5" fontSize="6" fontWeight="700" fill="#1E4E9C" textAnchor="middle" letterSpacing="0.5">• 1991 •</text>
    </svg>
  );
}

function Sidebar({ page, setPage }) {
  const { c, user, setPage: navigate, notifications } = useApp();
  const items = NAV[user.role];
  const unread = notifications.filter((n) => !n.read).length;
  return (
    <div style={{
      width: 248, flexShrink: 0, borderRight: `1px solid ${c.line}`, background: c.surface,
      display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 18px 16px" }}>
        <Seal size={38} />
        <div>
          <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 16, color: c.ink, lineHeight: 1.1 }}>SPHS Portal</div>
          <div style={{ fontSize: 10.5, color: c.inkSoft, letterSpacing: 0.3 }}>Santa Praxedes HS</div>
        </div>
      </div>
      <div style={{ padding: "0 14px", flex: 1, overflowY: "auto" }}>
        {items.map((it) => {
          const active = page === it.key;
          return (
            <button
              key={it.key} onClick={() => navigate(it.key)}
              className="spnhs-focus"
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                borderRadius: 10, marginBottom: 2, border: "none", cursor: "pointer", textAlign: "left",
                background: active ? c.pineSoft : "transparent", color: active ? c.pine : c.inkSoft,
                fontWeight: active ? 700 : 500, fontSize: 13.5, position: "relative",
              }}
            >
              <it.icon size={17} />
              {it.label}
              {it.key === "notifications" && unread > 0 && (
                <span style={{ marginLeft: "auto", background: c.red, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 6px" }}>{unread}</span>
              )}
            </button>
          );
        })}
        <button
          onClick={() => navigate("notifications")}
          className="spnhs-focus"
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
            borderRadius: 10, marginBottom: 2, border: "none", cursor: "pointer", textAlign: "left",
            background: page === "notifications" ? c.pineSoft : "transparent", color: page === "notifications" ? c.pine : c.inkSoft,
            fontWeight: page === "notifications" ? 700 : 500, fontSize: 13.5,
          }}
        >
          <Bell size={17} /> Notifications
          {unread > 0 && <span style={{ marginLeft: "auto", background: c.red, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 6px" }}>{unread}</span>}
        </button>
      </div>
      <div style={{ padding: 14, borderTop: `1px solid ${c.line}` }}>
        <SignedInCard />
      </div>
    </div>
  );
}

function SignedInCard() {
  const { c, user, logout } = useApp();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: c.pine, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
        {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
        <div style={{ fontSize: 11, color: c.inkSoft, textTransform: "capitalize" }}>{user.role}</div>
      </div>
      <button onClick={logout} className="spnhs-focus" title="Log out" style={{ background: "none", border: "none", cursor: "pointer", color: c.inkSoft, padding: 4 }}>
        <LogOut size={16} />
      </button>
    </div>
  );
}

function ThemeSwitch() {
  const { c, theme, setTheme } = useApp();
  const opts = [{ k: "light", icon: Sun }, { k: "dark", icon: Moon }, { k: "system", icon: Monitor }];
  return (
    <div style={{ display: "flex", background: c.surface2, borderRadius: 999, padding: 3, gap: 2 }}>
      {opts.map((o) => (
        <button
          key={o.k} onClick={() => setTheme(o.k)} className="spnhs-focus"
          title={o.k}
          style={{
            border: "none", borderRadius: 999, width: 28, height: 28, display: "flex", alignItems: "center",
            justifyContent: "center", cursor: "pointer", background: theme === o.k ? c.pine : "transparent",
            color: theme === o.k ? "#fff" : c.inkSoft,
          }}
        >
          <o.icon size={14} />
        </button>
      ))}
    </div>
  );
}

function getSearchResults(q, ctx) {
  const query = (q || "").trim().toLowerCase();
  if (query.length < 1) return [];
  const role = ctx.user.role;
  const results = [];
  const subjPage = role === "teacher" ? "classes" : role === "admin" ? "subjects" : "subjects";
  SUBJECTS.forEach((s) => {
    if (s.name.toLowerCase().includes(query) || s.teacher.toLowerCase().includes(query)) {
      results.push({ key: "su-" + s.id, icon: BookOpen, title: s.name, subtitle: `Subject · ${s.teacher}`, page: subjPage });
    }
  });
  if (role !== "student") {
    STUDENTS.forEach((s) => {
      if (s.name.toLowerCase().includes(query) || s.id.includes(query)) {
        results.push({ key: "st-" + s.id, icon: Users, title: s.name, subtitle: `Student · ${s.section}`, page: role === "admin" ? "students" : "classes" });
      }
    });
  }
  if (role === "admin") {
    TEACHERS.forEach((t) => {
      if (t.name.toLowerCase().includes(query) || t.subject.toLowerCase().includes(query)) {
        results.push({ key: "te-" + t.id, icon: UserCog, title: t.name, subtitle: `Teacher · ${t.subject}`, page: "teachers" });
      }
    });
  }
  ctx.assignments.forEach((a) => {
    if (a.title.toLowerCase().includes(query) || a.subject.toLowerCase().includes(query)) {
      results.push({ key: "as-" + a.id, icon: ClipboardList, title: a.title, subtitle: `Assignment · ${a.subject}`, page: "assignments" });
    }
  });
  ctx.announcements.forEach((a) => {
    if (a.title.toLowerCase().includes(query)) {
      results.push({ key: "an-" + a.id, icon: Megaphone, title: a.title, subtitle: `Announcement · ${a.category}`, page: "feed" });
    }
  });
  ctx.events.forEach((e) => {
    if (e.title.toLowerCase().includes(query)) {
      results.push({ key: "ev-" + e.id, icon: PartyPopper, title: e.title, subtitle: `Event · ${e.date}`, page: "events" });
    }
  });
  initialMaterials.forEach((m) => {
    if (m.title.toLowerCase().includes(query) || m.subject.toLowerCase().includes(query)) {
      results.push({ key: "ma-" + m.id, icon: FolderOpen, title: m.title, subtitle: `Material · ${m.subject}`, page: "materials" });
    }
  });
  return results.slice(0, 8);
}

function SearchResultsList({ results, onSelect }) {
  const { c } = useApp();
  if (results.length === 0) return <div style={{ padding: 16, fontSize: 12.5, color: c.inkSoft, textAlign: "center" }}>No matches yet — keep typing.</div>;
  return (
    <>
      {results.map((r) => (
        <button
          key={r.key} onClick={() => onSelect(r)}
          style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 8, background: c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <r.icon size={15} color={c.pine} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</div>
            <div style={{ fontSize: 11, color: c.inkSoft }}>{r.subtitle}</div>
          </div>
        </button>
      ))}
    </>
  );
}

function TopHeader({ onMenu, title }) {
  const ctx = useApp();
  const { c, notifications, setPage } = ctx;
  const unread = notifications.filter((n) => !n.read).length;
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const results = useMemo(() => getSearchResults(q, ctx), [q, ctx.assignments, ctx.announcements, ctx.events]);
  const select = (r) => { setPage(r.page); setQ(""); setFocused(false); };
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 20, background: c.bg + "F2", backdropFilter: "blur(6px)", borderBottom: `1px solid ${c.line}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
        <button onClick={onMenu} className="spnhs-focus" style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: c.ink }} data-mobile-menu>
          <Menu size={22} />
        </button>
        <h2 className="spnhs-display" style={{ margin: 0, fontSize: 20, fontWeight: 600, color: c.ink, flex: 1 }}>{title}</h2>
        <div className="header-search" style={{ position: "relative", width: 260 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: 10, color: c.inkSoft }} />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 150)}
            placeholder="Search students, subjects, events…"
            className="spnhs-focus"
            style={{ ...inputStyle(c), paddingLeft: 32, fontSize: 13 }}
          />
          {focused && q.trim().length > 0 && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: c.surface, border: `1px solid ${c.line}`, borderRadius: 12, boxShadow: "0 12px 30px rgba(20,30,25,0.16)", maxHeight: 320, overflowY: "auto", zIndex: 50 }}>
              <SearchResultsList results={results} onSelect={select} />
            </div>
          )}
        </div>
        <ThemeSwitch />
        <button onClick={() => setPage("notifications")} className="spnhs-focus" style={{ position: "relative", background: "none", border: "none", cursor: "pointer", color: c.ink, padding: 4 }}>
          <Bell size={20} />
          {unread > 0 && <span style={{ position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: "50%", background: c.red }} />}
        </button>
      </div>
    </div>
  );
}

function MobileSearchModal({ onClose }) {
  const ctx = useApp();
  const { c, setPage } = ctx;
  const [q, setQ] = useState("");
  const results = useMemo(() => getSearchResults(q, ctx), [q, ctx.assignments, ctx.announcements, ctx.events]);
  const select = (r) => { setPage(r.page); onClose(); };
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: c.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, borderBottom: `1px solid ${c.line}` }}>
        <button onClick={onClose} className="spnhs-focus" style={{ background: "none", border: "none", color: c.ink, padding: 2 }}><ArrowLeft size={20} /></button>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: c.inkSoft }} />
          {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search students, subjects, events…" className="spnhs-focus" style={{ ...inputStyle(c), paddingLeft: 32 }} />
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {q.trim().length > 0 ? <SearchResultsList results={results} onSelect={select} /> : (
          <div style={{ padding: 24, textAlign: "center", color: c.inkSoft, fontSize: 13 }}>Search students, teachers, subjects, assignments, announcements, events, and materials.</div>
        )}
      </div>
    </div>
  );
}

function MobileHeader({ onMenu }) {
  const { c, notifications, setPage } = useApp();
  const unread = notifications.filter((n) => !n.read).length;
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 30, background: c.surface, borderBottom: `1px solid ${c.line}`, display: "flex", alignItems: "center", gap: 10, padding: "12px 14px" }}>
      <button onClick={onMenu} className="spnhs-focus" style={{ background: "none", border: "none", color: c.ink, padding: 2 }}><Menu size={22} /></button>
      <Seal size={30} />
      <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 15, color: c.ink, flex: 1 }}>SPHS Portal</div>
      <button onClick={() => setSearchOpen(true)} className="spnhs-focus" style={{ background: "none", border: "none", color: c.ink, padding: 2 }}>
        <Search size={20} />
      </button>
      <button onClick={() => setPage("notifications")} className="spnhs-focus" style={{ position: "relative", background: "none", border: "none", color: c.ink, padding: 2 }}>
        <Bell size={20} />
        {unread > 0 && <span style={{ position: "absolute", top: 0, right: 0, width: 7, height: 7, borderRadius: "50%", background: c.red }} />}
      </button>
      {searchOpen && <MobileSearchModal onClose={() => setSearchOpen(false)} />}
    </div>
  );
}

function BottomNav({ page, setPage }) {
  const { c, user } = useApp();
  const keys = MOBILE_NAV[user.role];
  const all = [...NAV[user.role], { key: "notifications", label: "Alerts", icon: Bell }];
  const items = keys.map((k) => all.find((i) => i.key === k));
  return (
    <div style={{
      position: "sticky", bottom: 0, left: 0, right: 0, background: c.surface, borderTop: `1px solid ${c.line}`,
      display: "flex", zIndex: 30, paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {items.map((it) => {
        const active = page === it.key;
        return (
          <button
            key={it.key} onClick={() => setPage(it.key)} className="spnhs-focus"
            style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "9px 4px", background: "none", border: "none", cursor: "pointer", color: active ? c.pine : c.inkSoft }}
          >
            <it.icon size={20} strokeWidth={active ? 2.4 : 2} />
            <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500 }}>{it.label === "Home" ? "Home" : it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function MobileDrawer({ open, onClose, page, setPage }) {
  const { c, user, logout } = useApp();
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(15,23,20,0.5)" }} />
      <div className="spnhs-fade-in" style={{ position: "relative", width: 280, height: "100%", background: c.surface, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <Seal size={36} />
          <div>
            <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 15, color: c.ink }}>SPHS Portal</div>
            <div style={{ fontSize: 10, color: c.inkSoft }}>One Portal. One School.</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: c.inkSoft }}><X size={20} /></button>
        </div>
        <div style={{ flex: 1 }}>
          {NAV[user.role].map((it) => (
            <button
              key={it.key} onClick={() => { setPage(it.key); onClose(); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 12px",
                borderRadius: 10, marginBottom: 2, border: "none", textAlign: "left",
                background: page === it.key ? c.pineSoft : "transparent", color: page === it.key ? c.pine : c.ink,
                fontWeight: page === it.key ? 700 : 500, fontSize: 14,
              }}
            >
              <it.icon size={18} /> {it.label}
            </button>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${c.line}`, paddingTop: 14 }}>
          <SignedInCard />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   LOGIN
============================================================================ */

function LandingPage({ onLogin, onRegister }) {
  const { c, theme, setTheme } = useApp();
  const roleCards = [
    { role: "Students", icon: GraduationCap, blurb: "Assignments, quizzes, grades, attendance, and the school feed — all in one place." },
    { role: "Teachers", icon: UserCog, blurb: "Manage classes, grade submissions, take attendance, and post announcements in minutes." },
    { role: "Administrators", icon: Building2, blurb: "Oversee enrollment, staffing, school-wide analytics, and communications from one dashboard." },
  ];
  return (
    <div className="spnhs-root spnhs-fade-in" style={{ minHeight: "100vh", background: c.bg, color: c.ink }}>
      {FONTS}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: `1px solid ${c.line}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Seal size={36} />
          <div>
            <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 16 }}>SPHS Portal</div>
            <div style={{ fontSize: 10.5, color: c.inkSoft }}>Santa Praxedes High School</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 999, padding: 8, cursor: "pointer", color: c.ink }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <Button variant="secondary" onClick={onLogin}>Log in</Button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "60px 24px 40px", textAlign: "center", position: "relative" }}>
        <Badge tone="gold" small>S.Y. 2026 – 2027 now enrolling</Badge>
        <h1 className="spnhs-display" style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 600, lineHeight: 1.1, margin: "18px 0 14px" }}>
          "One Portal. One School. One Community."
        </h1>
        <p style={{ fontSize: 15.5, color: c.inkSoft, maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.6 }}>
          Everything students, teachers, and administrators need to run Santa Praxedes High School —
          assignments, grades, attendance, the school feed, and more — in one clean, mobile-friendly portal.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <Button size="lg" onClick={onLogin}>Log in to SPHS Portal</Button>
          <Button size="lg" variant="secondary" onClick={onRegister}>Request an account</Button>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px 60px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
        {roleCards.map((r) => (
          <Card key={r.role} hover>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <r.icon size={20} color={c.pine} />
            </div>
            <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{r.role}</div>
            <div style={{ fontSize: 13, color: c.inkSoft, lineHeight: 1.55 }}>{r.blurb}</div>
          </Card>
        ))}
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 24px 70px" }}>
        <SectionTitle icon={Megaphone}>From the school feed</SectionTitle>
        {initialAnnouncements.filter((a) => a.pinned).slice(0, 2).map((a) => (
          <Card key={a.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
              <Badge tone={CATEGORY_META[a.category]?.color || "pine"} small>{a.category}</Badge>
            </div>
            <div className="spnhs-display" style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 4 }}>{a.title}</div>
            <div style={{ fontSize: 12.5, color: c.inkSoft }}>{a.body}</div>
          </Card>
        ))}
      </div>

      <div style={{ textAlign: "center", padding: "20px 24px 40px", fontSize: 11.5, color: c.inkSoft, borderTop: `1px solid ${c.line}` }}>
        © 2026 Santa Praxedes High School · Registrar's Office
      </div>
    </div>
  );
}

function RegisterForm({ onBack }) {
  const { c } = useApp();
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [idNum, setIdNum] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const canSubmit = name && idNum && email && pw && pw === pw2;

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <CheckCircle2 size={26} color={c.pine} />
        </div>
        <h2 className="spnhs-display" style={{ margin: "0 0 6px", fontSize: 20, color: c.ink }}>Request submitted</h2>
        <p style={{ fontSize: 13.5, color: c.inkSoft, lineHeight: 1.6, marginBottom: 18 }}>
          Thanks, {name.split(" ")[0] || "there"}. Your {role} account request has been sent to the
          Registrar's Office for approval. You'll receive an email once it's activated.
        </p>
        <Button variant="secondary" onClick={onBack} style={{ width: "100%", justifyContent: "center" }}>Back to login</Button>
      </div>
    );
  }

  return (
    <>
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.inkSoft, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 14, fontSize: 13 }}>
        <ArrowLeft size={15} /> Back to login
      </button>
      <h2 className="spnhs-display" style={{ margin: "0 0 4px", fontSize: 22, color: c.ink }}>Request an account</h2>
      <p style={{ margin: "0 0 18px", fontSize: 13.5, color: c.inkSoft }}>
        New accounts are activated by the Registrar's Office. Submit your details below.
      </p>
      <Field label="I am a">
        <div style={{ display: "flex", gap: 6 }}>
          {["student", "teacher"].map((r) => (
            <button
              key={r} onClick={() => setRole(r)}
              style={{
                flex: 1, padding: "8px 6px", borderRadius: 9, border: `1px solid ${role === r ? c.pine : c.line}`,
                background: role === r ? c.pineSoft : "transparent", color: role === r ? c.pine : c.inkSoft,
                fontWeight: 700, fontSize: 12.5, cursor: "pointer", textTransform: "capitalize",
              }}
            >{r}</button>
          ))}
        </div>
      </Field>
      <Field label="Full name">
        <input value={name} onChange={(e) => setName(e.target.value)} className="spnhs-focus" style={inputStyle(c)} placeholder="Juan Dela Cruz" />
      </Field>
      <Field label={role === "student" ? "Student ID (LRN)" : "Teacher ID"}>
        <input value={idNum} onChange={(e) => setIdNum(e.target.value)} className="spnhs-focus" style={inputStyle(c)} placeholder={role === "student" ? "2026-00000" : "T-000"} />
      </Field>
      <Field label="Email">
        <input value={email} onChange={(e) => setEmail(e.target.value)} className="spnhs-focus" style={inputStyle(c)} placeholder="you@sphs.edu.ph" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Password">
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="spnhs-focus" style={inputStyle(c)} />
        </Field>
        <Field label="Confirm password">
          <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} className="spnhs-focus" style={{ ...inputStyle(c), border: `1px solid ${mismatch ? c.red : c.line}` }} />
        </Field>
      </div>
      {mismatch && <div style={{ fontSize: 12, color: c.red, marginBottom: 10, marginTop: -6 }}>Passwords don't match.</div>}
      <Button disabled={!canSubmit} onClick={() => setSubmitted(true)} style={{ width: "100%", justifyContent: "center", marginTop: 4 }}>
        Submit request
      </Button>
    </>
  );
}

function LoginScreen({ initialMode = "login", onBackToLanding }) {
  const { c, login, theme, setTheme } = useApp();
  const [role, setRole] = useState("student");
  const [emailVal, setEmailVal] = useState("student@sphs.edu.ph");
  const [pw, setPw] = useState("");
  const [mode, setMode] = useState(initialMode); // login | forgot | register
  const [sent, setSent] = useState(false);

  const demoAccounts = {
    student: { email: "student@sphs.edu.ph", name: "Maria Santos", section: "Grade 10 - Rizal" },
    teacher: { email: "teacher@sphs.edu.ph", name: "Juan Dela Cruz" },
    admin: { email: "admin@sphs.edu.ph", name: "Dr. Corazon Reyes" },
  };

  const pickRole = (r) => { setRole(r); setEmailVal(demoAccounts[r].email); };

  return (
    <div className="spnhs-root spnhs-fade-in" style={{ minHeight: "100vh", background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      {FONTS}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        style={{ position: "absolute", top: 18, right: 18, background: c.surface, border: `1px solid ${c.line}`, borderRadius: 999, padding: 8, cursor: "pointer", color: c.ink }}
      >
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </button>
      <div style={{ width: "100%", maxWidth: 900, display: "grid", gridTemplateColumns: "1.1fr 1fr", borderRadius: 22, overflow: "hidden", border: `1px solid ${c.line}`, boxShadow: "0 20px 50px rgba(20,30,25,0.12)" }} className="login-grid">
        <div style={{ background: c.pineDeep, padding: 40, color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }} className="login-hero">
          <div className="spnhs-perf" style={{ position: "absolute", inset: 0, opacity: 0.06 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Seal size={40} />
            </div>
            <div>
              <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 17 }}>SPHS Portal</div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>Santa Praxedes High School</div>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <div className="spnhs-display" style={{ fontSize: 32, lineHeight: 1.15, fontWeight: 600, marginBottom: 14 }}>
              "One Portal. One School. One Community."
            </div>
            <p style={{ fontSize: 13.5, opacity: 0.8, lineHeight: 1.6, maxWidth: 340 }}>
              Assignments, grades, attendance, announcements, and the whole school feed —
              in one report-card-simple place for students, teachers, and administrators.
            </p>
          </div>
          <div style={{ position: "relative", fontSize: 11, opacity: 0.6 }}>S.Y. 2026 – 2027 · Registrar's Office</div>
        </div>

        <div style={{ background: c.surface, padding: 40 }}>
          {onBackToLanding && (
            <button onClick={onBackToLanding} style={{ background: "none", border: "none", color: c.inkSoft, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 14, fontSize: 12.5, fontWeight: 600 }}>
              <ArrowLeft size={14} /> Back to SPHS Portal home
            </button>
          )}
          {mode === "login" ? (
            <>
              <h2 className="spnhs-display" style={{ margin: "0 0 4px", fontSize: 24, color: c.ink }}>Welcome back</h2>
              <p style={{ margin: "0 0 20px", fontSize: 13.5, color: c.inkSoft }}>Sign in to continue to your portal.</p>

              <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
                {["student", "teacher", "admin"].map((r) => (
                  <button
                    key={r} onClick={() => pickRole(r)}
                    style={{
                      flex: 1, padding: "8px 6px", borderRadius: 9, border: `1px solid ${role === r ? c.pine : c.line}`,
                      background: role === r ? c.pineSoft : "transparent", color: role === r ? c.pine : c.inkSoft,
                      fontWeight: 700, fontSize: 12.5, cursor: "pointer", textTransform: "capitalize",
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <Field label="Email / Username">
                <input value={emailVal} onChange={(e) => setEmailVal(e.target.value)} className="spnhs-focus" style={inputStyle(c)} />
              </Field>
              <Field label="Password">
                <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Use any password for this demo" className="spnhs-focus" style={inputStyle(c)} />
              </Field>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: c.inkSoft }}>
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <button onClick={() => setMode("forgot")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 600, cursor: "pointer" }}>
                  Forgot password?
                </button>
              </div>
              <Button onClick={() => login(role, demoAccounts[role].name, emailVal, demoAccounts[role].section)} style={{ width: "100%", justifyContent: "center" }} size="lg">
                Log in as {role}
              </Button>
              <div style={{ textAlign: "center", marginTop: 14, fontSize: 12.5, color: c.inkSoft }}>
                New to SPHS?{" "}
                <button onClick={() => { setSent(false); setMode("register"); }} style={{ background: "none", border: "none", color: c.pine, fontWeight: 700, cursor: "pointer", fontSize: 12.5 }}>
                  Request an account
                </button>
              </div>
              <div style={{ marginTop: 14, padding: 12, borderRadius: 10, background: c.surface2, fontSize: 11.5, color: c.inkSoft, lineHeight: 1.6 }}>
                <strong style={{ color: c.ink }}>Demo accounts</strong><br />
                student@sphs.edu.ph · teacher@sphs.edu.ph · admin@sphs.edu.ph<br />
                Any password works in this preview.
              </div>
            </>
          ) : mode === "forgot" ? (
            <>
              <button onClick={() => setMode("login")} style={{ background: "none", border: "none", color: c.inkSoft, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 14, fontSize: 13 }}>
                <ArrowLeft size={15} /> Back to login
              </button>
              <h2 className="spnhs-display" style={{ margin: "0 0 4px", fontSize: 22, color: c.ink }}>Reset your password</h2>
              <p style={{ margin: "0 0 18px", fontSize: 13.5, color: c.inkSoft }}>We'll send a reset link to your registered school email.</p>
              {!sent ? (
                <>
                  <Field label="Email address">
                    <input placeholder="you@sphs.edu.ph" className="spnhs-focus" style={inputStyle(c)} />
                  </Field>
                  <Button onClick={() => setSent(true)} style={{ width: "100%", justifyContent: "center" }}>Send reset link</Button>
                </>
              ) : (
                <div style={{ padding: 14, borderRadius: 10, background: c.pineSoft, color: c.pine, fontSize: 13.5, display: "flex", gap: 8 }}>
                  <CheckCircle2 size={18} /> Check your inbox — a reset link is on its way.
                </div>
              )}
            </>
          ) : (
            <RegisterForm onBack={() => { setSent(false); setMode("login"); }} />
          )}
        </div>
      </div>
      <style>{`
        @media (max-width: 760px) {
          .login-grid { grid-template-columns: 1fr !important; }
          .login-hero { display: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   FEED / ANNOUNCEMENTS
============================================================================ */

function FeedPost({ post, onPin, onDelete, canManage }) {
  const { c } = useApp();
  const tone = CATEGORY_META[post.category]?.color || "pine";
  const icon = { School: Megaphone, Academic: GraduationCap, Events: PartyPopper, Emergency: AlertCircle, Reminder: Clock, Class: BookOpen }[post.category] || Megaphone;
  const Icon = icon;
  return (
    <Card style={{ marginBottom: 12, position: "relative" }} hover>
      {post.pinned && (
        <div style={{ position: "absolute", top: 14, right: 14, color: c.gold }}><Pin size={15} fill={c.gold} /></div>
      )}
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={18} color={c.pine} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginBottom: 6 }}>
            <Badge tone={tone} small>{post.category}</Badge>
            <span style={{ fontSize: 11.5, color: c.inkSoft }}>{post.audience}</span>
          </div>
          <div className="spnhs-display" style={{ fontWeight: 600, fontSize: 15.5, color: c.ink, marginBottom: 4 }}>{post.title}</div>
          <div style={{ fontSize: 13.5, color: c.inkSoft, lineHeight: 1.55, marginBottom: 10 }}>{post.body}</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5, color: c.inkSoft }}>
            <span>{post.author} · {post.date}</span>
            {canManage && (
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => onPin(post.id)} style={{ background: "none", border: "none", color: c.inkSoft, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <Pin size={13} /> {post.pinned ? "Unpin" : "Pin"}
                </button>
                <button onClick={() => onDelete(post.id)} style={{ background: "none", border: "none", color: c.red, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function ComposeAnnouncement({ onClose, onSubmit }) {
  const { c } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("Class");
  const [audience, setAudience] = useState("Everyone");
  return (
    <Modal title="Create post" onClose={onClose}>
      <Field label="Title">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="spnhs-focus" style={inputStyle(c)} placeholder="e.g. Quiz moved to Friday" />
      </Field>
      <Field label="Description">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="spnhs-focus" style={{ ...inputStyle(c), resize: "vertical" }} placeholder="Write the details…" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Field label="Category">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="spnhs-focus" style={inputStyle(c)}>
            {Object.keys(CATEGORY_META).map((k) => <option key={k}>{k}</option>)}
          </select>
        </Field>
        <Field label="Audience">
          <select value={audience} onChange={(e) => setAudience(e.target.value)} className="spnhs-focus" style={inputStyle(c)}>
            <option>Everyone</option><option>Students</option><option>Teachers</option>
            <option>Grade 10 - Rizal</option><option>Grade 9 - Bonifacio</option>
          </select>
        </Field>
      </div>
      <Field label="Attachment (optional)">
        <div style={{ border: `1px dashed ${c.line}`, borderRadius: 10, padding: 14, textAlign: "center", color: c.inkSoft, fontSize: 12.5 }}>
          <Paperclip size={16} style={{ marginBottom: 4 }} /><br />Drop a file or click to attach
        </div>
      </Field>
      <Button
        style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
        disabled={!title || !body}
        onClick={() => { onSubmit({ title, body, category, audience }); onClose(); }}
      >
        Publish post
      </Button>
    </Modal>
  );
}

function FeedPage() {
  const { c, user, announcements, setAnnouncements } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [compose, setCompose] = useState(false);
  const canManage = user.role === "teacher" || user.role === "admin";

  const filtered = useMemo(() => {
    return announcements
      .filter((a) => (cat === "All" ? true : a.category === cat))
      .filter((a) => a.title.toLowerCase().includes(q.toLowerCase()) || a.body.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => (b.pinned - a.pinned) || (new Date(b.date) - new Date(a.date)));
  }, [announcements, q, cat]);

  const togglePin = (id) => setAnnouncements((prev) => prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)));
  const del = (id) => setAnnouncements((prev) => prev.filter((p) => p.id !== id));
  const add = (payload) => {
    setAnnouncements((prev) => [
      { id: "A-" + Date.now(), author: user.name, authorRole: user.role, date: new Date().toISOString().slice(0, 10), pinned: false, image: null, ...payload },
      ...prev,
    ]);
  };

  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: c.inkSoft }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the feed…" className="spnhs-focus" style={{ ...inputStyle(c), paddingLeft: 32 }} />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="spnhs-focus" style={{ ...inputStyle(c), width: "auto" }}>
          <option>All</option>
          {Object.keys(CATEGORY_META).map((k) => <option key={k}>{k}</option>)}
        </select>
        {canManage && <Button icon={Plus} onClick={() => setCompose(true)}>New post</Button>}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={Megaphone} title="No posts found" body="Try a different search term or category." />
      ) : (
        filtered.map((p) => <FeedPost key={p.id} post={p} onPin={togglePin} onDelete={del} canManage={canManage} />)
      )}
      {compose && <ComposeAnnouncement onClose={() => setCompose(false)} onSubmit={add} />}
    </div>
  );
}

/* ============================================================================
   STUDENT: DASHBOARD
============================================================================ */

function SummaryCard({ icon: Icon, label, value, tone = "pine", sub }) {
  const { c } = useApp();
  const toneColor = { pine: c.pine, gold: c.gold, red: c.red, blue: c.blue }[tone];
  return (
    <Card hover style={{ minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: toneColor + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={17} color={toneColor} />
        </div>
        <div style={{ fontSize: 12.5, color: c.inkSoft, fontWeight: 600 }}>{label}</div>
      </div>
      <div className="spnhs-mono" style={{ fontSize: 26, fontWeight: 700, color: c.ink }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: c.inkSoft, marginTop: 2 }}>{sub}</div>}
    </Card>
  );
}

function StudentDashboard() {
  const { c, user, setPage, announcements, tasks, assignments } = useApp();
  const pending = assignments.filter((a) => a.status === "Pending" || a.status === "Overdue").length;
  const firstName = user.name.split(" ")[0];
  return (
    <div className="spnhs-fade-in">
      <Card style={{ background: c.pineDeep, color: "#fff", border: "none", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div className="spnhs-perf" style={{ position: "absolute", inset: 0, opacity: 0.05 }} />
        <div style={{ position: "relative" }}>
          <div className="spnhs-display" style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Good morning, {firstName}! ☀️</div>
          <div style={{ fontSize: 13.5, opacity: 0.85 }}>Here's what's happening at SPHS today — Grade 10 - Rizal.</div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <SummaryCard icon={BookOpen} label="Today's Classes" value={scheduleToday.length} tone="pine" />
        <SummaryCard icon={ClipboardList} label="Pending Assignments" value={pending} tone="gold" />
        <SummaryCard icon={HelpCircle} label="Upcoming Exams" value="2" tone="red" />
        <SummaryCard icon={CalendarCheck} label="Attendance" value="96%" tone="blue" />
        <SummaryCard icon={GraduationCap} label="Current Average" value="92.3" tone="pine" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }} className="dash-grid">
        <div>
          <Card style={{ marginBottom: 18 }}>
            <SectionTitle icon={Clock} action={<button onClick={() => setPage("calendar")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>Full schedule <ChevronRight size={14} /></button>}>Today's Schedule</SectionTitle>
            {scheduleToday.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < scheduleToday.length - 1 ? `1px solid ${c.line}` : "none" }}>
                <div className="spnhs-mono" style={{ fontSize: 12, color: c.pine, fontWeight: 700, width: 96, flexShrink: 0 }}>{s.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: c.ink }}>{s.subject}</div>
                  <div style={{ fontSize: 12, color: c.inkSoft }}>{s.teacher} · {s.room}</div>
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <SectionTitle icon={ClipboardList} action={<button onClick={() => setPage("assignments")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 3 }}>View all <ChevronRight size={14} /></button>}>Upcoming Assignments</SectionTitle>
            {assignments.slice(0, 4).map((a, i) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < 3 ? `1px solid ${c.line}` : "none" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: c.ink }}>{a.title}</div>
                  <div style={{ fontSize: 11.5, color: c.inkSoft }}>{a.subject} · Due {a.due}</div>
                </div>
                <Badge tone={statusTone(a.status)} small stamp>{a.status}</Badge>
              </div>
            ))}
          </Card>
        </div>

        <div>
          <Card style={{ marginBottom: 18 }}>
            <SectionTitle icon={Megaphone} action={<button onClick={() => setPage("feed")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>See all</button>}>Latest Announcements</SectionTitle>
            {announcements.slice(0, 3).map((a, i) => (
              <div key={a.id} style={{ padding: "9px 0", borderBottom: i < 2 ? `1px solid ${c.line}` : "none" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: c.ink, marginBottom: 2 }}>{a.title}</div>
                <div style={{ fontSize: 11.5, color: c.inkSoft }}>{a.date}</div>
              </div>
            ))}
          </Card>

          <Card style={{ marginBottom: 18 }}>
            <SectionTitle icon={PartyPopper} action={<button onClick={() => setPage("events")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>See all</button>}>Upcoming Events</SectionTitle>
            {initialEvents.slice(0, 2).map((e, i) => (
              <div key={e.id} style={{ padding: "9px 0", borderBottom: i < 1 ? `1px solid ${c.line}` : "none" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: c.ink }}>{e.title}</div>
                <div style={{ fontSize: 11.5, color: c.inkSoft }}>{e.date} · {e.location}</div>
              </div>
            ))}
          </Card>

          <Card>
            <SectionTitle icon={ListChecks} action={<button onClick={() => setPage("tasks")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>My tasks</button>}>Today's Tasks</SectionTitle>
            {tasks.filter((t) => t.group === "today").map((t, i, arr) => (
              <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: i < arr.length - 1 ? `1px solid ${c.line}` : "none" }}>
                {t.done ? <CheckCircle2 size={16} color={c.pine} /> : <Circle size={16} color={c.inkSoft} />}
                <span style={{ fontSize: 13, color: t.done ? c.inkSoft : c.ink, textDecoration: t.done ? "line-through" : "none" }}>{t.title}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

/* ============================================================================
   STUDENT: SUBJECTS
============================================================================ */

const SUBJECT_TABS = ["Overview", "Announcements", "Assignments", "Quizzes", "Materials", "Grades"];

function SubjectDetail({ subject, onBack }) {
  const { c, assignments, announcements } = useApp();
  const [tab, setTab] = useState("Overview");
  const subjAssignments = assignments.filter((a) => a.subject === subject.name);
  const subjAnnouncements = announcements.filter((a) => a.audience === subject.section || a.audience === "Everyone");
  const grade = gradesData[subject.name];

  return (
    <div className="spnhs-fade-in">
      <button onClick={onBack} style={{ background: "none", border: "none", color: c.inkSoft, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 14, fontSize: 13, fontWeight: 600 }}>
        <ArrowLeft size={15} /> Back to subjects
      </button>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 50, height: 50, borderRadius: 12, background: c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookOpen size={24} color={c.pine} />
          </div>
          <div>
            <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 20, color: c.ink }}>{subject.name}</div>
            <div style={{ fontSize: 13, color: c.inkSoft }}>{subject.teacher} · {subject.section}</div>
          </div>
        </div>
      </Card>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {SUBJECT_TABS.map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            style={{
              padding: "7px 14px", borderRadius: 999, border: `1px solid ${tab === t ? c.pine : c.line}`,
              background: tab === t ? c.pine : "transparent", color: tab === t ? "#fff" : c.inkSoft,
              fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <Card>
          <SectionTitle icon={CalendarDays}>Schedule</SectionTitle>
          <div style={{ fontSize: 14, color: c.ink, marginBottom: 4 }}>{subject.schedule}</div>
          <div style={{ fontSize: 13, color: c.inkSoft }}>{subject.room}</div>
        </Card>
      )}
      {tab === "Announcements" && (
        subjAnnouncements.length ? subjAnnouncements.map((a) => <FeedPost key={a.id} post={a} canManage={false} />) : <EmptyState icon={Megaphone} title="No announcements yet" body="Your teacher hasn't posted anything for this subject." />
      )}
      {tab === "Assignments" && (
        subjAssignments.length ? subjAssignments.map((a) => (
          <Card key={a.id} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: c.ink }}>{a.title}</div>
                <div style={{ fontSize: 12, color: c.inkSoft }}>Due {a.due} · {a.points} pts</div>
              </div>
              <Badge tone={statusTone(a.status)} stamp small>{a.status}</Badge>
            </div>
          </Card>
        )) : <EmptyState icon={ClipboardList} title="No assignments yet" body="Your teacher hasn't posted any assignments." />
      )}
      {tab === "Quizzes" && (
        initialQuizzes.filter((q) => q.subject === subject.name).length ? initialQuizzes.filter((q) => q.subject === subject.name).map((q) => (
          <Card key={q.id} style={{ marginBottom: 10 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: c.ink }}>{q.title}</div>
            <div style={{ fontSize: 12, color: c.inkSoft }}>{q.questions.length} items · {q.timeLimit} min · Due {q.due}</div>
          </Card>
        )) : <EmptyState icon={HelpCircle} title="No quizzes yet" body="Check back later for new quizzes." />
      )}
      {tab === "Materials" && (
        initialMaterials.filter((m) => m.subject === subject.name).length ? initialMaterials.filter((m) => m.subject === subject.name).map((m) => (
          <Card key={m.id} style={{ marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <FileText size={18} color={c.pine} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: c.ink }}>{m.title}</div>
                <div style={{ fontSize: 11.5, color: c.inkSoft }}>{m.type} · {m.size}</div>
              </div>
            </div>
            <Button size="sm" variant="secondary" icon={Download}>Get</Button>
          </Card>
        )) : <EmptyState icon={FolderOpen} title="No materials yet" body="Learning materials will appear here once uploaded." />
      )}
      {tab === "Grades" && grade && (
        <Card>
          <SectionTitle icon={GraduationCap}>Grade breakdown</SectionTitle>
          {Object.entries(grade).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${c.line}` }}>
              <span style={{ fontSize: 13.5, color: c.inkSoft, textTransform: "capitalize" }}>{k}</span>
              <span className="spnhs-mono" style={{ fontWeight: 700, color: c.ink }}>{v}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function SubjectsPage() {
  const { c, user } = useApp();
  const [selected, setSelected] = useState(null);
  const mySubjects = SUBJECTS.filter((s) => s.section === user.section);
  if (selected) return <SubjectDetail subject={selected} onBack={() => setSelected(null)} />;
  if (mySubjects.length === 0) return <EmptyState icon={BookOpen} title="No subjects yet" body="Your class subjects will appear here once enrollment is finalized." />;
  return (
    <div className="spnhs-fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
      {mySubjects.map((s) => (
        <Card key={s.id} hover onClick={() => setSelected(s)}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <BookOpen size={20} color={c.pine} />
          </div>
          <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 16, color: c.ink, marginBottom: 4 }}>{s.name}</div>
          <div style={{ fontSize: 12.5, color: c.inkSoft, marginBottom: 10 }}>Teacher: {s.teacher}<br />Section: {s.section}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11.5, color: c.inkSoft, borderTop: `1px solid ${c.line}`, paddingTop: 10 }}>
            <span>{s.schedule}</span>
            <ChevronRight size={14} />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ============================================================================
   STUDENT: ASSIGNMENTS
============================================================================ */

function AssignmentDetailModal({ a, onClose, onSubmit }) {
  const { c } = useApp();
  const [comment, setComment] = useState("");
  const [file, setFile] = useState("");
  return (
    <Modal title={a.title} onClose={onClose}>
      <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
        <Badge tone="pine" small>{a.subject}</Badge>
        <Badge tone={statusTone(a.status)} small stamp>{a.status}</Badge>
        <Badge tone="ink" small>{a.points} pts</Badge>
      </div>
      <div style={{ fontSize: 12.5, color: c.inkSoft, marginBottom: 10 }}>Teacher: {a.teacher} · Due {a.due}</div>
      <div style={{ fontSize: 13.5, color: c.ink, lineHeight: 1.6, marginBottom: 14 }}>{a.instructions}</div>
      {a.attachments?.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {a.attachments.map((f) => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: c.pine, marginBottom: 6 }}>
              <Paperclip size={14} /> {f}
            </div>
          ))}
        </div>
      )}
      {a.status === "Graded" ? (
        <Card style={{ background: c.pineSoft, border: "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontWeight: 700, color: c.ink }}>Your score</span>
            <span className="spnhs-mono" style={{ fontWeight: 700, color: c.pine }}>{a.grade}/{a.points}</span>
          </div>
          <div style={{ fontSize: 13, color: c.inkSoft }}>{a.feedback}</div>
        </Card>
      ) : (
        <>
          <Field label="Upload submission">
            <div
              onClick={() => setFile(a.title.toLowerCase().replace(/\s+/g, "-") + "-submission.pdf")}
              style={{ border: `1px dashed ${c.line}`, borderRadius: 10, padding: 16, textAlign: "center", color: c.inkSoft, fontSize: 12.5, cursor: "pointer" }}
            >
              <Upload size={18} style={{ marginBottom: 4 }} /><br />
              {file ? <span style={{ color: c.pine, fontWeight: 600 }}>{file}</span> : "Click to choose a file"}
            </div>
          </Field>
          <Field label="Comment (optional)">
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="spnhs-focus" style={{ ...inputStyle(c), resize: "vertical" }} placeholder="Add a note for your teacher…" />
          </Field>
          <Button style={{ width: "100%", justifyContent: "center" }} disabled={!file} onClick={() => { onSubmit(a.id); onClose(); }}>
            Submit assignment
          </Button>
        </>
      )}
    </Modal>
  );
}

function AssignmentsPage() {
  const { c, assignments, setAssignments } = useApp();
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const statuses = ["All", "Pending", "Submitted", "Graded", "Overdue"];
  const filtered = filter === "All" ? assignments : assignments.filter((a) => a.status === filter);

  const submit = (id) => setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Submitted" } : a)));

  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: "7px 14px", borderRadius: 999, border: `1px solid ${filter === s ? c.pine : c.line}`,
            background: filter === s ? c.pine : "transparent", color: filter === s ? "#fff" : c.inkSoft,
            fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
          }}>{s}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No assignments here" body="Nothing matches this filter right now." />
      ) : filtered.map((a) => (
        <Card key={a.id} hover onClick={() => setOpen(a)} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: c.ink, marginBottom: 3 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: c.inkSoft }}>{a.subject} · {a.teacher} · Due {a.due} · {a.points} pts</div>
            </div>
            <Badge tone={statusTone(a.status)} stamp small>{a.status}</Badge>
          </div>
        </Card>
      ))}
      {open && <AssignmentDetailModal a={open} onClose={() => setOpen(null)} onSubmit={submit} />}
    </div>
  );
}

/* ============================================================================
   STUDENT: QUIZZES
============================================================================ */

function QuizRunner({ quiz, onClose, onFinish }) {
  const { c } = useApp();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [done, setDone] = useState(false);
  const q = quiz.questions[i];

  const score = () => quiz.questions.reduce((s, qq) => s + (answers[qq.id] === qq.answer ? 1 : 0), 0);

  if (done) {
    const s = score();
    return (
      <Modal title="Quiz results" onClose={onClose}>
        <div style={{ textAlign: "center", padding: "10px 0 20px" }}>
          <Award size={40} color={c.gold} style={{ marginBottom: 10 }} />
          <div className="spnhs-mono" style={{ fontSize: 34, fontWeight: 700, color: c.ink }}>{s}/{quiz.questions.length}</div>
          <div style={{ fontSize: 13, color: c.inkSoft, marginTop: 4 }}>{Math.round((s / quiz.questions.length) * quiz.points)} of {quiz.points} points</div>
        </div>
        <Button style={{ width: "100%", justifyContent: "center" }} onClick={() => { onFinish(quiz.id, s); onClose(); }}>Done</Button>
      </Modal>
    );
  }

  return (
    <Modal title={quiz.title} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: c.inkSoft, marginBottom: 12 }}>
        <span>Question {i + 1} of {quiz.questions.length}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={13} /> {quiz.timeLimit} min</span>
      </div>
      <div style={{ height: 5, background: c.surface2, borderRadius: 999, marginBottom: 18, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${((i + 1) / quiz.questions.length) * 100}%`, background: c.pine }} />
      </div>
      <div style={{ fontWeight: 600, fontSize: 15.5, color: c.ink, marginBottom: 14 }}>{q.q}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
        {q.options.map((opt, idx) => (
          <button
            key={idx} onClick={() => setAnswers((a) => ({ ...a, [q.id]: idx }))}
            style={{
              textAlign: "left", padding: "11px 14px", borderRadius: 10, cursor: "pointer",
              border: `1.5px solid ${answers[q.id] === idx ? c.pine : c.line}`,
              background: answers[q.id] === idx ? c.pineSoft : "transparent", color: c.ink, fontSize: 13.5,
            }}
          >
            {opt}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {i > 0 && <Button variant="secondary" onClick={() => setI(i - 1)}>Back</Button>}
        {i < quiz.questions.length - 1 ? (
          <Button style={{ flex: 1, justifyContent: "center" }} onClick={() => setI(i + 1)} disabled={answers[q.id] === undefined}>Next</Button>
        ) : (
          <Button style={{ flex: 1, justifyContent: "center" }} onClick={() => setDone(true)} disabled={answers[q.id] === undefined}>Submit quiz</Button>
        )}
      </div>
    </Modal>
  );
}

function CreateQuizModal({ onClose, onSubmit }) {
  const { c } = useApp();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0].name);
  const [type, setType] = useState("mcq");
  const [timeLimit, setTimeLimit] = useState(10);
  const [points, setPoints] = useState(20);
  const [due, setDue] = useState("2026-09-01");
  const [qText, setQText] = useState("");
  const [opts, setOpts] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState(0);
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    if (!qText.trim()) return;
    const options = type === "tf" ? ["True", "False"] : opts.filter((o) => o.trim());
    setQuestions((prev) => [...prev, { id: prev.length + 1, type, q: qText, options, answer }]);
    setQText(""); setOpts(["", "", "", ""]); setAnswer(0);
  };

  return (
    <Modal title="Create quiz" onClose={onClose} width={600}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
        <Field label="Quiz title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="Class"><select value={subject} onChange={(e) => setSubject(e.target.value)} className="spnhs-focus" style={inputStyle(c)}>{SUBJECTS.map((s) => <option key={s.id}>{s.name}</option>)}</select></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Field label="Time limit (min)"><input type="number" value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="Points"><input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="Due date"><input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
      </div>

      <div style={{ background: c.surface2, borderRadius: 12, padding: 14, marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: c.inkSoft, marginBottom: 10 }}>ADD A QUESTION ({questions.length} added so far)</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {[{ k: "mcq", l: "Multiple choice" }, { k: "tf", l: "True / False" }, { k: "identification", l: "Identification" }, { k: "short", l: "Short answer" }].map((t) => (
            <button key={t.k} onClick={() => setType(t.k)} style={{ padding: "5px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, border: `1px solid ${type === t.k ? c.pine : c.line}`, background: type === t.k ? c.pineSoft : "transparent", color: type === t.k ? c.pine : c.inkSoft, cursor: "pointer" }}>{t.l}</button>
          ))}
        </div>
        <Field label="Question text"><input value={qText} onChange={(e) => setQText(e.target.value)} className="spnhs-focus" style={inputStyle(c)} placeholder="Type the question…" /></Field>
        {type === "mcq" && (
          <>
            {opts.map((o, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                <input type="radio" checked={answer === i} onChange={() => setAnswer(i)} />
                <input value={o} onChange={(e) => setOpts((prev) => prev.map((p, idx) => (idx === i ? e.target.value : p)))} className="spnhs-focus" style={inputStyle(c)} placeholder={`Option ${i + 1}`} />
              </div>
            ))}
          </>
        )}
        {type === "tf" && (
          <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
            <label style={{ fontSize: 13, color: c.ink, display: "flex", alignItems: "center", gap: 5 }}><input type="radio" checked={answer === 0} onChange={() => setAnswer(0)} /> True</label>
            <label style={{ fontSize: 13, color: c.ink, display: "flex", alignItems: "center", gap: 5 }}><input type="radio" checked={answer === 1} onChange={() => setAnswer(1)} /> False</label>
          </div>
        )}
        <Button size="sm" variant="secondary" icon={Plus} onClick={addQuestion}>Add question to quiz</Button>
      </div>

      <Button
        style={{ width: "100%", justifyContent: "center" }}
        disabled={!title || questions.length === 0}
        onClick={() => { onSubmit({ title, subject, questions, timeLimit, points, due }); onClose(); }}
      >
        Publish quiz ({questions.length} item{questions.length === 1 ? "" : "s"})
      </Button>
    </Modal>
  );
}

function QuizzesPage() {
  const { c, user } = useApp();
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [active, setActive] = useState(null);
  const [creating, setCreating] = useState(false);
  const isTeacher = user.role === "teacher";

  const finish = (id, score) => setQuizzes((prev) => prev.map((q) => (q.id === id ? { ...q, status: "Completed", score } : q)));
  const publish = (payload) => setQuizzes((prev) => [{ id: "Q-" + Date.now(), teacher: user.name, status: "Not Started", ...payload }, ...prev]);

  return (
    <div className="spnhs-fade-in">
      {isTeacher && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <Button icon={Plus} onClick={() => setCreating(true)}>Create quiz</Button>
        </div>
      )}
      {quizzes.length === 0 ? (
        <EmptyState icon={HelpCircle} title="No quizzes yet" body="Quizzes you create will appear here." />
      ) : quizzes.map((q) => (
        <Card key={q.id} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 5 }}>
                <Badge tone="pine" small>{q.subject}</Badge>
                {!isTeacher && <Badge tone={statusTone(q.status)} small stamp>{q.status}</Badge>}
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, color: c.ink }}>{q.title}</div>
              <div style={{ fontSize: 12, color: c.inkSoft }}>{q.questions.length} items · {q.timeLimit} min · {q.points} pts · Due {q.due}</div>
            </div>
            {isTeacher ? (
              <Badge tone="blue" small>{Math.max(4, q.questions.length * 3)} responses</Badge>
            ) : q.status === "Completed" ? (
              <div className="spnhs-mono" style={{ fontWeight: 700, fontSize: 18, color: c.pine }}>{q.score}/{q.questions.length}</div>
            ) : (
              <Button onClick={() => setActive(q)}>Start quiz</Button>
            )}
          </div>
        </Card>
      ))}
      {active && <QuizRunner quiz={active} onClose={() => setActive(null)} onFinish={finish} />}
      {creating && <CreateQuizModal onClose={() => setCreating(false)} onSubmit={publish} />}
    </div>
  );
}

/* ============================================================================
   STUDENT: GRADES
============================================================================ */

function GradesPage() {
  const { c } = useApp();
  const chartData = Object.entries(gradesData).map(([subject, v]) => ({ subject: subject.length > 8 ? subject.slice(0, 8) + "…" : subject, grade: v.final }));
  return (
    <div className="spnhs-fade-in">
      <Card style={{ marginBottom: 18 }}>
        <SectionTitle icon={BarChart3}>Academic performance</SectionTitle>
        <div style={{ width: "100%", height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="grade" fill={c.pine} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      {Object.entries(gradesData).map(([subject, v]) => (
        <Card key={subject} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 15, color: c.ink }}>{subject}</div>
            <div className="spnhs-mono" style={{ fontWeight: 700, fontSize: 18, color: c.pine }}>{v.final}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {["activities", "quizzes", "exams", "projects"].map((k) => (
              <div key={k} style={{ background: c.surface2, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                <div style={{ fontSize: 10.5, color: c.inkSoft, textTransform: "capitalize", marginBottom: 2 }}>{k}</div>
                <div className="spnhs-mono" style={{ fontWeight: 700, fontSize: 15, color: c.ink }}>{v[k]}</div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ============================================================================
   STUDENT: ATTENDANCE
============================================================================ */

function AttendancePage() {
  const { c } = useApp();
  const present = attendanceHistory.filter((a) => a.status === "Present").length;
  const late = attendanceHistory.filter((a) => a.status === "Late").length;
  const absent = attendanceHistory.filter((a) => a.status === "Absent").length;
  const excused = attendanceHistory.filter((a) => a.status === "Excused").length;
  const statusColor = { Present: c.pine, Late: c.gold, Absent: c.red, Excused: c.blue };
  return (
    <div className="spnhs-fade-in">
      <Card style={{ marginBottom: 18, textAlign: "center" }}>
        <div style={{ width: 160, height: 160, margin: "0 auto" }}>
          <ResponsiveContainer>
            <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ value: 96, fill: c.pine }]} startAngle={90} endAngle={-270}>
              <RadialBar dataKey="value" cornerRadius={20} background={{ fill: c.surface2 }} />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="spnhs-mono" style={{ fontSize: 28, fontWeight: 700, color: c.ink, marginTop: -110 }}>96%</div>
        <div style={{ fontSize: 13, color: c.inkSoft, marginTop: 100 }}>Attendance rate this quarter</div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 18 }}>
        <SummaryCard icon={CheckCircle2} label="Present" value={present} tone="pine" />
        <SummaryCard icon={Clock} label="Late" value={late} tone="gold" />
        <SummaryCard icon={AlertCircle} label="Absent" value={absent} tone="red" />
        <SummaryCard icon={ShieldCheck} label="Excused" value={excused} tone="blue" />
      </div>
      <Card>
        <SectionTitle icon={CalendarCheck}>Recent history</SectionTitle>
        {attendanceHistory.map((a, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: i < attendanceHistory.length - 1 ? `1px solid ${c.line}` : "none" }}>
            <span style={{ fontSize: 13.5, color: c.ink }}>{a.date}</span>
            <Badge tone={{ Present: "pine", Late: "gold", Absent: "red", Excused: "blue" }[a.status]} small stamp>{a.status}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ============================================================================
   CALENDAR (shared)
============================================================================ */

function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function CalendarPage() {
  const { c, announcements, events } = useApp();
  const [view, setView] = useState("Month");
  const [cursor, setCursor] = useState(new Date(2026, 7, 1));
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const cells = buildMonthGrid(year, month);
  const monthName = cursor.toLocaleString("default", { month: "long" });

  const dayEvents = (d) => {
    if (!d) return [];
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const evs = events.filter((e) => e.date === dateStr).map((e) => ({ ...e, kind: "event" }));
    const assg = initialAssignments.filter((a) => a.due === dateStr).map((a) => ({ ...a, kind: "assignment" }));
    const anns = announcements.filter((a) => a.date === dateStr).map((a) => ({ ...a, kind: "announcement" }));
    return [...evs, ...assg, ...anns];
  };
  const kindColor = { event: c.gold, assignment: c.red, announcement: c.pine, class: c.blue };
  const [selectedDay, setSelectedDay] = useState(null);

  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="spnhs-focus" style={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, padding: 6, cursor: "pointer", color: c.ink }}><ChevronLeft size={16} /></button>
          <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 18, color: c.ink, minWidth: 160, textAlign: "center" }}>{monthName} {year}</div>
          <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="spnhs-focus" style={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, padding: 6, cursor: "pointer", color: c.ink }}><ChevronRight size={16} /></button>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Month", "Week", "Day", "Agenda"].map((v) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: "6px 12px", borderRadius: 999, border: `1px solid ${view === v ? c.pine : c.line}`,
              background: view === v ? c.pine : "transparent", color: view === v ? "#fff" : c.inkSoft, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
            }}>{v}</button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap", fontSize: 12, color: c.inkSoft }}>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: c.gold, display: "inline-block" }} /> Events</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: c.red, display: "inline-block" }} /> Assignments/Exams</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: c.pine, display: "inline-block" }} /> Announcements</span>
      </div>

      {view === "Agenda" ? (
        <Card>
          {[...events, ...initialAssignments.map((a) => ({ ...a, date: a.due, title: a.title }))]
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${c.line}` }}>
                <div className="spnhs-mono" style={{ fontSize: 12, color: c.pine, fontWeight: 700, width: 90 }}>{item.date}</div>
                <div style={{ fontSize: 13.5, color: c.ink }}>{item.title}</div>
              </div>
            ))}
        </Card>
      ) : (
        <Card style={{ padding: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 6 }}>
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: c.inkSoft, padding: "6px 0" }}>{d}</div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
            {cells.map((d, i) => {
              const evs = dayEvents(d);
              return (
                <div
                  key={i} onClick={() => d && setSelectedDay(d)}
                  style={{
                    minHeight: 66, borderRadius: 10, padding: 6, cursor: d ? "pointer" : "default",
                    background: d ? c.bg : "transparent", border: `1px solid ${c.line}`,
                  }}
                >
                  {d && <div style={{ fontSize: 12, fontWeight: 600, color: c.ink, marginBottom: 4 }}>{d}</div>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                    {evs.slice(0, 3).map((e, idx) => (
                      <span key={idx} style={{ width: 6, height: 6, borderRadius: "50%", background: kindColor[e.kind] }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {selectedDay && (
        <Modal title={`${monthName} ${selectedDay}, ${year}`} onClose={() => setSelectedDay(null)}>
          {dayEvents(selectedDay).length === 0 ? (
            <EmptyState icon={CalendarDays} title="Nothing scheduled" body="No classes, events, or deadlines on this day." />
          ) : dayEvents(selectedDay).map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${c.line}` }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: kindColor[e.kind], marginTop: 5 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: c.ink }}>{e.title}</div>
                <div style={{ fontSize: 11.5, color: c.inkSoft, textTransform: "capitalize" }}>{e.kind}</div>
              </div>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}

/* ============================================================================
   EVENTS
============================================================================ */

function EventsPage() {
  const { c, events, setEvents, user } = useApp();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);
  const [compose, setCompose] = useState(false);
  const canManage = user.role === "teacher" || user.role === "admin";
  const filtered = events.filter((e) => e.title.toLowerCase().includes(q.toLowerCase()));
  const toggleGoing = (id) => setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, going: !e.going } : e)));

  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: c.inkSoft }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="spnhs-focus" style={{ ...inputStyle(c), paddingLeft: 32 }} />
        </div>
        {canManage && <Button icon={Plus} onClick={() => setCompose(true)}>New event</Button>}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filtered.map((e) => (
          <Card key={e.id} hover onClick={() => setOpen(e)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: c.goldSoft, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div className="spnhs-mono" style={{ fontSize: 15, fontWeight: 700, color: c.gold, lineHeight: 1 }}>{e.date.slice(8, 10)}</div>
                <div style={{ fontSize: 9, color: c.gold, textTransform: "uppercase" }}>{new Date(e.date).toLocaleString("default", { month: "short" })}</div>
              </div>
              {e.going && <Badge tone="pine" small>Going</Badge>}
            </div>
            <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 15.5, color: c.ink, marginBottom: 4 }}>{e.title}</div>
            <div style={{ fontSize: 12, color: c.inkSoft, display: "flex", alignItems: "center", gap: 4, marginBottom: 2 }}><Clock size={12} /> {e.start} – {e.end}</div>
            <div style={{ fontSize: 12, color: c.inkSoft, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {e.location}</div>
          </Card>
        ))}
      </div>
      {open && (
        <Modal title={open.title} onClose={() => setOpen(null)}>
          <div style={{ fontSize: 13, color: c.inkSoft, marginBottom: 10 }}>{open.date} · {open.start} – {open.end}</div>
          <div style={{ fontSize: 13.5, color: c.ink, lineHeight: 1.6, marginBottom: 14 }}>{open.description}</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            <div style={{ background: c.surface2, borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 11, color: c.inkSoft }}>Location</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{open.location}</div>
            </div>
            <div style={{ background: c.surface2, borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 11, color: c.inkSoft }}>Organizer</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.ink }}>{open.organizer}</div>
            </div>
          </div>
          <Button style={{ width: "100%", justifyContent: "center" }} variant={open.going ? "secondary" : "primary"} onClick={() => toggleGoing(open.id)}>
            {open.going ? "Cancel RSVP" : "Add to my calendar"}
          </Button>
        </Modal>
      )}
      {compose && (
        <Modal title="Create event" onClose={() => setCompose(false)}>
          <SimpleEventForm onClose={() => setCompose(false)} onSubmit={(payload) => setEvents((prev) => [{ id: "E-" + Date.now(), participants: 0, going: false, organizer: user.name, ...payload }, ...prev])} />
        </Modal>
      )}
    </div>
  );
}

function SimpleEventForm({ onClose, onSubmit }) {
  const { c } = useApp();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-09-01");
  const [start, setStart] = useState("8:00 AM");
  const [end, setEnd] = useState("4:00 PM");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  return (
    <>
      <Field label="Event title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Field label="Date"><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="Start"><input value={start} onChange={(e) => setStart(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="End"><input value={end} onChange={(e) => setEnd(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
      </div>
      <Field label="Location"><input value={location} onChange={(e) => setLocation(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
      <Field label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="spnhs-focus" style={{ ...inputStyle(c), resize: "vertical" }} /></Field>
      <Button style={{ width: "100%", justifyContent: "center" }} disabled={!title} onClick={() => { onSubmit({ title, date, start, end, location, description }); onClose(); }}>Publish event</Button>
    </>
  );
}

/* ============================================================================
   MATERIALS
============================================================================ */

function MaterialsPage() {
  const { c, user } = useApp();
  const [q, setQ] = useState("");
  const [subj, setSubj] = useState("All");
  const filtered = initialMaterials.filter((m) => (subj === "All" || m.subject === subj) && m.title.toLowerCase().includes(q.toLowerCase()));
  const canUpload = user.role === "teacher";
  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: c.inkSoft }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search materials…" className="spnhs-focus" style={{ ...inputStyle(c), paddingLeft: 32 }} />
        </div>
        <select value={subj} onChange={(e) => setSubj(e.target.value)} className="spnhs-focus" style={{ ...inputStyle(c), width: "auto" }}>
          <option>All</option>
          {SUBJECTS.map((s) => <option key={s.id}>{s.name}</option>)}
        </select>
        {canUpload && <Button icon={Upload}>Upload</Button>}
      </div>
      {filtered.length === 0 ? <EmptyState icon={FolderOpen} title="No materials found" body="Try a different subject or search term." /> : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {filtered.map((m) => (
            <Card key={m.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, background: c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><FileText size={18} color={c.pine} /></div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: c.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.title}</div>
                  <div style={{ fontSize: 11.5, color: c.inkSoft }}>{m.subject} · {m.teacher}</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${c.line}`, paddingTop: 10 }}>
                <span style={{ fontSize: 11.5, color: c.inkSoft }}>{m.type} · {m.size}</span>
                <Button size="sm" variant="secondary" icon={Download}>Get</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================================
   MESSAGES
============================================================================ */

function MessagesPage() {
  const { c, conversations, setConversations, user } = useApp();
  const [active, setActive] = useState(conversations[0]?.id || null);
  const [text, setText] = useState("");
  const conv = conversations.find((cc) => cc.id === active);
  const [showList, setShowList] = useState(true);

  const send = () => {
    if (!text.trim()) return;
    setConversations((prev) => prev.map((cc) => cc.id === active ? { ...cc, messages: [...cc.messages, { from: "me", text, time: "Just now" }] } : cc));
    setText("");
  };

  return (
    <div className="spnhs-fade-in msg-grid" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 14, height: "calc(100vh - 180px)", minHeight: 420 }}>
      <Card style={{ padding: 0, overflowY: "auto", display: showList ? "block" : "none" }} className="msg-list">
        <div style={{ padding: 14, borderBottom: `1px solid ${c.line}`, fontWeight: 700, fontSize: 14, color: c.ink }}>Conversations</div>
        {conversations.map((cc) => (
          <button
            key={cc.id} onClick={() => { setActive(cc.id); setShowList(false); }}
            style={{
              width: "100%", textAlign: "left", padding: 14, border: "none", borderBottom: `1px solid ${c.line}`,
              background: active === cc.id ? c.pineSoft : "transparent", cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, fontSize: 13.5, color: c.ink }}>{cc.withName}</span>
              {cc.unread > 0 && <span style={{ background: c.red, color: "#fff", fontSize: 10, fontWeight: 700, borderRadius: 999, padding: "1px 6px" }}>{cc.unread}</span>}
            </div>
            <div style={{ fontSize: 11.5, color: c.inkSoft }}>{cc.withRole}</div>
          </button>
        ))}
      </Card>
      <Card style={{ padding: 0, display: (showList ? "none" : "flex"), flexDirection: "column" }} className="msg-thread">
        {conv ? (
          <>
            <div style={{ padding: 14, borderBottom: `1px solid ${c.line}`, display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => setShowList(true)} className="msg-back" style={{ display: "none", background: "none", border: "none", color: c.ink }}><ArrowLeft size={18} /></button>
              <div style={{ fontWeight: 700, fontSize: 14, color: c.ink }}>{conv.withName}</div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {conv.messages.map((m, i) => (
                <div key={i} style={{ alignSelf: m.from === "me" ? "flex-end" : "flex-start", maxWidth: "75%" }}>
                  <div style={{ background: m.from === "me" ? c.pine : c.surface2, color: m.from === "me" ? "#fff" : c.ink, borderRadius: 12, padding: "8px 12px", fontSize: 13.5 }}>{m.text}</div>
                  <div style={{ fontSize: 10.5, color: c.inkSoft, marginTop: 3, textAlign: m.from === "me" ? "right" : "left" }}>{m.time}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, padding: 12, borderTop: `1px solid ${c.line}` }}>
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" className="spnhs-focus" style={inputStyle(c)} />
              <Button onClick={send} icon={Send}>Send</Button>
            </div>
          </>
        ) : <EmptyState icon={MessageSquare} title="No conversation selected" body="Choose a conversation to start messaging." />}
      </Card>
      <style>{`
        @media (max-width: 760px) {
          .msg-grid { grid-template-columns: 1fr !important; height: calc(100vh - 220px) !important; }
          .msg-back { display: inline-flex !important; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================================
   NOTIFICATIONS
============================================================================ */

function BroadcastComposer({ onClose, onSubmit }) {
  const { c } = useApp();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audience, setAudience] = useState("Everyone");
  return (
    <Modal title="Send school-wide message" onClose={onClose}>
      <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="spnhs-focus" style={inputStyle(c)} placeholder="e.g. Classes suspended tomorrow" /></Field>
      <Field label="Message"><textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className="spnhs-focus" style={{ ...inputStyle(c), resize: "vertical" }} /></Field>
      <Field label="Send to">
        <select value={audience} onChange={(e) => setAudience(e.target.value)} className="spnhs-focus" style={inputStyle(c)}>
          <option>Everyone</option><option>Students</option><option>Teachers</option>
        </select>
      </Field>
      <Button style={{ width: "100%", justifyContent: "center" }} disabled={!title || !body} onClick={() => { onSubmit({ title, body, audience }); onClose(); }}>Send broadcast</Button>
    </Modal>
  );
}

function NotificationsPage() {
  const { c, notifications, setNotifications, user } = useApp();
  const iconMap = { announcement: Megaphone, assignment: ClipboardList, grade: GraduationCap, message: MessageSquare, schedule: CalendarDays, broadcast: Send };
  const markAll = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markOne = (id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  const del = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));
  const [broadcasting, setBroadcasting] = useState(false);
  const sendBroadcast = (payload) => setNotifications((prev) => [
    { id: "N-" + Date.now(), title: `${payload.title} (to ${payload.audience})`, body: payload.body, time: "Just now", read: false, kind: "broadcast" },
    ...prev,
  ]);

  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 14 }}>
        {user.role === "admin" && <Button icon={Send} onClick={() => setBroadcasting(true)}>New broadcast</Button>}
        <Button variant="secondary" size="sm" onClick={markAll}>Mark all as read</Button>
      </div>
      {broadcasting && <BroadcastComposer onClose={() => setBroadcasting(false)} onSubmit={sendBroadcast} />}
      {notifications.length === 0 ? <EmptyState icon={Bell} title="You're all caught up" body="No new notifications right now." /> : (
        notifications.map((n) => {
          const Icon = iconMap[n.kind] || Bell;
          return (
            <Card key={n.id} style={{ marginBottom: 10, background: n.read ? undefined : (n.kind ? undefined : undefined), borderColor: n.read ? undefined : "var(--pine)" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: n.read ? c.surface2 : c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={16} color={n.read ? c.inkSoft : c.pine} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 500 : 700, fontSize: 13.5, color: c.ink }}>{n.title}</div>
                  <div style={{ fontSize: 12.5, color: c.inkSoft, marginBottom: 4 }}>{n.body}</div>
                  <div style={{ fontSize: 11, color: c.inkSoft }}>{n.time}</div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  {!n.read && <button onClick={() => markOne(n.id)} title="Mark as read" style={{ background: "none", border: "none", color: c.pine, cursor: "pointer" }}><Check size={16} /></button>}
                  <button onClick={() => del(n.id)} title="Delete" style={{ background: "none", border: "none", color: c.inkSoft, cursor: "pointer" }}><Trash2 size={16} /></button>
                </div>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}

/* ============================================================================
   TASKS
============================================================================ */

function TasksPage() {
  const { c, tasks, setTasks } = useApp();
  const [newTitle, setNewTitle] = useState("");
  const toggle = (id) => setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const del = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));
  const add = () => {
    if (!newTitle.trim()) return;
    setTasks((prev) => [...prev, { id: "TK-" + Date.now(), title: newTitle, group: "today", done: false, due: "Today", source: "Personal" }]);
    setNewTitle("");
  };
  const groupLabel = { today: "Today", upcoming: "Upcoming" };

  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="Add a personal task…" className="spnhs-focus" style={inputStyle(c)} />
        <Button icon={Plus} onClick={add}>Add</Button>
      </div>
      {["today", "upcoming"].map((g) => {
        const items = tasks.filter((t) => t.group === g);
        if (!items.length) return null;
        return (
          <div key={g} style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: c.inkSoft, letterSpacing: 0.6, marginBottom: 8 }}>{groupLabel[g].toUpperCase()}</div>
            <Card>
              {items.map((t, i) => (
                <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < items.length - 1 ? `1px solid ${c.line}` : "none" }}>
                  <button onClick={() => toggle(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: t.done ? c.pine : c.inkSoft }}>
                    {t.done ? <CheckCircle2 size={19} /> : <Circle size={19} />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, color: t.done ? c.inkSoft : c.ink, textDecoration: t.done ? "line-through" : "none", fontWeight: 500 }}>{t.title}</div>
                    <div style={{ fontSize: 11, color: c.inkSoft }}>{t.source} · Due {t.due}</div>
                  </div>
                  <button onClick={() => del(t.id)} style={{ background: "none", border: "none", color: c.inkSoft, cursor: "pointer" }}><Trash2 size={15} /></button>
                </div>
              ))}
            </Card>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================================
   PROFILE / SETTINGS
============================================================================ */

function ProfilePage() {
  const { c, user, theme, setTheme } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [contact, setContact] = useState("+63 917 000 0000");
  const [saved, setSaved] = useState(false);
  return (
    <div className="spnhs-fade-in" style={{ maxWidth: 560 }}>
      <Card style={{ marginBottom: 18, textAlign: "center" }}>
        <div style={{ width: 76, height: 76, borderRadius: "50%", background: c.pine, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 24, margin: "0 auto 10px" }}>
          {user.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
        </div>
        <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 18, color: c.ink }}>{user.name}</div>
        <div style={{ fontSize: 13, color: c.inkSoft, textTransform: "capitalize" }}>{user.role} · {user.role === "student" ? "Grade 10 - Rizal" : user.role === "teacher" ? "Mathematics Department" : "Registrar's Office"}</div>
        <Button size="sm" variant="secondary" style={{ marginTop: 12 }} icon={Upload}>Change photo</Button>
      </Card>

      <Card style={{ marginBottom: 18 }}>
        <SectionTitle icon={User}>Personal information</SectionTitle>
        <Field label="Full name"><input value={name} onChange={(e) => setName(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="Email"><input value={email} onChange={(e) => setEmail(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="Contact number"><input value={contact} onChange={(e) => setContact(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}>{saved ? "Saved ✓" : "Save changes"}</Button>
      </Card>

      <Card style={{ marginBottom: 18 }}>
        <SectionTitle icon={ShieldCheck}>Change password</SectionTitle>
        <Field label="Current password"><input type="password" className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="New password"><input type="password" className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Button variant="secondary">Update password</Button>
      </Card>

      <Card>
        <SectionTitle icon={Sun}>Appearance</SectionTitle>
        <div style={{ fontSize: 13, color: c.inkSoft, marginBottom: 10 }}>Choose how SPHS Portal looks on this device.</div>
        <ThemeSwitch />
      </Card>
    </div>
  );
}

/* ============================================================================
   TEACHER PAGES
============================================================================ */

function TeacherDashboard() {
  const { c, setPage, assignments } = useApp();
  const pendingGrading = assignments.filter((a) => a.status === "Submitted").length || 6;
  return (
    <div className="spnhs-fade-in">
      <Card style={{ background: c.pineDeep, color: "#fff", border: "none", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div className="spnhs-perf" style={{ position: "absolute", inset: 0, opacity: 0.05 }} />
        <div style={{ position: "relative" }}>
          <div className="spnhs-display" style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Magandang umaga, Sir Juan! ☀️</div>
          <div style={{ fontSize: 13.5, opacity: 0.85 }}>You have {scheduleToday.length} classes and {pendingGrading} submissions to grade today.</div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <SummaryCard icon={Users} label="Total Students" value={STUDENTS.filter((s) => s.section === "Grade 10 - Rizal").length} tone="pine" />
        <SummaryCard icon={BookOpen} label="Classes" value={SUBJECTS.length} tone="blue" />
        <SummaryCard icon={ClipboardList} label="Pending Submissions" value={pendingGrading} tone="gold" />
        <SummaryCard icon={CalendarDays} label="Upcoming Classes" value={scheduleToday.length} tone="pine" />
        <SummaryCard icon={PartyPopper} label="Upcoming Events" value={initialEvents.length} tone="red" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }} className="dash-grid">
        <div>
          <Card style={{ marginBottom: 18 }}>
            <SectionTitle icon={Clock}>Today's Classes</SectionTitle>
            {scheduleToday.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: i < scheduleToday.length - 1 ? `1px solid ${c.line}` : "none" }}>
                <div className="spnhs-mono" style={{ fontSize: 12, color: c.pine, fontWeight: 700, width: 96 }}>{s.time}</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: c.ink }}>{s.subject}</div>
                <div style={{ marginLeft: "auto", fontSize: 12, color: c.inkSoft }}>{s.room}</div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle icon={BarChart3}>Class performance</SectionTitle>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" name="Completion %" fill={c.gold} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div>
          <Card style={{ marginBottom: 18 }}>
            <SectionTitle icon={ClipboardList} action={<button onClick={() => setPage("assignments")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Grade now</button>}>Pending Grading</SectionTitle>
            {assignments.filter((a) => a.status === "Submitted").length === 0 ? (
              <div style={{ fontSize: 13, color: c.inkSoft }}>3 English reflections · 2 Science lab reports · 1 essay</div>
            ) : assignments.filter((a) => a.status === "Submitted").map((a) => (
              <div key={a.id} style={{ padding: "8px 0", borderBottom: `1px solid ${c.line}`, fontSize: 13, color: c.ink }}>{a.title}</div>
            ))}
          </Card>
          <Card>
            <SectionTitle icon={CalendarCheck}>Attendance summary</SectionTitle>
            <div style={{ width: "100%", height: 140 }}>
              <ResponsiveContainer>
                <LineChart data={attendanceTrend}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
                  <YAxis domain={[80, 100]} hide />
                  <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke={c.pine} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function TeacherClassesPage() {
  const { c, user } = useApp();
  const [selected, setSelected] = useState(null);
  const mine = SUBJECTS.filter((s) => s.teacher === user.name);

  if (selected) {
    const roster = STUDENTS.filter((s) => s.section === selected.section);
    return (
      <div className="spnhs-fade-in">
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: c.inkSoft, display: "flex", alignItems: "center", gap: 6, cursor: "pointer", marginBottom: 14, fontSize: 13, fontWeight: 600 }}>
          <ArrowLeft size={15} /> Back to classes
        </button>
        <Card style={{ marginBottom: 16 }}>
          <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 20, color: c.ink }}>{selected.name}</div>
          <div style={{ fontSize: 13, color: c.inkSoft }}>{selected.section} · {selected.schedule} · {selected.room}</div>
        </Card>
        <Card>
          <SectionTitle icon={Users}>Roster ({roster.length})</SectionTitle>
          {roster.length === 0 ? <EmptyState icon={Users} title="No students yet" body="This section's roster hasn't been finalized." /> : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", color: c.inkSoft, fontSize: 11.5 }}>
                  <th style={{ padding: "6px 8px" }}>Student</th><th>ID</th><th>Average</th><th>Attendance</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((s) => (
                  <tr key={s.id} style={{ borderTop: `1px solid ${c.line}` }}>
                    <td style={{ padding: "8px" }}>{s.name}</td>
                    <td className="spnhs-mono" style={{ color: c.inkSoft }}>{s.id}</td>
                    <td className="spnhs-mono" style={{ fontWeight: 700, color: c.pine }}>{s.avg}</td>
                    <td>{s.attendance}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </Card>
      </div>
    );
  }

  if (mine.length === 0) return <EmptyState icon={Users} title="No classes assigned" body="Classes assigned to you will appear here." />;

  return (
    <div className="spnhs-fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
      {mine.map((s) => {
        const count = STUDENTS.filter((st) => st.section === s.section).length;
        return (
          <Card key={s.id} hover onClick={() => setSelected(s)}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.pineSoft, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <BookOpen size={20} color={c.pine} />
            </div>
            <div className="spnhs-display" style={{ fontWeight: 700, fontSize: 16, color: c.ink, marginBottom: 4 }}>{s.name}</div>
            <div style={{ fontSize: 12.5, color: c.inkSoft }}>{s.section} · {count} students</div>
          </Card>
        );
      })}
    </div>
  );
}

function CreateAssignmentModal({ onClose, onSubmit }) {
  const { c } = useApp();
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [subject, setSubject] = useState(SUBJECTS[0].name);
  const [due, setDue] = useState("2026-08-25");
  const [points, setPoints] = useState(50);
  return (
    <Modal title="Create assignment" onClose={onClose}>
      <Field label="Title"><input value={title} onChange={(e) => setTitle(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
      <Field label="Instructions"><textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3} className="spnhs-focus" style={{ ...inputStyle(c), resize: "vertical" }} /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <Field label="Class"><select value={subject} onChange={(e) => setSubject(e.target.value)} className="spnhs-focus" style={inputStyle(c)}>{SUBJECTS.map((s) => <option key={s.id}>{s.name}</option>)}</select></Field>
        <Field label="Due date"><input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="spnhs-focus" style={inputStyle(c)} /></Field>
        <Field label="Points"><input type="number" value={points} onChange={(e) => setPoints(Number(e.target.value))} className="spnhs-focus" style={inputStyle(c)} /></Field>
      </div>
      <Field label="Attach files (optional)">
        <div style={{ border: `1px dashed ${c.line}`, borderRadius: 10, padding: 14, textAlign: "center", color: c.inkSoft, fontSize: 12.5 }}><Paperclip size={16} /><br />Drop files here</div>
      </Field>
      <Button style={{ width: "100%", justifyContent: "center" }} disabled={!title} onClick={() => { onSubmit({ title, instructions, subject, due, points }); onClose(); }}>Publish assignment</Button>
    </Modal>
  );
}

function TeacherAssignmentsPage() {
  const { c, assignments, setAssignments, user } = useApp();
  const [compose, setCompose] = useState(false);
  const [grading, setGrading] = useState(null);
  const mine = assignments.filter((a) => a.teacher === user.name || a.teacher === "Juan Dela Cruz");

  const add = (payload) => setAssignments((prev) => [{ id: "AS-" + Date.now(), teacher: user.name, status: "Pending", attachments: [] , ...payload }, ...prev]);

  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button icon={Plus} onClick={() => setCompose(true)}>Create assignment</Button>
      </div>
      {mine.map((a) => (
        <Card key={a.id} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: c.ink }}>{a.title}</div>
              <div style={{ fontSize: 12, color: c.inkSoft }}>{a.subject} · Due {a.due} · {a.points} pts</div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setGrading(a)}>Review submissions</Button>
          </div>
        </Card>
      ))}
      {compose && <CreateAssignmentModal onClose={() => setCompose(false)} onSubmit={add} />}
      {grading && (
        <Modal title={`Submissions — ${grading.title}`} onClose={() => setGrading(null)} width={640}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead><tr style={{ textAlign: "left", color: c.inkSoft, fontSize: 11.5 }}><th style={{ padding: "6px 8px" }}>Student</th><th>Submitted</th><th>Score</th><th>Feedback</th></tr></thead>
              <tbody>
                {STUDENTS.filter((s) => s.section === "Grade 10 - Rizal").slice(0, 6).map((s) => (
                  <tr key={s.id} style={{ borderTop: `1px solid ${c.line}` }}>
                    <td style={{ padding: 8 }}>{s.name}</td>
                    <td style={{ fontSize: 11.5, color: c.inkSoft }}>Aug 17, 8:45 AM</td>
                    <td><input defaultValue={Math.round(grading.points * 0.85)} style={{ ...inputStyle(c), width: 60, padding: "5px 8px" }} /></td>
                    <td><input placeholder="Add feedback…" style={{ ...inputStyle(c), width: 160, padding: "5px 8px" }} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button style={{ marginTop: 14, width: "100%", justifyContent: "center" }} onClick={() => setGrading(null)}>Save grades</Button>
        </Modal>
      )}
    </div>
  );
}

function TeacherGradebookPage() {
  const { c, user } = useApp();
  const myClasses = SUBJECTS.filter((s) => s.teacher === user.name);
  const [classId, setClassId] = useState(myClasses[0]?.id);
  const activeClass = myClasses.find((s) => s.id === classId) || myClasses[0];
  const roster = activeClass ? STUDENTS.filter((s) => s.section === activeClass.section) : [];

  if (!activeClass) return <EmptyState icon={GraduationCap} title="No classes assigned" body="Your gradebook will appear here once classes are assigned." />;

  return (
    <div className="spnhs-fade-in">
      <select value={classId} onChange={(e) => setClassId(e.target.value)} className="spnhs-focus" style={{ ...inputStyle(c), width: 280, marginBottom: 14 }}>
        {myClasses.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.section}</option>)}
      </select>
      <Card>
        {roster.length === 0 ? <EmptyState icon={GraduationCap} title="No students yet" body="This section's roster hasn't been finalized." /> : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: c.inkSoft, fontSize: 11.5 }}>
                <th style={{ padding: "8px" }}>Student</th><th>Activities</th><th>Quizzes</th><th>Exams</th><th>Projects</th><th>Final</th>
              </tr>
            </thead>
            <tbody>
              {roster.map((s) => (
                <tr key={s.id} style={{ borderTop: `1px solid ${c.line}` }}>
                  <td style={{ padding: 8 }}>{s.name}</td>
                  {["activities", "quizzes", "exams", "projects"].map((k) => (
                    <td key={k}><input defaultValue={Math.round(80 + Math.random() * 18)} style={{ ...inputStyle(c), width: 56, padding: "5px 8px" }} /></td>
                  ))}
                  <td className="spnhs-mono" style={{ fontWeight: 700, color: c.pine }}>{s.avg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>
    </div>
  );
}

function TeacherAttendancePage() {
  const { c, user } = useApp();
  const myClasses = SUBJECTS.filter((s) => s.teacher === user.name);
  const [classId, setClassId] = useState(myClasses[0]?.id);
  const activeClass = myClasses.find((s) => s.id === classId) || myClasses[0];
  const roster = activeClass ? STUDENTS.filter((s) => s.section === activeClass.section) : [];
  const [record, setRecord] = useState({});
  const set = (id, status) => setRecord((prev) => ({ ...prev, [id]: status }));
  const options = ["Present", "Late", "Absent", "Excused"];

  if (!activeClass) return <EmptyState icon={CalendarCheck} title="No classes assigned" body="Attendance tools will appear here once classes are assigned." />;

  return (
    <div className="spnhs-fade-in">
      <Card style={{ marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
        <div>
          <select value={classId} onChange={(e) => setClassId(e.target.value)} className="spnhs-focus" style={{ ...inputStyle(c), width: 260, marginBottom: 6 }}>
            {myClasses.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.section}</option>)}
          </select>
          <div style={{ fontSize: 12, color: c.inkSoft }}>Today, August 18, 2026</div>
        </div>
        <Button icon={CheckCircle2}>Save attendance</Button>
      </Card>
      <Card>
        {roster.length === 0 ? <EmptyState icon={Users} title="No students yet" body="This section's roster hasn't been finalized." /> : roster.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", borderBottom: i < roster.length - 1 ? `1px solid ${c.line}` : "none", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 140, fontSize: 13.5, color: c.ink, fontWeight: 500 }}>{s.name}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {options.map((o) => (
                <button
                  key={o} onClick={() => set(s.id, o)}
                  style={{
                    padding: "5px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                    border: `1px solid ${record[s.id] === o ? c.pine : c.line}`,
                    background: record[s.id] === o ? c.pine : "transparent", color: record[s.id] === o ? "#fff" : c.inkSoft,
                  }}
                >{o}</button>
              ))}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function TeacherAnalyticsPage() {
  const { c } = useApp();
  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="dash-grid">
        <Card>
          <SectionTitle icon={TrendingUp}>Average class performance</SectionTitle>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={completionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="value" fill={c.pine} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle icon={CalendarCheck}>Attendance trend</SectionTitle>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer>
              <LineChart data={attendanceTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="value" stroke={c.gold} strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      <style>{`@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

/* ============================================================================
   ADMIN PAGES
============================================================================ */

function AdminDashboard() {
  const { c, setPage } = useApp();
  return (
    <div className="spnhs-fade-in">
      <Card style={{ background: c.pineDeep, color: "#fff", border: "none", marginBottom: 18, position: "relative", overflow: "hidden" }}>
        <div className="spnhs-perf" style={{ position: "absolute", inset: 0, opacity: 0.05 }} />
        <div style={{ position: "relative" }}>
          <div className="spnhs-display" style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Good morning, Dr. Reyes ☀️</div>
          <div style={{ fontSize: 13.5, opacity: 0.85 }}>Santa Praxedes High School — S.Y. 2026–2027 overview.</div>
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 20 }}>
        <SummaryCard icon={Users} label="Total Students" value={STUDENTS.length} tone="pine" />
        <SummaryCard icon={UserCog} label="Total Teachers" value={TEACHERS.length} tone="blue" />
        <SummaryCard icon={Building2} label="Total Classes" value={SECTIONS.length} tone="gold" />
        <SummaryCard icon={BookOpen} label="Total Subjects" value={SUBJECTS.length} tone="pine" />
        <SummaryCard icon={CalendarCheck} label="Today's Attendance" value="94%" tone="red" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }} className="dash-grid">
        <div>
          <Card style={{ marginBottom: 18 }}>
            <SectionTitle icon={TrendingUp}>Student enrollment (5-year trend)</SectionTitle>
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer>
                <LineChart data={enrollmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="value" stroke={c.pine} strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <SectionTitle icon={BarChart3}>Assignment completion by subject</SectionTitle>
            <div style={{ width: "100%", height: 200 }}>
              <ResponsiveContainer>
                <BarChart data={completionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" fill={c.gold} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
        <div>
          <Card style={{ marginBottom: 18 }}>
            <SectionTitle icon={PartyPopper} action={<button onClick={() => setPage("events")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>See all</button>}>Upcoming Events</SectionTitle>
            {initialEvents.slice(0, 3).map((e, i) => (
              <div key={e.id} style={{ padding: "9px 0", borderBottom: i < 2 ? `1px solid ${c.line}` : "none" }}>
                <div style={{ fontWeight: 600, fontSize: 13, color: c.ink }}>{e.title}</div>
                <div style={{ fontSize: 11.5, color: c.inkSoft }}>{e.date}</div>
              </div>
            ))}
          </Card>
          <Card>
            <SectionTitle icon={Megaphone} action={<button onClick={() => setPage("feed")} style={{ background: "none", border: "none", color: c.pine, fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Manage</button>}>Pending Announcements</SectionTitle>
            <div style={{ fontSize: 13, color: c.inkSoft }}>2 draft announcements awaiting review.</div>
          </Card>
        </div>
      </div>
      <style>{`@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function CrudTable({ title, icon, columns, rows, onAdd, onDelete, onToggleStatus, formFields }) {
  const { c } = useApp();
  const [q, setQ] = useState("");
  const [addOpen, setAddOpen] = useState(null);
  const filtered = rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={15} style={{ position: "absolute", left: 11, top: 11, color: c.inkSoft }} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${title.toLowerCase()}…`} className="spnhs-focus" style={{ ...inputStyle(c), paddingLeft: 32 }} />
        </div>
        <Button icon={Plus} onClick={() => setAddOpen({})}>Add {title.slice(0, -1)}</Button>
      </div>
      <Card style={{ padding: 0 }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ textAlign: "left", color: c.inkSoft, fontSize: 11.5, borderBottom: `1px solid ${c.line}` }}>
                {columns.map((col) => <th key={col.key} style={{ padding: "10px 12px" }}>{col.label}</th>)}
                <th style={{ padding: "10px 12px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id || i} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${c.line}` : "none" }}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: "10px 12px" }}>
                      {col.key === "status" ? <Badge tone={r[col.key] === "Active" ? "pine" : "red"} small>{r[col.key]}</Badge> : r[col.key]}
                    </td>
                  ))}
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      {onToggleStatus && <button onClick={() => onToggleStatus(r)} title="Toggle status" style={{ background: "none", border: "none", color: c.inkSoft, cursor: "pointer" }}><ShieldCheck size={15} /></button>}
                      <button title="Edit" style={{ background: "none", border: "none", color: c.inkSoft, cursor: "pointer" }}><Edit2 size={15} /></button>
                      <button onClick={() => onDelete(r)} title="Delete" style={{ background: "none", border: "none", color: c.red, cursor: "pointer" }}><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 20 }}><EmptyState icon={icon} title={`No ${title.toLowerCase()} found`} body="Try a different search, or add a new record." /></div>}
        </div>
      </Card>
      {addOpen && (
        <Modal title={`Add ${title.slice(0, -1)}`} onClose={() => setAddOpen(null)}>
          <AddForm fields={formFields} onSubmit={(vals) => { onAdd(vals); setAddOpen(null); }} />
        </Modal>
      )}
    </div>
  );
}

function AddForm({ fields, onSubmit }) {
  const { c } = useApp();
  const [vals, setVals] = useState(Object.fromEntries(fields.map((f) => [f.key, f.default || ""])));
  return (
    <>
      {fields.map((f) => (
        <Field key={f.key} label={f.label}>
          {f.type === "select" ? (
            <select value={vals[f.key]} onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))} className="spnhs-focus" style={inputStyle(c)}>
              {f.options.map((o) => <option key={o}>{o}</option>)}
            </select>
          ) : (
            <input value={vals[f.key]} onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))} className="spnhs-focus" style={inputStyle(c)} />
          )}
        </Field>
      ))}
      <Button style={{ width: "100%", justifyContent: "center" }} onClick={() => onSubmit(vals)}>Save</Button>
    </>
  );
}

function AdminStudentsPage() {
  const [rows, setRows] = useState(STUDENTS);
  return (
    <CrudTable
      title="Students" icon={Users}
      columns={[{ key: "name", label: "Name" }, { key: "id", label: "Student ID" }, { key: "section", label: "Section" }, { key: "avg", label: "Average" }, { key: "status", label: "Status" }]}
      rows={rows}
      onAdd={(v) => setRows((prev) => [{ id: "2026-" + Math.floor(Math.random() * 90000 + 10000), avg: 0, status: "Active", ...v }, ...prev])}
      onDelete={(r) => setRows((prev) => prev.filter((x) => x.id !== r.id))}
      onToggleStatus={(r) => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: x.status === "Active" ? "Disabled" : "Active" } : x)))}
      formFields={[{ key: "name", label: "Full name" }, { key: "section", label: "Section", type: "select", options: SECTIONS.map((s) => s.name), default: SECTIONS[0].name }]}
    />
  );
}

function AdminTeachersPage() {
  const [rows, setRows] = useState(TEACHERS);
  return (
    <CrudTable
      title="Teachers" icon={UserCog}
      columns={[{ key: "name", label: "Name" }, { key: "subject", label: "Subject" }, { key: "advisory", label: "Advisory" }, { key: "email", label: "Email" }, { key: "status", label: "Status" }]}
      rows={rows}
      onAdd={(v) => setRows((prev) => [{ id: "T-" + Math.floor(Math.random() * 900 + 100), status: "Active", email: "", ...v }, ...prev])}
      onDelete={(r) => setRows((prev) => prev.filter((x) => x.id !== r.id))}
      onToggleStatus={(r) => setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: x.status === "Active" ? "On Leave" : "Active" } : x)))}
      formFields={[{ key: "name", label: "Full name" }, { key: "subject", label: "Subject" }, { key: "advisory", label: "Advisory section", type: "select", options: SECTIONS.map((s) => s.name), default: SECTIONS[0].name }]}
    />
  );
}

function AdminSectionsPage() {
  const [rows, setRows] = useState(SECTIONS);
  return (
    <CrudTable
      title="Sections" icon={Building2}
      columns={[{ key: "name", label: "Section" }, { key: "grade", label: "Grade Level" }, { key: "strand", label: "Strand" }, { key: "adviser", label: "Adviser" }, { key: "students", label: "Students" }]}
      rows={rows}
      onAdd={(v) => setRows((prev) => [{ id: "S-" + Date.now(), students: 0, ...v }, ...prev])}
      onDelete={(r) => setRows((prev) => prev.filter((x) => x.id !== r.id))}
      formFields={[
        { key: "name", label: "Section name" },
        { key: "grade", label: "Grade level", type: "select", options: ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"], default: "Grade 10" },
        { key: "strand", label: "Strand (Grade 11–12 only)", type: "select", options: ["—", "STEM", "ABM", "HUMSS", "GAS", "TVL"], default: "—" },
        { key: "adviser", label: "Adviser", type: "select", options: TEACHERS.map((t) => t.name), default: TEACHERS[0].name },
      ]}
    />
  );
}

function AdminSubjectsPage() {
  const [rows, setRows] = useState(SUBJECTS);
  return (
    <CrudTable
      title="Subjects" icon={BookOpen}
      columns={[{ key: "name", label: "Subject" }, { key: "teacher", label: "Teacher" }, { key: "section", label: "Section" }, { key: "schedule", label: "Schedule" }, { key: "room", label: "Room" }]}
      rows={rows}
      onAdd={(v) => setRows((prev) => [{ id: "SUB-" + Date.now(), schedule: "TBA", room: "TBA", ...v }, ...prev])}
      onDelete={(r) => setRows((prev) => prev.filter((x) => x.id !== r.id))}
      formFields={[{ key: "name", label: "Subject name" }, { key: "teacher", label: "Teacher", type: "select", options: TEACHERS.map((t) => t.name), default: TEACHERS[0].name }, { key: "section", label: "Section", type: "select", options: SECTIONS.map((s) => s.name), default: SECTIONS[0].name }]}
    />
  );
}

function AdminReportsPage() {
  const { c } = useApp();
  const [exportState, setExportState] = useState("idle"); // idle | loading | error | done
  const [attempt, setAttempt] = useState(0);

  const runExport = () => {
    setExportState("loading");
    setTimeout(() => {
      // First attempt simulates a transient failure so the retry flow is visible; retries succeed.
      if (attempt === 0) { setExportState("error"); setAttempt(1); }
      else setExportState("done");
    }, 700);
  };

  return (
    <div className="spnhs-fade-in">
      <Card style={{ marginBottom: 16 }}>
        <SectionTitle icon={FileText}>School-wide academic report</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead><tr style={{ textAlign: "left", color: c.inkSoft, fontSize: 11.5 }}><th style={{ padding: 8 }}>Section</th><th>Adviser</th><th>Students</th><th>Avg. Attendance</th></tr></thead>
            <tbody>
              {SECTIONS.map((s) => (
                <tr key={s.id} style={{ borderTop: `1px solid ${c.line}` }}>
                  <td style={{ padding: 8 }}>{s.name}</td><td>{s.adviser}</td><td>{s.students}</td>
                  <td className="spnhs-mono" style={{ color: c.pine, fontWeight: 700 }}>{90 + (s.id.charCodeAt(2) % 8)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <SectionTitle icon={Download}>Export reports</SectionTitle>
        {exportState === "error" ? (
          <ErrorState title="Export failed" body="We couldn't reach the reports service." onRetry={runExport} />
        ) : exportState === "done" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: c.pine, fontSize: 13.5, fontWeight: 600 }}>
            <CheckCircle2 size={18} /> Enrollment-report.csv is ready — check your downloads.
          </div>
        ) : (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Button variant="secondary" icon={Download} onClick={runExport} disabled={exportState === "loading"}>
              {exportState === "loading" ? "Preparing…" : "Enrollment report"}
            </Button>
            <Button variant="secondary" icon={Download}>Attendance report</Button>
            <Button variant="secondary" icon={Download}>Academic performance report</Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function AdminAnalyticsPage() {
  const { c } = useApp();
  const pieData = [{ name: "Active", value: STUDENTS.filter((s) => s.status === "Active").length, fill: c.pine }, { name: "Disabled", value: STUDENTS.filter((s) => s.status !== "Active").length, fill: c.red }];
  return (
    <div className="spnhs-fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }} className="dash-grid">
        <Card>
          <SectionTitle icon={TrendingUp}>Enrollment trend</SectionTitle>
          <div style={{ width: "100%", height: 220 }}>
            <ResponsiveContainer><LineChart data={enrollmentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
              <XAxis dataKey="year" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="value" stroke={c.pine} strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart></ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <SectionTitle icon={Users}>Active users</SectionTitle>
          <div style={{ width: "100%", height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer><PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={3}>
                {pieData.map((p, i) => <Cell key={i} fill={p.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
            </PieChart></ResponsiveContainer>
          </div>
        </Card>
      </div>
      <Card>
        <SectionTitle icon={BarChart3}>Assignment completion by subject</SectionTitle>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer><BarChart data={completionTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke={c.line} vertical={false} />
            <XAxis dataKey="subject" tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={{ stroke: c.line }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: c.inkSoft }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: c.surface, border: `1px solid ${c.line}`, borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="value" fill={c.gold} radius={[6, 6, 0, 0]} />
          </BarChart></ResponsiveContainer>
        </div>
      </Card>
      <style>{`@media (max-width: 900px) { .dash-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}

function AdminSettingsPage() {
  const { c } = useApp();
  const [toggles, setToggles] = useState({ registration: true, publicFeed: true, maintenance: false });
  return (
    <div className="spnhs-fade-in" style={{ maxWidth: 560 }}>
      <Card>
        <SectionTitle icon={Settings}>System settings</SectionTitle>
        {[
          { key: "registration", label: "Allow self-service registration requests" },
          { key: "publicFeed", label: "Show school feed to visitors on landing page" },
          { key: "maintenance", label: "Maintenance mode" },
        ].map((t) => (
          <div key={t.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${c.line}` }}>
            <span style={{ fontSize: 13.5, color: c.ink }}>{t.label}</span>
            <button
              onClick={() => setToggles((v) => ({ ...v, [t.key]: !v[t.key] }))}
              style={{ width: 40, height: 22, borderRadius: 999, background: toggles[t.key] ? c.pine : c.surface2, border: "none", cursor: "pointer", position: "relative" }}
            >
              <span style={{ position: "absolute", top: 2, left: toggles[t.key] ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .15s" }} />
            </button>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ============================================================================
   ROOT LAYOUT + APP
============================================================================ */

const PAGE_TITLES = {
  dashboard: "Dashboard", feed: "School Feed", subjects: "Subjects", assignments: "Assignments",
  quizzes: "Quizzes", grades: "Grades", attendance: "Attendance", calendar: "Calendar", events: "Events",
  materials: "Learning Materials", messages: "Messages", notifications: "Notifications", tasks: "Tasks",
  profile: "Profile", classes: "Classes", analytics: "Analytics", students: "Students", teachers: "Teachers",
  sections: "Sections", reports: "Reports",
};

function PageBody({ page }) {
  const { user } = useApp();
  if (page === "notifications") return <NotificationsPage />;
  if (page === "calendar") return <CalendarPage />;
  if (page === "events") return <EventsPage />;
  if (page === "materials") return <MaterialsPage />;
  if (page === "messages") return <MessagesPage />;
  if (page === "profile") return user.role === "admin" ? <AdminSettingsPage /> : <ProfilePage />;
  if (page === "feed") return <FeedPage />;

  if (user.role === "student") {
    switch (page) {
      case "dashboard": return <StudentDashboard />;
      case "subjects": return <SubjectsPage />;
      case "assignments": return <AssignmentsPage />;
      case "quizzes": return <QuizzesPage />;
      case "grades": return <GradesPage />;
      case "attendance": return <AttendancePage />;
      case "tasks": return <TasksPage />;
      default: return <StudentDashboard />;
    }
  }
  if (user.role === "teacher") {
    switch (page) {
      case "dashboard": return <TeacherDashboard />;
      case "classes": return <TeacherClassesPage />;
      case "assignments": return <TeacherAssignmentsPage />;
      case "quizzes": return <QuizzesPage />;
      case "grades": return <TeacherGradebookPage />;
      case "attendance": return <TeacherAttendancePage />;
      case "analytics": return <TeacherAnalyticsPage />;
      default: return <TeacherDashboard />;
    }
  }
  // admin
  switch (page) {
    case "dashboard": return <AdminDashboard />;
    case "students": return <AdminStudentsPage />;
    case "teachers": return <AdminTeachersPage />;
    case "sections": return <AdminSectionsPage />;
    case "subjects": return <AdminSubjectsPage />;
    case "reports": return <AdminReportsPage />;
    case "analytics": return <AdminAnalyticsPage />;
    default: return <AdminDashboard />;
  }
}

function Shell() {
  const { c, page, setPage, user } = useApp();
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = PAGE_TITLES[page] || "Dashboard";

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 380);
    return () => clearTimeout(t);
  }, [page]);

  return (
    <div className="spnhs-root" style={{ background: c.bg, minHeight: "100vh", color: c.ink }}>
      {FONTS}
      <div className="desktop-shell" style={{ display: "flex" }}>
        <div className="sidebar-wrap"><Sidebar page={page} setPage={setPage} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mobile-header-wrap"><MobileHeader onMenu={() => setDrawer(true)} /></div>
          <div className="desktop-header-wrap"><TopHeader onMenu={() => setDrawer(true)} title={title} /></div>
          <div style={{ padding: 20, paddingBottom: 90 }} className="page-pad">
            {loading ? <SkeletonPage /> : <PageBody page={page} />}
          </div>
        </div>
      </div>
      <div className="bottom-nav-wrap"><BottomNav page={page} setPage={setPage} /></div>
      <MobileDrawer open={drawer} onClose={() => setDrawer(false)} page={page} setPage={setPage} />
      <style>{`
        .mobile-header-wrap, .bottom-nav-wrap { display: none; }
        .bottom-nav-wrap { position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; }
        @media (max-width: 900px) {
          .sidebar-wrap, .desktop-header-wrap { display: none !important; }
          .mobile-header-wrap, .bottom-nav-wrap { display: block !important; }
          .page-pad { padding: 14px !important; padding-bottom: 84px !important; }
        }
        @media (min-width: 901px) {
          .header-search { display: block; }
        }
        @media (max-width: 640px) {
          .header-search { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState(null);
  const [theme, setTheme] = useState("light");
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("landing"); // landing | login | register

  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [events, setEvents] = useState(initialEvents);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [tasks, setTasks] = useState(initialTasks);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [conversations, setConversations] = useState(initialConversations);

  const systemDark = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = theme === "dark" || (theme === "system" && systemDark);
  const c = isDark ? DARK : LIGHT;

  const login = (r, name, email, section) => {
    setUser({ role: r, name, email, section: section || null });
    setRole(r);
    setPage("dashboard");
  };
  const logout = () => { setUser(null); setRole(null); setAuthView("landing"); };

  const ctxValue = {
    c, theme, setTheme, user, login, logout, page, setPage,
    announcements, setAnnouncements, events, setEvents, assignments, setAssignments,
    tasks, setTasks, notifications, setNotifications, conversations, setConversations,
  };

  return (
    <AppCtx.Provider value={ctxValue}>
      <div style={{ "--pine": c.pine, "--line": c.line }}>
        {!user ? (
          authView === "landing" ? (
            <LandingPage onLogin={() => setAuthView("login")} onRegister={() => setAuthView("register")} />
          ) : (
            <LoginScreen initialMode={authView === "register" ? "register" : "login"} onBackToLanding={() => setAuthView("landing")} />
          )
        ) : <Shell />}
      </div>
    </AppCtx.Provider>
  );
}
