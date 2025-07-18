import React, { useState, useEffect } from 'react';
import {
  Plus, DollarSign, Target, TrendingUp, Calendar, Users,
  Search, Filter, MoreVertical, Edit, Trash2, Eye, Phone, Mail,
  ArrowUpDown, RefreshCw, Download, Upload, BarChart3, Activity,
  Clock, AlertCircle, CheckCircle, XCircle, Star, Flag,
  Briefcase, Building, User, MessageSquare, FileText, Settings,
  Award, Zap, PieChart, TrendingDown, ChevronDown, PlayCircle,
  Pause, FastForward, RotateCcw, Share2, Bookmark, Heart,
  Globe, MapPin, Camera, Video, Headphones, Send, Shield, Copy,
  MessageCircle, X
} from 'lucide-react';

// Importações do Firebase
import { auth, db } from '../../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

// Componente de Estilos Modernos
const ModernCRMStyles = () => (
  <style>{`
    :root {
      --primary-text: #111827;
      --secondary-text: #6b7280;
      --accent-blue: #2563eb;
      --accent-green: #10b981;
      --accent-orange: #f59e0b;
      --accent-purple: #8b5cf6;
      --accent-red: #ef4444;
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --border-light: #e5e7eb;
      --border-medium: #d1d5db;
    }

    .modern-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .header-left h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0 0 0.5rem 0;
    }

    .header-subtitle {
      color: var(--secondary-text);
      font-size: 0.9rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent-blue), #1d4ed8);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      color: var(--primary-text);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.95);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      padding: 1.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.08);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .stat-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
    }

    .stat-icon.blue { 
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(37, 99, 235, 0.1)); 
      color: var(--accent-blue);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
    }
    .stat-icon.green { 
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1)); 
      color: var(--accent-green);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }
    .stat-icon.orange { 
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1)); 
      color: var(--accent-orange);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
    }
    .stat-icon.purple { 
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1)); 
      color: var(--accent-purple);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: var(--secondary-text);
      font-size: 0.875rem;
    }

    .stat-change {
      font-size: 0.75rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      backdrop-filter: blur(8px);
    }

    .stat-change.positive { 
      color: var(--accent-green); 
      background: rgba(16, 185, 129, 0.1);
    }
    .stat-change.negative { 
      color: var(--accent-red);
      background: rgba(239, 68, 68, 0.1);
    }

    .controls-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1rem;
      flex-wrap: wrap;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .search-filters {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex: 1;
    }

    .search-box {
      position: relative;
      min-width: 300px;
    }

    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
      color: var(--primary-text);
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-1px);
    }

    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--secondary-text);
      width: 1rem;
      height: 1rem;
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
      color: var(--primary-text);
      font-size: 0.875rem;
      min-width: 150px;
      transition: all 0.3s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-1px);
    }

    .table-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .icon-btn {
      padding: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
      color: var(--secondary-text);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.9);
      color: var(--primary-text);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    }

    .leads-table-container {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05);
    }

    .table-header {
      background: rgba(248, 250, 252, 0.8);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
      padding: 1rem 1.5rem;
      display: grid;
      grid-template-columns: 40px 2fr 1fr 1fr 1fr 1fr 100px;
      gap: 1rem;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text);
    }

    .lead-row {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      display: grid;
      grid-template-columns: 40px 2fr 1fr 1fr 1fr 1fr 100px;
      gap: 1rem;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(8px);
    }

    .lead-row:hover {
      background: rgba(37, 99, 235, 0.05);
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
    }

    .lead-row:last-child {
      border-bottom: none;
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      border: 1px solid var(--border-medium);
      border-radius: 3px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .checkbox:hover {
      transform: scale(1.1);
    }

    .lead-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.75rem;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
      transition: all 0.3s ease;
    }

    .avatar:hover {
      transform: scale(1.1);
    }

    .lead-details h4 {
      font-weight: 600;
      color: var(--primary-text);
      margin: 0 0 0.125rem 0;
      font-size: 0.875rem;
    }

    .lead-details p {
      color: var(--secondary-text);
      margin: 0;
      font-size: 0.75rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .status-badge:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .status-novo { 
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(37, 99, 235, 0.1)); 
      color: var(--accent-blue);
    }
    .status-contatado { 
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1)); 
      color: var(--accent-orange);
    }
    .status-qualificado { 
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1)); 
      color: var(--accent-green);
    }
    .status-nao-qualificado { 
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1)); 
      color: var(--accent-red);
    }

    .score-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      text-align: center;
      min-width: 2rem;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .score-badge:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .score-high { 
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1)); 
      color: var(--accent-green);
    }
    .score-medium { 
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1)); 
      color: var(--accent-orange);
    }
    .score-low { 
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1)); 
      color: var(--accent-red);
    }

    .cell-text {
      color: var(--primary-text);
      font-size: 0.875rem;
    }

    .cell-secondary {
      color: var(--secondary-text);
      font-size: 0.75rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .action-btn {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(8px);
      transition: all 0.3s ease;
    }

    .action-btn.primary {
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(37, 99, 235, 0.1));
      color: var(--accent-blue);
    }

    .action-btn.primary:hover {
      background: linear-gradient(135deg, var(--accent-blue), #1d4ed8);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
    }

    .action-btn.whatsapp {
      background: linear-gradient(135deg, rgba(37, 211, 102, 0.2), rgba(37, 211, 102, 0.1));
      color: #25d366;
    }

    .action-btn.whatsapp:hover {
      background: linear-gradient(135deg, #25d366, #1fb855);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.3);
    }

    .action-btn.email {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
      color: var(--accent-red);
    }

    .action-btn.email:hover {
      background: linear-gradient(135deg, var(--accent-red), #dc2626);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
    }

    .action-btn.edit {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(139, 92, 246, 0.1));
      color: var(--accent-purple);
    }

    .action-btn.edit:hover {
      background: linear-gradient(135deg, var(--accent-purple), #7c3aed);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
    }

    .action-btn.delete {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
      color: var(--accent-red);
    }

    .action-btn.delete:hover {
      background: linear-gradient(135deg, var(--accent-red), #dc2626);
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
    }

    .action-btn.secondary {
      background: linear-gradient(135deg, rgba(107, 114, 128, 0.2), rgba(107, 114, 128, 0.1));
      color: var(--secondary-text);
    }

    .action-btn.secondary:hover {
      background: linear-gradient(135deg, rgba(107, 114, 128, 0.3), rgba(107, 114, 128, 0.2));
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(107, 114, 128, 0.2);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }

    .empty-icon {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      background: rgba(248, 250, 252, 0.8);
      backdrop-filter: blur(8px);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .results-info {
      color: var(--secondary-text);
      font-size: 0.875rem;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      background: rgba(37, 99, 235, 0.1);
      border-radius: 8px;
      border-left: 4px solid var(--accent-blue);
      backdrop-filter: blur(8px);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
      padding: 1rem;
    }

    .modal-content {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 42rem;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--secondary-text);
      cursor: pointer;
      padding: 0.25rem;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      color: var(--primary-text);
      transform: scale(1.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 500;
      color: var(--primary-text);
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
      color: var(--primary-text);
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
      background: rgba(255, 255, 255, 0.9);
      transform: translateY(-1px);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
    } 1px solid var(--border-medium);
      border-radius: 8px;
      background: var(--bg-primary);
      color: var(--primary-text);
      font-size: 0.875rem;
      min-width: 150px;
    }

    .table-actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .icon-btn {
      padding: 0.5rem;
      border: 1px solid var(--border-medium);
      border-radius: 6px;
      background: var(--bg-primary);
      color: var(--secondary-text);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .icon-btn:hover {
      background: var(--bg-secondary);
      color: var(--primary-text);
    }

    .leads-table-container {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: 12px;
      overflow: hidden;
    }

    .table-header {
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-light);
      padding: 1rem 1.5rem;
      display: grid;
      grid-template-columns: 40px 2fr 1fr 1fr 1fr 1fr 100px;
      gap: 1rem;
      align-items: center;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--secondary-text);
    }

    .lead-row {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid var(--border-light);
      display: grid;
      grid-template-columns: 40px 2fr 1fr 1fr 1fr 1fr 100px;
      gap: 1rem;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .lead-row:hover {
      background: var(--bg-secondary);
    }

    .lead-row:last-child {
      border-bottom: none;
    }

    .checkbox {
      width: 1rem;
      height: 1rem;
      border: 1px solid var(--border-medium);
      border-radius: 3px;
      cursor: pointer;
    }

    .lead-info {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .avatar {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 0.75rem;
    }

    .lead-details h4 {
      font-weight: 600;
      color: var(--primary-text);
      margin: 0 0 0.125rem 0;
      font-size: 0.875rem;
    }

    .lead-details p {
      color: var(--secondary-text);
      margin: 0;
      font-size: 0.75rem;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
    }

    .status-novo { background: rgba(37, 99, 235, 0.1); color: var(--accent-blue); }
    .status-contatado { background: rgba(245, 158, 11, 0.1); color: var(--accent-orange); }
    .status-qualificado { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); }
    .status-nao-qualificado { background: rgba(239, 68, 68, 0.1); color: var(--accent-red); }

    .score-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-align: center;
      min-width: 2rem;
    }

    .score-high { background: rgba(16, 185, 129, 0.1); color: var(--accent-green); }
    .score-medium { background: rgba(245, 158, 11, 0.1); color: var(--accent-orange); }
    .score-low { background: rgba(239, 68, 68, 0.1); color: var(--accent-red); }

    .cell-text {
      color: var(--primary-text);
      font-size: 0.875rem;
    }

    .cell-secondary {
      color: var(--secondary-text);
      font-size: 0.75rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.25rem;
    }

    .action-btn {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 4px;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .action-btn.primary {
      background: rgba(37, 99, 235, 0.1);
      color: var(--accent-blue);
    }

    .action-btn.primary:hover {
      background: var(--accent-blue);
      color: white;
    }

    .action-btn.secondary {
      background: rgba(107, 114, 128, 0.1);
      color: var(--secondary-text);
    }

    .action-btn.secondary:hover {
      background: rgba(107, 114, 128, 0.2);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: 12px;
    }

    .empty-icon {
      width: 4rem;
      height: 4rem;
      margin: 0 auto 1rem;
      background: var(--bg-secondary);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--secondary-text);
    }

    .results-info {
      color: var(--secondary-text);
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .fade-in {
      animation: fadeIn 0.3s ease-out;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
      padding: 1rem;
    }

    .modal-content {
      background: var(--bg-primary);
      border-radius: 12px;
      padding: 2rem;
      width: 100%;
      max-width: 42rem;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-light);
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--secondary-text);
      cursor: pointer;
      padding: 0.25rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 500;
      color: var(--primary-text);
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-input, .form-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid var(--border-medium);
      border-radius: 6px;
      background: var(--bg-primary);
      color: var(--primary-text);
      font-size: 0.875rem;
    }

    .form-input:focus, .form-textarea:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-light);
    }

    .lead-observation {
      margin: 0.25rem 0 0 0;
      padding: 0.25rem 0.5rem;
      background: rgba(59, 130, 246, 0.1);
      border-radius: 4px;
      border-left: 3px solid var(--accent-blue);
    }

    .lead-observation small {
      color: var(--accent-blue);
      font-size: 0.75rem;
    }

    .lead-next-action {
      margin: 0.25rem 0 0 0;
      padding: 0.25rem 0.5rem;
      background: rgba(16, 185, 129, 0.1);
      border-radius: 4px;
      border-left: 3px solid var(--accent-green);
    }

    .lead-next-action small {
      color: var(--accent-green);
      font-size: 0.75rem;
    }

    .scoring-help {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      font-size: 0.875rem;
    }

    .scoring-help h4 {
      color: var(--accent-orange);
      margin: 0 0 0.5rem 0;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .scoring-levels {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 0.5rem;
      margin: 0.5rem 0;
    }

    .scoring-level {
      padding: 0.375rem 0.5rem;
      border-radius: 6px;
      text-align: center;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .scoring-level.cold {
      background: rgba(239, 68, 68, 0.1);
      color: var(--accent-red);
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .scoring-level.warm {
      background: rgba(245, 158, 11, 0.1);
      color: var(--accent-orange);
      border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .scoring-level.hot {
      background: rgba(16, 185, 129, 0.1);
      color: var(--accent-green);
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .scoring-level.qualified {
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
      border: 1px solid rgba(139, 92, 246, 0.3);
    }

    /* ...existing styles... */
  `}</style>
);

