### `App.tsx`
```tsx
import React, { useState, useEffect, useRef } from 'react';
import { Briefcase, Users, LayoutDashboard, PlusCircle, LogOut, Key, FileText, CheckCircle, Sun, Moon, Shield, Menu, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import gsap from 'gsap';
import Dashboard from './components/Dashboard';
import JobForm from './components/JobForm';
import Upload from './components/Upload';
import Results from './components/Results';
import { io } from 'socket.io-client';
import { Job, Candidate, EvaluationData, AuditLog } from './types';

const API_URL = import.meta.env.VITE_API_URL || '/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');
const GRAPHQL_URL = import.meta.env.VITE_GRAPHQL_URL || '/graphql';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  
  let initialUser = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      initialUser = JSON.parse(storedUser);
    }
  } catch (err) {
    console.error('Failed to parse user from local storage:', err);
  }
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [role, setRole] = useState(localStorage.getItem('role') || 'Recruiter');
  const pageRef = useRef(null);

  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };
  
  // App context states
  const [jobs, setJobs]

// ... (truncated for workspace view)
```