function GestaoLeads() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newLeadForm, setNewLeadForm] = useState({
    nome: '',
    empresa: '',
    email: '',
    telefone: '',
    origem: 'Website',
    status: 'Novo',
    pontuacao: 50,
    proximaAcao: '',
    observacoes: ''
  });

  // Debug log
  console.log('GestaoLeads renderizado:', { 
    showNewLeadModal, 
    leadsCount: leads.length,
    newLeadForm,
    userAuthenticated: !!user,
    loading
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Estado de autenticação:', currentUser ? 'Usuário logado' : 'Usuário não logado');
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchLeads = async () => {
        try {
          console.log('Buscando leads para usuário:', user.uid);
          const querySnapshot = await getDocs(collection(db, 'leads'));
          const leadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          console.log('Leads carregados:', leadsData.length);
          setLeads(leadsData);
        } catch (error) {
          console.error('Erro ao buscar leads:', error);
        }
      };
      fetchLeads();
    }
  }, [user]);

  const addLead = async (newLead) => {
    try {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const leadData = {
        ...newLead,
        tentativas: 0,
        recebido: new Date().toLocaleDateString('pt-BR'),
        criadoEm: new Date().toISOString(),
        criadoPor: user.uid,
        responsavel: user.uid
      };
      
      console.log('Dados do lead a serem salvos:', leadData);
      console.log('Usuário autenticado:', user.uid);
      
      const docRef = await addDoc(collection(db, 'leads'), leadData);
      console.log('Lead salvo com ID:', docRef.id);
      
      const newLeadWithId = { id: docRef.id, ...leadData };
      setLeads(prevLeads => [...prevLeads, newLeadWithId]);
      
      return docRef;
    } catch (error) {
      console.error('Erro detalhado ao salvar lead:', error);
      throw error;
    }
  };

  const handleNewLeadSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar se o usuário está autenticado
    if (!user) {
      alert('Você precisa estar logado para criar leads.');
      return;
    }
    
    // Validação básica
    if (!newLeadForm.nome || !newLeadForm.empresa || !newLeadForm.email) {
      alert('Por favor, preencha todos os campos obrigatórios (Nome, Empresa, E-mail).');
      return;
    }
    
    try {
      console.log('Enviando novo lead:', newLeadForm);
      console.log('Usuário:', user.uid);
      await addLead(newLeadForm);
      console.log('Lead criado com sucesso!');
      setShowNewLeadModal(false);
      clearNewLeadForm();
      alert('Lead criado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar lead:', error);
      alert('Erro ao criar lead: ' + error.message);
    }
  };

  const clearNewLeadForm = () => {
    setNewLeadForm({
      nome: '',
      empresa: '',
      email: '',
      telefone: '',
      origem: 'Website',
      status: 'Novo',
      pontuacao: 50,
      proximaAcao: '',
      observacoes: ''
    });
  };

  const handleInputChange = (field, value) => {
    console.log(`Alterando campo ${field}:`, value);
    setNewLeadForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWhatsApp = (telefone, nome) => {
    const message = `Olá ${nome}, tudo bem? Somos da empresa e gostaríamos de apresentar nossa solução.`;
    const whatsappURL = `https://wa.me/55${telefone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  const handleEmail = (email, nome) => {
    const subject = 'Contato comercial';
    const body = `Olá ${nome},\n\nEsperamos que esteja bem. Gostaríamos de apresentar nossa solução que pode ajudar sua empresa.\n\nAguardamos seu retorno.`;
    const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoURL, '_blank');
  };

  const handleEditLead = (lead) => {
    setEditingLead({ ...lead });
    setSelectedLead(lead);
  };

  const handleSaveEditedLead = async () => {
    try {
      await updateLead(editingLead.id, editingLead);
      setSelectedLead(null);
      setEditingLead(null);
    } catch (error) {
      console.error('Erro ao salvar alterações:', error);
      alert('Erro ao salvar alterações. Tente novamente.');
    }
  };

  const handleEditInputChange = (field, value) => {
    setEditingLead(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateLead = async (id, updatedLead) => {
    const leadDoc = doc(db, 'leads', id);
    await updateDoc(leadDoc, updatedLead);
    setLeads(leads.map(lead => (lead.id === id ? { id, ...updatedLead } : lead)));
  };

  const deleteLead = async (id) => {
    const lead = leads.find(l => l.id === id);
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o lead "${lead?.nome}"?`);
    
    if (confirmDelete) {
      try {
        const leadDoc = doc(db, 'leads', id);
        await deleteDoc(leadDoc);
        setLeads(leads.filter(lead => lead.id !== id));
      } catch (error) {
        console.error('Erro ao excluir lead:', error);
        alert('Erro ao excluir lead. Tente novamente.');
      }
    }
  };

  // Filtrar leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const stats = {
    total: leads.length,
    novos: leads.filter(lead => lead.status === 'Novo').length,
    contatados: leads.filter(lead => lead.status === 'Contatado').length,
    qualificados: leads.filter(lead => lead.status === 'Qualificado').length,
  };

  // Funções auxiliares
  const getStatusClass = (status) => {
    switch (status) {
      case 'Novo': return 'status-novo';
      case 'Contatado': return 'status-contatado';
      case 'Qualificado': return 'status-qualificado';
      case 'Não Qualificado': return 'status-nao-qualificado';
      default: return 'status-novo';
    }
  };

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  const getInitials = (nome) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <ModernCRMStyles />
      {loading ? (
        <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ 
            padding: '4rem', 
            background: 'rgba(255, 255, 255, 0.85)', 
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ 
              width: '3rem', 
              height: '3rem', 
              border: '3px solid #f3f4f6',
              borderTop: '3px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: 'var(--secondary-text)' }}>Carregando...</p>
          </div>
        </div>
      ) : !user ? (
        <div className="fade-in" style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ 
            padding: '4rem', 
            background: 'rgba(255, 255, 255, 0.85)', 
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <User size={48} style={{ color: 'var(--accent-red)', margin: '0 auto 1rem' }} />
            <h2 style={{ color: 'var(--primary-text)', marginBottom: '1rem' }}>Acesso Negado</h2>
            <p style={{ color: 'var(--secondary-text)' }}>
              Você precisa estar logado para acessar a gestão de leads.
            </p>
          </div>
        </div>
      ) : (
      <div className="fade-in" style={{ padding: '2rem' }}>
        
        {/* Header Moderno */}
        <div className="modern-header">
          <div className="header-left">
            <h1>Gestão de Leads</h1>
            <p className="header-subtitle">Gerencie e acompanhe seus leads de vendas</p>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <Download size={16} /> Exportar
            </button>
            <button className="btn btn-secondary">
              <Upload size={16} /> Importar
            </button>
            <button className="btn btn-primary" onClick={() => {
              console.log('Botão Novo Lead clicado');
              setShowNewLeadModal(true);
            }}>
              <Plus size={16} /> Novo Lead
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon blue">
                <User size={20} />
              </div>
              <div className="stat-change positive">
                <TrendingUp size={12} /> +12%
              </div>
            </div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total de Leads</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon green">
                <Target size={20} />
              </div>
              <div className="stat-change positive">
                <TrendingUp size={12} /> +18%
              </div>
            </div>
            <div className="stat-value">{stats.novos}</div>
            <div className="stat-label">Leads Novos</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon orange">
                <Phone size={20} />
              </div>
              <div className="stat-change positive">
                <TrendingUp size={12} /> +8%
              </div>
            </div>
            <div className="stat-value">{stats.contatados}</div>
            <div className="stat-label">Em Contato</div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <div className="stat-icon purple">
                <CheckCircle size={20} />
              </div>
              <div className="stat-change positive">
                <TrendingUp size={12} /> +25%
              </div>
            </div>
            <div className="stat-value">{stats.qualificados}</div>
            <div className="stat-label">Qualificados</div>
          </div>
        </div>

        {/* Controles e Filtros */}
        <div className="controls-bar">
          <div className="search-filters">
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Pesquisar leads..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              <option value="Novo">Novo</option>
              <option value="Contatado">Contatado</option>
              <option value="Qualificado">Qualificado</option>
              <option value="Não Qualificado">Não Qualificado</option>
            </select>
          </div>

          <div className="table-actions">
            <button className="icon-btn" title="Filtros avançados">
              <Filter size={16} />
            </button>
            <button className="icon-btn" title="Atualizar">
              <RefreshCw size={16} />
            </button>
            <button className="icon-btn" title="Ordenar">
              <ArrowUpDown size={16} />
            </button>
          </div>
        </div>

        {/* Informações dos resultados */}
        {(searchTerm || statusFilter) && (
          <div className="results-info">
            Mostrando {filteredLeads.length} de {leads.length} leads
          </div>
        )}

        {/* Tabela de Leads Moderna */}
        {filteredLeads.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={24} />
            </div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-text)' }}>
              Nenhum lead encontrado
            </h3>
            <p style={{ margin: 0, color: 'var(--secondary-text)' }}>
              Tente ajustar os filtros de pesquisa ou adicionar novos leads
            </p>
          </div>
        ) : (
          <div className="leads-table-container">
            <div className="table-header">
              <div></div>
              <div>Lead</div>
              <div>Status</div>
              <div>Pontuação</div>
              <div>Origem</div>
              <div>Recebido</div>
              <div>Ações</div>
            </div>
            
            {filteredLeads.map((lead) => (
              <div key={lead.id} className="lead-row" onClick={() => setSelectedLead(lead)}>
                <div>
                  <input type="checkbox" className="checkbox" />
                </div>
                
                <div className="lead-info">
                  <div className="avatar">
                    {getInitials(lead.nome)}
                  </div>
                  <div className="lead-details">
                    <h4>{lead.nome}</h4>
                    <p>{lead.empresa}</p>
                    {lead.observacoes && (
                      <div className="lead-observation">
                        <small>💬 {lead.observacoes.substring(0, 60)}{lead.observacoes.length > 60 ? '...' : ''}</small>
                      </div>
                    )}
                    {lead.proximaAcao && (
                      <div className="lead-next-action">
                        <small>📋 {lead.proximaAcao}</small>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <span className={`status-badge ${getStatusClass(lead.status)}`}>
                    {lead.status}
                  </span>
                </div>
                
                <div>
                  <span className={`score-badge ${getScoreClass(lead.pontuacao)}`}>
                    {lead.pontuacao}
                  </span>
                </div>
                
                <div className="cell-text">{lead.origem}</div>
                <div className="cell-secondary">{lead.recebido}</div>
                
                <div className="action-buttons">
                  <button 
                    className="action-btn whatsapp" 
                    onClick={(e) => { e.stopPropagation(); handleWhatsApp(lead.telefone, lead.nome); }}
                    title="WhatsApp"
                  >
                    <MessageSquare size={14} />
                  </button>
                  <button 
                    className="action-btn email" 
                    onClick={(e) => { e.stopPropagation(); handleEmail(lead.email, lead.nome); }}
                    title="Email"
                  >
                    <Mail size={14} />
                  </button>
                  <button 
                    className="action-btn edit" 
                    onClick={(e) => { e.stopPropagation(); handleEditLead(lead); }}
                    title="Editar"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="action-btn delete" 
                    onClick={(e) => { e.stopPropagation(); deleteLead(lead.id); }}
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Novo Lead */}
        {showNewLeadModal && (
          <div className="modal-overlay" onClick={() => {
            console.log('Fechando modal pelo overlay');
            setShowNewLeadModal(false);
          }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: '600' }}>
                    Novo Lead
                  </h2>
                  <p style={{ margin: 0, color: 'var(--secondary-text)' }}>
                    Adicione um novo lead ao seu pipeline
                  </p>
                </div>
                <button className="close-btn" onClick={() => {
                  console.log('Fechando modal pelo X');
                  setShowNewLeadModal(false);
                }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleNewLeadSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nome *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={newLeadForm.nome}
                      onChange={(e) => handleInputChange('nome', e.target.value)}
                      required
                      placeholder="Digite o nome do lead"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Empresa *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={newLeadForm.empresa}
                      onChange={(e) => handleInputChange('empresa', e.target.value)}
                      required
                      placeholder="Digite o nome da empresa"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">E-mail *</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      value={newLeadForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      placeholder="email@empresa.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input 
                      type="tel" 
                      className="form-input" 
                      value={newLeadForm.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Origem</label>
                    <select 
                      className="form-input"
                      value={newLeadForm.origem}
                      onChange={(e) => handleInputChange('origem', e.target.value)}
                    >
                      <option value="Website">Website</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Indicação">Indicação</option>
                      <option value="Evento">Evento</option>
                      <option value="Telemarketing">Telemarketing</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select 
                      className="form-input"
                      value={newLeadForm.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                    >
                      <option value="Novo">Novo</option>
                      <option value="Contatado">Contatado</option>
                      <option value="Qualificado">Qualificado</option>
                      <option value="Não Qualificado">Não Qualificado</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Pontuação (0-100)</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={newLeadForm.pontuacao}
                      onChange={(e) => handleInputChange('pontuacao', e.target.value ? parseInt(e.target.value) : 0)}
                      min="0"
                      max="100"
                    />
                    <div className="scoring-help">
                      <h4>💡 Como pontuar seu lead:</h4>
                      <div className="scoring-levels">
                        <div className="scoring-level cold">
                          <div>0-25 pts</div>
                          <div>🧊 Frio</div>
                        </div>
                        <div className="scoring-level warm">
                          <div>26-50 pts</div>
                          <div>🔥 Morno</div>
                        </div>
                        <div className="scoring-level hot">
                          <div>51-75 pts</div>
                          <div>🌡️ Quente</div>
                        </div>
                        <div className="scoring-level qualified">
                          <div>76-100 pts</div>
                          <div>✨ Qualificado</div>
                        </div>
                      </div>
                      <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.8rem', color: 'var(--secondary-text)' }}>
                        <strong>Frio (0-25):</strong> Interesse baixo, precisa ser nutrido<br/>
                        <strong>Morno (26-50):</strong> Demonstrou interesse inicial<br/>
                        <strong>Quente (51-75):</strong> Interesse alto, pronto para contato<br/>
                        <strong>Qualificado (76-100):</strong> Forte intenção de compra
                      </p>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Próxima Ação</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={newLeadForm.proximaAcao}
                      onChange={(e) => handleInputChange('proximaAcao', e.target.value)}
                      placeholder="Ex: Ligar na segunda-feira"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea 
                    className="form-textarea" 
                    rows="3"
                    value={newLeadForm.observacoes}
                    onChange={(e) => handleInputChange('observacoes', e.target.value)}
                    placeholder="Adicione observações sobre o lead..."
                  ></textarea>
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={() => {
                      console.log('Botão Cancelar clicado');
                      setShowNewLeadModal(false);
                    }}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={() => console.log('Botão Criar Lead clicado')}
                  >
                    <Plus size={16} /> Criar Lead
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Detalhes */}
        {selectedLead && (
          <div className="modal-overlay" onClick={() => { setSelectedLead(null); setEditingLead(null); }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2 style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', fontWeight: '600' }}>
                    {editingLead ? 'Editar Lead' : selectedLead.nome}
                  </h2>
                  <p style={{ margin: 0, color: 'var(--secondary-text)' }}>
                    {editingLead ? 'Modifique as informações do lead' : selectedLead.empresa}
                  </p>
                </div>
                <button className="close-btn" onClick={() => { setSelectedLead(null); setEditingLead(null); }}>
                  <X size={20} />
                </button>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Nome</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingLead ? editingLead.nome : selectedLead.nome}
                    onChange={(e) => editingLead && handleEditInputChange('nome', e.target.value)}
                    readOnly={!editingLead}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Empresa</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={editingLead ? editingLead.empresa : selectedLead.empresa}
                    onChange={(e) => editingLead && handleEditInputChange('empresa', e.target.value)}
                    readOnly={!editingLead}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">E-mail</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={editingLead ? editingLead.email : selectedLead.email}
                    onChange={(e) => editingLead && handleEditInputChange('email', e.target.value)}
                    readOnly={!editingLead}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    value={editingLead ? editingLead.telefone : selectedLead.telefone}
                    onChange={(e) => editingLead && handleEditInputChange('telefone', e.target.value)}
                    readOnly={!editingLead}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Origem</label>
                  {editingLead ? (
                    <select 
                      className="form-input"
                      value={editingLead.origem}
                      onChange={(e) => handleEditInputChange('origem', e.target.value)}
                    >
                      <option value="Website">Website</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Indicação">Indicação</option>
                      <option value="Evento">Evento</option>
                      <option value="Telemarketing">Telemarketing</option>
                      <option value="Outro">Outro</option>
                    </select>
                  ) : (
                    <input type="text" className="form-input" value={selectedLead.origem} readOnly />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    className="form-input"
                    value={editingLead ? editingLead.status : selectedLead.status}
                    onChange={(e) => editingLead && handleEditInputChange('status', e.target.value)}
                    disabled={!editingLead}
                  >
                    <option value="Novo">Novo</option>
                    <option value="Contatado">Contatado</option>
                    <option value="Qualificado">Qualificado</option>
                    <option value="Não Qualificado">Não Qualificado</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Pontuação</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editingLead ? editingLead.pontuacao : selectedLead.pontuacao}
                    onChange={(e) => editingLead && handleEditInputChange('pontuacao', parseInt(e.target.value))}
                    readOnly={!editingLead}
                    min="0"
                    max="100"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tentativas</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    value={editingLead ? editingLead.tentativas : selectedLead.tentativas || 0}
                    readOnly
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Próxima Ação</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editingLead ? editingLead.proximaAcao : selectedLead.proximaAcao}
                  onChange={(e) => editingLead && handleEditInputChange('proximaAcao', e.target.value)}
                  readOnly={!editingLead}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea 
                  className="form-textarea" 
                  rows="4"
                  value={editingLead ? editingLead.observacoes : selectedLead.observacoes}
                  onChange={(e) => editingLead && handleEditInputChange('observacoes', e.target.value)}
                  readOnly={!editingLead}
                  placeholder={editingLead ? "Adicione observações sobre o lead..." : ""}
                ></textarea>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => { setSelectedLead(null); setEditingLead(null); }}
                >
                  Cancelar
                </button>
                {editingLead ? (
                  <button className="btn btn-primary" onClick={handleSaveEditedLead}>
                    <CheckCircle size={16} /> Salvar Alterações
                  </button>
                ) : (
                  <button className="btn btn-primary" onClick={() => setEditingLead({ ...selectedLead })}>
                    <Edit size={16} /> Editar Lead
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
      )}
    </>
  );
}

export default GestaoLeads;