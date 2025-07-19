import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  Plus, DollarSign, Calendar, FileText, TrendingUp, BarChart3, 
  Search, Filter, Eye, Edit, Edit2, Trash2, Download, Upload, RefreshCw,
  CheckCircle, Clock, AlertCircle, X, Save, User, Building,
  Target, Activity, Award, ChevronRight, ArrowUpRight, Phone,
  Mail, MapPin, Users, Briefcase, Star, MoreVertical, Settings,
  Archive, Bell, Info, Zap, Shield, Layers, Grid, List,
  Calendar as CalendarIcon, Timer, Percent, Calculator,
  TrendingDown, Package, Truck, CreditCard, ShoppingCart
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { db } from '../../config/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';

// Estilos Glassmorphism para Vendas
const VendasStyles = () => (
  <style>{`
    :root {
      --primary-text: #111827;
      --secondary-text: #6b7280;
      --muted-text: #9ca3af;
      --accent-blue: #3b82f6;
      --accent-green: #10b981;
      --accent-orange: #f59e0b;
      --accent-purple: #8b5cf6;
      --accent-red: #ef4444;
      --accent-indigo: #6366f1;
      --accent-pink: #ec4899;
      --accent-teal: #14b8a6;
      --bg-primary: #ffffff;
      --bg-secondary: #f8fafc;
      --border-light: #e5e7eb;
      --glass-bg: rgba(255, 255, 255, 0.85);
      --glass-border: rgba(255, 255, 255, 0.2);
      --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      --glass-shadow-hover: 0 16px 48px rgba(0, 0, 0, 0.15);
    }

    .vendas-container {
      min-height: 100vh;
      background: #f8fafc;
      padding: 2rem;
      position: relative;
    }

    .vendas-content {
      position: relative;
      z-index: 1;
      max-width: 1400px;
      margin: 0 auto;
    }

    .modern-header {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .modern-header:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .header-left {
      flex: 1;
      min-width: 300px;
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--primary-text);
      margin: 0 0 0.5rem 0;
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      font-size: 1.1rem;
      color: var(--secondary-text);
      margin-bottom: 1.5rem;
      font-weight: 500;
    }

    .header-stats {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .stat-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      font-size: 0.875rem;
      color: var(--primary-text);
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .stat-chip:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      background: #f9fafb;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      align-items: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.875rem;
      border: none;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      transition: left 0.6s ease;
    }

    .btn:hover::before {
      left: 100%;
    }

    .btn-primary {
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }

    .btn-primary:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    .btn-secondary {
      background: white;
      color: var(--primary-text);
      border: 1px solid #e5e7eb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      background: #f9fafb;
    }

    .btn-danger {
      background: linear-gradient(135deg, var(--accent-red), #dc2626);
      color: white;
      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
    }

    .btn-danger:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none !important;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }

    .stat-card:hover::before {
      transform: scaleX(1);
    }

    .stat-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .stat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .stat-icon {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }

    .stat-icon.blue { 
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }
    .stat-icon.green { 
      background: linear-gradient(135deg, var(--accent-green), var(--accent-teal));
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }
    .stat-icon.orange { 
      background: linear-gradient(135deg, var(--accent-orange), #f97316);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.3);
    }
    .stat-icon.purple { 
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }
    .stat-icon.red { 
      background: linear-gradient(135deg, var(--accent-red), #dc2626);
      box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
    }

    .stat-trend {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: 600;
      backdrop-filter: blur(10px);
    }

    .stat-trend.positive {
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent-green);
    }

    .stat-trend.negative {
      background: rgba(239, 68, 68, 0.15);
      color: var(--accent-red);
    }

    .stat-trend.neutral {
      background: rgba(107, 114, 128, 0.15);
      color: var(--secondary-text);
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 2.5rem;
      font-weight: 800;
      color: var(--primary-text);
      margin-bottom: 0.5rem;
      line-height: 1;
    }

    .stat-label {
      font-size: 0.875rem;
      color: var(--secondary-text);
      font-weight: 500;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tag-dados-importados {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.125rem 0.375rem;
      background: rgba(16, 185, 129, 0.1);
      color: var(--accent-green);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 4px;
      font-size: 0.625rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-details {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      color: var(--muted-text);
    }

    .features-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .feature-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      position: relative;
      overflow: hidden;
    }

    .feature-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-blue), var(--accent-purple));
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }

    .feature-card:hover::before {
      transform: scaleX(1);
    }

    .feature-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .feature-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .feature-icon {
      width: 3rem;
      height: 3rem;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .feature-icon.green { 
      background: linear-gradient(135deg, var(--accent-green), var(--accent-teal));
      box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
    }
    .feature-icon.blue { 
      background: linear-gradient(135deg, var(--accent-blue), var(--accent-indigo));
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }
    .feature-icon.purple { 
      background: linear-gradient(135deg, var(--accent-purple), var(--accent-pink));
      box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
    }

    .feature-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0 0 0.25rem 0;
    }

    .feature-subtitle {
      font-size: 0.875rem;
      color: var(--secondary-text);
      margin: 0;
    }

    .feature-metrics {
      display: flex;
      justify-content: space-around;
      margin-bottom: 1.5rem;
      padding: 1.5rem;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .metric-item {
      text-align: center;
    }

    .metric-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-text);
      margin-bottom: 0.25rem;
    }

    .metric-label {
      font-size: 0.75rem;
      color: var(--secondary-text);
      font-weight: 500;
    }

    .w-full {
      width: 100%;
    }

    .alert {
      padding: 1rem 1.5rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }

    .alert:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }

    .alert.success {
      background: rgba(16, 185, 129, 0.1);
      color: var(--accent-green);
    }

    .alert.error {
      background: rgba(239, 68, 68, 0.1);
      color: var(--accent-red);
    }

    .alert.warning {
      background: rgba(245, 158, 11, 0.1);
      color: var(--accent-orange);
    }

    .historico-vendas {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
    }

    .historico-vendas:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .historico-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .historico-titulo-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .historico-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0;
    }

    .periodo-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(102, 126, 234, 0.1);
      border: 1px solid rgba(102, 126, 234, 0.2);
      color: var(--accent-blue);
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .historico-filtro {
      display: flex;
      gap: 0.5rem;
      background: #f8fafc;
      border-radius: 12px;
      padding: 0.25rem;
      border: 1px solid #e5e7eb;
    }

    .filtro-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      background: transparent;
      color: var(--secondary-text);
    }

    .filtro-btn.active {
      background: var(--accent-blue);
      color: white;
      box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
    }

    .filtro-btn:hover {
      background: rgba(59, 130, 246, 0.1);
      color: var(--accent-blue);
    }

    .historico-lista {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .historico-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      transition: all 0.3s ease;
      position: relative;
    }

    .historico-item:hover {
      background: rgba(59, 130, 246, 0.05);
      border-color: rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }

    .historico-item.atrasado {
      background: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.2);
      border-left: 4px solid #ef4444;
    }

    .historico-item.atrasado:hover {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.3);
    }

    .historico-item.faturado {
      background: rgba(16, 185, 129, 0.05);
      border-color: rgba(16, 185, 129, 0.1);
    }

    .historico-info {
      flex: 1;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
      gap: 1rem;
      align-items: center;
    }

    .historico-detail {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .historico-label {
      font-size: 0.75rem;
      color: var(--secondary-text);
      font-weight: 500;
    }

    .historico-value {
      font-size: 0.875rem;
      color: var(--primary-text);
      font-weight: 600;
    }

    .historico-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-indicator.faturado {
      background: var(--accent-green);
    }

    .status-indicator.pendente {
      background: var(--accent-orange);
    }

    .status-indicator.atrasado {
      background: var(--accent-red);
    }

    .tag-atraso {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: rgba(239, 68, 68, 0.1);
      color: var(--accent-red);
      border: 1px solid rgba(239, 68, 68, 0.2);
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
      animation: pulse 2s infinite;
    }

    .tag-producao {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.25rem 0.5rem;
      background: rgba(139, 92, 246, 0.1);
      color: var(--accent-purple);
      border: 1px solid rgba(139, 92, 246, 0.2);
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .dias-pendente {
      font-size: 0.75rem;
      color: var(--secondary-text);
      font-style: italic;
    }

    .dias-pendente.atrasado {
      color: var(--accent-red);
      font-weight: 600;
    }

    .historico-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-edit {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.2);
      color: var(--accent-blue);
      padding: 0.5rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-edit:hover {
      background: rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }

    .items-producao {
      font-size: 0.8rem;
      color: var(--secondary-text);
      font-style: italic;
      background: rgba(249, 115, 22, 0.1);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      border: 1px solid rgba(249, 115, 22, 0.2);
      display: block;
      margin-top: 0.25rem;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
      font-family: inherit;
    }

    .calendario-selector {
      position: relative;
      display: inline-block;
    }

    .calendario-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.1);
      z-index: 999;
    }

    .btn-calendar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }

    .btn-calendar:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
    }

    .calendario-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      padding: 1rem;
      min-width: 300px;
      margin-top: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .calendario-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .nav-btn {
      background: rgba(102, 126, 234, 0.1);
      border: none;
      color: var(--accent-blue);
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .nav-btn:hover {
      background: rgba(102, 126, 234, 0.2);
    }

    .mes-ano-atual {
      font-weight: 600;
      color: var(--primary-text);
      font-size: 1rem;
    }

    .calendario-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .mes-btn {
      background: rgba(102, 126, 234, 0.05);
      border: 1px solid rgba(102, 126, 234, 0.1);
      color: var(--primary-text);
      padding: 0.5rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
      text-transform: capitalize;
    }

    .mes-btn:hover {
      background: rgba(102, 126, 234, 0.1);
      transform: translateY(-1px);
    }

    .mes-btn.selected {
      background: var(--accent-blue);
      color: white;
      border-color: var(--accent-blue);
    }

    .calendario-actions {
      display: flex;
      justify-content: center;
      padding-top: 0.5rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-hoje {
      background: rgba(34, 197, 94, 0.1);
      border: 1px solid rgba(34, 197, 94, 0.2);
      color: #22c55e;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-hoje:hover {
      background: rgba(34, 197, 94, 0.2);
      transform: translateY(-1px);
    }

    .preview-container {
      margin: 1rem 0;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: #f8fafc;
    }

    .preview-table {
      max-height: 400px;
      overflow-y: auto;
    }

    .preview-table table {
      font-size: 0.875rem;
    }

    .preview-table th {
      background: #f1f5f9;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .preview-table tr:hover {
      background: rgba(59, 130, 246, 0.05);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .fade-in-up {
      animation: fadeInUp 0.5s ease-out;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
      padding: 1rem;
    }

    .modal-content {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      padding: 2rem;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: modalSlideIn 0.3s ease-out;
    }

    .modal-content.large {
      max-width: 800px;
    }

    @keyframes modalSlideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--glass-border);
    }

    .modal-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-text);
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--secondary-text);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      color: var(--primary-text);
      background: rgba(0, 0, 0, 0.05);
      transform: scale(1.1);
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-label {
      display: block;
      font-weight: 600;
      color: var(--primary-text);
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .form-input, .form-textarea, .form-select {
      width: 100%;
      padding: 0.875rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      background: white;
      color: var(--primary-text);
      font-size: 0.875rem;
      transition: all 0.3s ease;
    }

    .form-input:focus, .form-textarea:focus, .form-select:focus {
      outline: none;
      border-color: var(--accent-blue);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      background: white;
    }

    .form-checkbox {
      width: 1.25rem;
      height: 1.25rem;
      accent-color: var(--accent-blue);
      margin-right: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-size: 0.875rem;
      color: var(--primary-text);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .btn-cancel {
      background: white;
      color: var(--secondary-text);
      border: 1px solid #e5e7eb;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
    }

    .btn-cancel:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
    }

    .btn-save {
      background: var(--accent-blue);
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-save:hover {
      background: #2563eb;
    }

    .btn-save:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
    }

    .btn-save:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    @media (max-width: 768px) {
      .vendas-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .header-actions {
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .calendario-dropdown {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        max-width: 350px;
        margin-top: 0;
      }

      .historico-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .historico-titulo-container {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .features-section {
        grid-template-columns: 1fr;
      }

      .modal-content {
        margin: 1rem;
        max-width: calc(100% - 2rem);
      }
    }
  `}</style>
);

const VendasPage = () => {
  const { currentUser: user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [filtroHistorico, setFiltroHistorico] = useState('todos');
  const [mesAnoSelecionado, setMesAnoSelecionado] = useState({
    mes: new Date().getMonth(),
    ano: new Date().getFullYear()
  });
  const [showCalendario, setShowCalendario] = useState(false);
  
  // Estados para modais
  const [showAddVendaModal, setShowAddVendaModal] = useState(false);
  const [showAddFaturamentoModal, setShowAddFaturamentoModal] = useState(false);
  const [showHistoricoModal, setShowHistoricoModal] = useState(false);
  const [showEditVendaModal, setShowEditVendaModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [showLimparDadosModal, setShowLimparDadosModal] = useState(false);
  const [showImportarPlanilhaModal, setShowImportarPlanilhaModal] = useState(false);
  const [arquivoPlanilha, setArquivoPlanilha] = useState(null);
  const [dadosImportacao, setDadosImportacao] = useState([]);
  const [previewImportacao, setPreviewImportacao] = useState(false);
  
  // Estados para edição
  const [vendaEditando, setVendaEditando] = useState(null);
  const [vendaParaExcluir, setVendaParaExcluir] = useState(null);
  
  // Estados para dados
  const [vendas, setVendas] = useState([]);
  const [faturamentos, setFaturamentos] = useState([]);
  const [historico, setHistorico] = useState([]);
  
  // Estados para formulários
  const [novaVenda, setNovaVenda] = useState({
    numeroPedido: '',
    nomeCliente: '',
    valorPedido: '',
    dataPedido: '',
    previsaoFaturamento: '',
    aguardandoProducao: false,
    itensProducao: ''
  });
  
  const [novoFaturamento, setNovoFaturamento] = useState({
    numeroPedido: '',
    valorFaturado: '',
    dataFaturamento: ''
  });
  
  // Estados para estatísticas
  const [estatisticas, setEstatisticas] = useState({
    totalVendidoMes: 0,
    totalFaturadoMes: 0,
    comissaoMes: 0,
    totalPedidosMes: 0,
    pedidosPendentes: 0,
    valorPedidosAbertos: 0,
    pedidosAguardandoProducao: 0,
    pedidosAtrasados: 0,
    ticketMedio: 0,
    percentualFaturamento: 0
  });

  const carregarDados = async () => {
    setLoading(true);
    try {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const vendasQuery = query(
        collection(db, 'vendas'),
        where('userId', '==', user.uid)
      );
      const vendasSnapshot = await getDocs(vendasQuery);
      const vendasData = vendasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(b.dataPedido) - new Date(a.dataPedido));
      
      const faturamentosQuery = query(
        collection(db, 'faturamentos'),
        where('userId', '==', user.uid)
      );
      const faturamentosSnapshot = await getDocs(faturamentosQuery);
      const faturamentosData = faturamentosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a, b) => new Date(b.dataFaturamento) - new Date(a.dataFaturamento));
      
      setVendas(vendasData);
      setFaturamentos(faturamentosData);
      
      calcularEstatisticas(vendasData, faturamentosData);
      criarHistorico(vendasData, faturamentosData);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const calcularEstatisticas = (vendasData, faturamentosData) => {
    const mesAtual = mesAnoSelecionado.mes;
    const anoAtual = mesAnoSelecionado.ano;
    
    // Calcular estatísticas apenas com dados do Firebase
    const vendasMes = vendasData.filter(venda => {
      const dataVenda = new Date(venda.dataPedido);
      return dataVenda.getMonth() === mesAtual && dataVenda.getFullYear() === anoAtual;
    });
    const faturamentosMes = faturamentosData.filter(faturamento => {
      const dataFaturamento = new Date(faturamento.dataFaturamento);
      return dataFaturamento.getMonth() === mesAtual && dataFaturamento.getFullYear() === anoAtual;
    });
    const totalVendido = vendasMes.reduce((sum, venda) => sum + parseFloat(venda.valorPedido || 0), 0);
    const totalFaturado = faturamentosMes.reduce((sum, faturamento) => sum + parseFloat(faturamento.valorFaturado || 0), 0);
    const comissaoMes = totalFaturado * 0.02;
    const pedidosPendentes = vendasMes.filter(venda => 
      !faturamentosData.some(fat => fat.numeroPedido === venda.numeroPedido)
    ).length;
    const pedidosAbertos = vendasData.filter(venda => 
      !faturamentosData.some(fat => fat.numeroPedido === venda.numeroPedido)
    );
    const valorPedidosAbertos = pedidosAbertos.reduce((sum, venda) => {
      const valor = parseFloat(venda.valorPedido);
      return sum + (isNaN(valor) ? 0 : valor);
    }, 0);
    const pedidosAguardandoProducao = vendasData.filter(venda => {
      const faturamento = faturamentosData.find(fat => fat.numeroPedido === venda.numeroPedido);
      return !faturamento && venda.aguardandoProducao === true;
    }).length;
    const hoje = new Date();
    const pedidosAtrasados = vendasData.filter(venda => {
      const faturamento = faturamentosData.find(fat => fat.numeroPedido === venda.numeroPedido);
      if (faturamento) return false;
      const dataPedido = new Date(venda.dataPedido);
      const diasDiferenca = Math.floor((hoje - dataPedido) / (1000 * 60 * 60 * 24));
      return diasDiferenca >= 7;
    }).length;
    const novasEstatisticas = {
      totalVendidoMes: totalVendido,
      totalFaturadoMes: totalFaturado,
      comissaoMes: comissaoMes,
      totalPedidosMes: vendasMes.length,
      pedidosPendentes: pedidosPendentes,
      valorPedidosAbertos: valorPedidosAbertos,
      pedidosAguardandoProducao: pedidosAguardandoProducao,
      pedidosAtrasados: pedidosAtrasados,
      ticketMedio: vendasMes.length > 0 ? totalVendido / vendasMes.length : 0,
      percentualFaturamento: totalVendido > 0 ? (totalFaturado / totalVendido) * 100 : 0,
      dadosImportados: false
    };
    setEstatisticas(novasEstatisticas);
  };

  const criarHistorico = (vendasData, faturamentosData) => {
    const historicoCombinado = vendasData.map(venda => {
      const faturamento = faturamentosData.find(fat => fat.numeroPedido === venda.numeroPedido);
      const dataPedido = new Date(venda.dataPedido);
      const hoje = new Date();
      const diasDiferenca = Math.floor((hoje - dataPedido) / (1000 * 60 * 60 * 24));
      
      // Verificar se está atrasado (mais de 7 dias sem faturamento)
      const estaAtrasado = !faturamento && diasDiferenca >= 7;
      
      return {
        id: venda.id,
        numeroPedido: venda.numeroPedido,
        nomeCliente: venda.nomeCliente,
        valorVendido: venda.valorPedido,
        valorFaturado: faturamento ? faturamento.valorFaturado : 0,
        dataPedido: venda.dataPedido,
        dataFaturamento: faturamento ? faturamento.dataFaturamento : null,
        previsaoFaturamento: venda.previsaoFaturamento || null,
        status: faturamento ? 'Faturado' : 'Pendente',
        diasPendente: !faturamento ? diasDiferenca : 0,
        estaAtrasado: estaAtrasado,
        // Quando faturado, remove as tags de produção e pendente
        aguardandoProducao: faturamento ? false : (venda.aguardandoProducao || false),
        itensProducao: venda.itensProducao || '',
        vendaOriginal: venda
      };
    });
    
    // Ordenar: pendentes primeiro (com atrasados no topo), depois faturados
    const historicoOrdenado = historicoCombinado.sort((a, b) => {
      // Se ambos são faturados ou ambos são pendentes
      if (a.status === b.status) {
        if (a.status === 'Pendente') {
          // Entre pendentes: atrasados primeiro, depois por dias pendentes (mais antigos primeiro)
          if (a.estaAtrasado && !b.estaAtrasado) return -1;
          if (!a.estaAtrasado && b.estaAtrasado) return 1;
          return b.diasPendente - a.diasPendente;
        } else {
          // Entre faturados: mais recentes primeiro
          return new Date(b.dataFaturamento) - new Date(a.dataFaturamento);
        }
      }
      
      // Pendentes sempre antes de faturados
      return a.status === 'Pendente' ? -1 : 1;
    });
    
    setHistorico(historicoOrdenado);
  };

  const exportarParaExcel = () => {
    try {
      const pedidosFaturados = historico.filter(item => item.status === 'Faturado');
      
      const dadosExportacao = pedidosFaturados.map(item => {
        const valorFaturado = parseFloat(item.valorFaturado || 0);
        const comissao = valorFaturado * 0.02;
        
        return {
          'Número do Pedido': item.numeroPedido,
          'Nome do Cliente': item.nomeCliente,
          'Valor Faturado': valorFaturado,
          'Comissão (2%)': comissao,
          'Data do Pedido': item.dataPedido ? new Date(item.dataPedido).toLocaleDateString('pt-BR') : 'Não informado',
          'Data de Faturamento': item.dataFaturamento ? new Date(item.dataFaturamento).toLocaleDateString('pt-BR') : 'Não informado'
        };
      });
      
      const totalFaturado = pedidosFaturados.reduce((sum, item) => sum + parseFloat(item.valorFaturado || 0), 0);
      const totalComissao = totalFaturado * 0.02;
      
      dadosExportacao.push({
        'Número do Pedido': '',
        'Nome do Cliente': 'TOTAL',
        'Valor Faturado': totalFaturado,
        'Comissão (2%)': totalComissao,
        'Data do Pedido': '',
        'Data de Faturamento': ''
      });
      
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dadosExportacao);
      
      const columnWidths = [
        { wch: 20 },
        { wch: 25 },
        { wch: 18 },
        { wch: 15 },
        { wch: 15 },
        { wch: 18 }
      ];
      ws['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(wb, ws, 'Pedidos Faturados');
      
      const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const nomeArquivo = `pedidos-faturados-${dataAtual}.xlsx`;
      
      XLSX.writeFile(wb, nomeArquivo);
      
      setSuccessMessage('Dados exportados com sucesso!');
      
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      setError('Erro ao exportar dados para Excel');
    }
  };

  const filtrarHistoricoPorPeriodo = (historico) => {
    const mesAtual = mesAnoSelecionado.mes;
    const anoAtual = mesAnoSelecionado.ano;
    
    // Primeiro filtrar pelo mês/ano selecionado
    const historicoMesAtual = historico.filter(item => {
      const dataPedido = new Date(item.dataPedido);
      return dataPedido.getMonth() === mesAtual && dataPedido.getFullYear() === anoAtual;
    });
    
    // Depois aplicar o filtro específico
    if (filtroHistorico === 'todos') return historicoMesAtual;
    
    return historicoMesAtual.filter(item => {
      switch (filtroHistorico) {
        case 'mes_atual':
          return true; // Já filtrado acima
        case 'anteriores':
          return false; // Não aplicável com filtro de mês
        case 'pendentes':
          return item.status === 'Pendente';
        case 'faturados':
          return item.status === 'Faturado';
        case 'atrasados':
          return item.estaAtrasado;
        default:
          return true;
      }
    });
  };

  const adicionarVenda = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'vendas'), {
        ...novaVenda,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      
      setSuccessMessage('Venda adicionada com sucesso!');
      setShowAddVendaModal(false);
      setNovaVenda({
        numeroPedido: '',
        nomeCliente: '',
        valorPedido: '',
        dataPedido: '',
        previsaoFaturamento: '',
        aguardandoProducao: false,
        itensProducao: ''
      });
      
      await carregarDados();
      
    } catch (error) {
      console.error('Erro ao adicionar venda:', error);
      setError('Erro ao adicionar venda');
    } finally {
      setLoading(false);
    }
  };

  const adicionarFaturamento = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addDoc(collection(db, 'faturamentos'), {
        ...novoFaturamento,
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      
      setSuccessMessage('Faturamento adicionado com sucesso!');
      setShowAddFaturamentoModal(false);
      setNovoFaturamento({
        numeroPedido: '',
        valorFaturado: '',
        dataFaturamento: ''
      });
      
      await carregarDados();
      
    } catch (error) {
      console.error('Erro ao adicionar faturamento:', error);
      setError('Erro ao adicionar faturamento');
    } finally {
      setLoading(false);
    }
  };

  const editarVenda = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const vendaRef = doc(db, 'vendas', vendaEditando.id);
      await updateDoc(vendaRef, {
        ...vendaEditando,
        updatedAt: serverTimestamp()
      });
      
      setSuccessMessage('Venda editada com sucesso!');
      setShowEditVendaModal(false);
      setVendaEditando(null);
      
      await carregarDados();
      
    } catch (error) {
      console.error('Erro ao editar venda:', error);
      setError('Erro ao editar venda');
    } finally {
      setLoading(false);
    }
  };

  const excluirVenda = async () => {
    setLoading(true);
    
    try {
      const vendaRef = doc(db, 'vendas', vendaParaExcluir.id);
      await deleteDoc(vendaRef);
      
      setSuccessMessage('Venda excluída com sucesso!');
      setShowDeleteConfirmModal(false);
      setVendaParaExcluir(null);
      
      await carregarDados();
      
    } catch (error) {
      console.error('Erro ao excluir venda:', error);
      setError('Erro ao excluir venda');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalEdicao = (venda) => {
    setVendaEditando({...venda});
    setShowEditVendaModal(true);
  };

  const abrirModalExclusao = (venda) => {
    setVendaParaExcluir(venda);
    setShowDeleteConfirmModal(true);
  };

  const limparDadosDoMes = async () => {
    setLoading(true);
    
    try {
      const mesAtual = mesAnoSelecionado.mes;
      const anoAtual = mesAnoSelecionado.ano;
      
      const faturamentosMesAtual = faturamentos.filter(faturamento => {
        const dataFaturamento = new Date(faturamento.dataFaturamento);
        return dataFaturamento.getMonth() === mesAtual && dataFaturamento.getFullYear() === anoAtual;
      });
      
      const vendasMesAtual = vendas.filter(venda => {
        const dataVenda = new Date(venda.dataPedido);
        return dataVenda.getMonth() === mesAtual && dataVenda.getFullYear() === anoAtual;
      });
      
      const totalVendidoMes = vendasMesAtual.reduce((sum, venda) => sum + parseFloat(venda.valorPedido || 0), 0);
      const totalFaturadoMes = faturamentosMesAtual.reduce((sum, faturamento) => sum + parseFloat(faturamento.valorFaturado || 0), 0);
      
      const historicoMensal = {
        mes: `${mesAtual + 1}/${anoAtual}`,
        mesNome: new Date(anoAtual, mesAtual).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        valorVendas: totalVendidoMes,
        valorFaturado: totalFaturadoMes,
        comissao: totalFaturadoMes * 0.02,
        dataFechamento: new Date().toISOString(),
        quantidadeVendas: vendasMesAtual.length,
        quantidadeFaturamentos: faturamentosMesAtual.length
      };
      
      const historicoExistente = JSON.parse(localStorage.getItem('historico-vendas-mensais-vendedor') || '[]');
      
      const indiceExistente = historicoExistente.findIndex(h => h.mes === historicoMensal.mes);
      
      if (indiceExistente >= 0) {
        historicoExistente[indiceExistente] = historicoMensal;
      } else {
        historicoExistente.unshift(historicoMensal);
      }
      
      const historicoLimitado = historicoExistente.slice(0, 12);
      
      localStorage.setItem('historico-vendas-mensais-vendedor', JSON.stringify(historicoLimitado));
      
      const faturamentosParaExcluir = faturamentosMesAtual.map(f => f.id);
      
      for (const faturamentoId of faturamentosParaExcluir) {
        const faturamentoRef = doc(db, 'faturamentos', faturamentoId);
        await deleteDoc(faturamentoRef);
      }
      
      const vendasFaturadas = vendasMesAtual.filter(venda => 
        faturamentosMesAtual.some(fat => fat.numeroPedido === venda.numeroPedido)
      );
      
      for (const venda of vendasFaturadas) {
        const vendaRef = doc(db, 'vendas', venda.id);
        await deleteDoc(vendaRef);
      }
      
      setSuccessMessage(`Dados do mês limpos com sucesso! Histórico salvo: ${historicoMensal.mesNome}`);
      setShowLimparDadosModal(false);
      
      await carregarDados();
      
    } catch (error) {
      console.error('Erro ao limpar dados do mês:', error);
      setError('Erro ao limpar dados do mês');
    } finally {
      setLoading(false);
    }
  };

  const carregarHistoricoMensal = () => {
    const historicoSalvo = localStorage.getItem('historico-vendas-mensais-vendedor');
    return historicoSalvo ? JSON.parse(historicoSalvo) : [];
  };

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (data) => {
    if (!data) return 'Não informado';
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getInitials = (nome) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatarMesAno = (mes, ano) => {
    const meses = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${meses[mes - 1]} ${ano}`;
  };

  const alterarMesAno = (novoMes, novoAno) => {
    setMesAnoSelecionado({ mes: novoMes, ano: novoAno });
    setShowCalendario(false);
  };

  const navegarMes = (direcao) => {
    const novoMes = mesAnoSelecionado.mes + direcao;
    let novoAno = mesAnoSelecionado.ano;

    if (novoMes < 0) {
      setMesAnoSelecionado({ mes: 11, ano: novoAno - 1 });
    } else if (novoMes > 11) {
      setMesAnoSelecionado({ mes: 0, ano: novoAno + 1 });
    } else {
      setMesAnoSelecionado({ mes: novoMes, ano: novoAno });
    }
  };

  const voltarMesAtual = () => {
    setMesAnoSelecionado({
      mes: new Date().getMonth(),
      ano: new Date().getFullYear()
    });
  };

  const processarPlanilha = (arquivo) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Mapear os dados da planilha para o formato esperado
        const dadosProcessados = jsonData.map((linha, index) => {
          // Aceitar diferentes nomes de colunas
          const valorVendido = linha['Valor vendido mes'] || linha['valor_vendido_mes'] || linha['valorVendidoMes'] || 0;
          const valorFaturado = linha['Valor faturado mes'] || linha['valor_faturado_mes'] || linha['valorFaturadoMes'] || 0;
          const ano = linha['Ano'] || linha['ano'] || new Date().getFullYear();
          const mes = linha['Mes'] || linha['mes'] || linha['Mês'] || 0; // 0 = Janeiro
          
          return {
            id: `import_${index}`,
            valorVendidoMes: parseFloat(valorVendido) || 0,
            valorFaturadoMes: parseFloat(valorFaturado) || 0,
            ano: parseInt(ano),
            mes: parseInt(mes),
            mesNome: new Date(ano, mes).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
            comissao: (parseFloat(valorFaturado) || 0) * 0.02,
            dataImportacao: new Date().toISOString()
          };
        });
        
        setDadosImportacao(dadosProcessados);
        setPreviewImportacao(true);
        
      } catch (error) {
        console.error('Erro ao processar planilha:', error);
        setError('Erro ao processar planilha. Verifique o formato do arquivo.');
      }
    };
    reader.readAsArrayBuffer(arquivo);
  };

  const confirmarImportacao = async () => {
    setLoading(true);
    try {
      // Salvar no localStorage como histórico retroativo
      const historicoExistente = JSON.parse(localStorage.getItem('historico-vendas-mensais-vendedor') || '[]');
      
      // Adicionar dados importados ao histórico
      const novoHistorico = [...historicoExistente];
      
      dadosImportacao.forEach(dado => {
        const chave = `${dado.mes + 1}/${dado.ano}`;
        const indiceExistente = novoHistorico.findIndex(h => h.mes === chave);
        
        const itemHistorico = {
          mes: chave,
          mesNome: dado.mesNome,
          valorVendas: dado.valorVendidoMes,
          valorFaturado: dado.valorFaturadoMes,
          comissao: dado.comissao,
          dataFechamento: dado.dataImportacao,
          quantidadeVendas: 1, // Valor padrão para dados importados
          quantidadeFaturamentos: dado.valorFaturadoMes > 0 ? 1 : 0,
          importado: true
        };
        
        if (indiceExistente >= 0) {
          novoHistorico[indiceExistente] = itemHistorico;
        } else {
          novoHistorico.push(itemHistorico);
        }
      });
      
      // Ordenar por data (mais recente primeiro)
      novoHistorico.sort((a, b) => {
        const [mesA, anoA] = a.mes.split('/').map(Number);
        const [mesB, anoB] = b.mes.split('/').map(Number);
        return (anoB * 12 + mesB) - (anoA * 12 + mesA);
      });
      
      // Limitar a 24 meses
      const historicoLimitado = novoHistorico.slice(0, 24);
      
      localStorage.setItem('historico-vendas-mensais-vendedor', JSON.stringify(historicoLimitado));
      
      setSuccessMessage(`${dadosImportacao.length} registro(s) importado(s) com sucesso!`);
      setShowImportarPlanilhaModal(false);
      setDadosImportacao([]);
      setPreviewImportacao(false);
      setArquivoPlanilha(null);
      
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      setError('Erro ao importar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      carregarDados();
    }
  }, [user, mesAnoSelecionado]);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  return (
    <>
      <VendasStyles />
      <div className="vendas-container">
        <div className="vendas-content">
          {/* Header Moderno */}
          <div className="modern-header fade-in-up">
            <div className="header-content">
              <div className="header-left">
                <h1 className="header-title">Controle de Vendas</h1>
                <p className="header-subtitle">Gerencie suas vendas e faturamentos com eficiência e elegância</p>
                <div className="header-stats">
                  <div className="stat-chip">
                    <TrendingUp size={16} />
                    <span>{estatisticas.totalPedidosMes} pedidos no mês</span>
                  </div>
                  <div className="stat-chip">
                    <DollarSign size={16} />
                    <span>{formatarMoeda(estatisticas.totalVendidoMes)} em vendas</span>
                  </div>
                  <div className="stat-chip">
                    <Award size={16} />
                    <span>{formatarMoeda(estatisticas.comissaoMes)} comissão</span>
                  </div>
                  {estatisticas.pedidosAtrasados > 0 && (
                    <div className="stat-chip" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                      <AlertCircle size={16} />
                      <span>{estatisticas.pedidosAtrasados} pedido{estatisticas.pedidosAtrasados !== 1 ? 's' : ''} atrasado{estatisticas.pedidosAtrasados !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="header-actions">
                <div className="calendario-selector">
                  <button
                    onClick={() => setShowCalendario(!showCalendario)}
                    className="btn btn-calendar"
                  >
                    <Calendar size={16} />
                    {formatarMesAno(mesAnoSelecionado.mes, mesAnoSelecionado.ano)}
                  </button>
                  
                  {showCalendario && (
                    <>
                      <div 
                        className="calendario-overlay"
                        onClick={() => setShowCalendario(false)}
                      />
                      <div className="calendario-dropdown">
                        <div className="calendario-header">
                          <button
                            onClick={() => navegarMes(-1)}
                            className="nav-btn"
                          >
                            <ChevronRight size={16} style={{ transform: 'rotate(180deg)' }} />
                          </button>
                          <span className="mes-ano-atual">
                            {formatarMesAno(mesAnoSelecionado.mes, mesAnoSelecionado.ano)}
                          </span>
                          <button
                            onClick={() => navegarMes(1)}
                            className="nav-btn"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                        
                        <div className="calendario-grid">
                          {Array.from({ length: 12 }, (_, i) => (
                            <button
                              key={i}
                              onClick={() => alterarMesAno(i, mesAnoSelecionado.ano)}
                              className={`mes-btn ${i === mesAnoSelecionado.mes ? 'selected' : ''}`}
                            >
                              {new Date(2024, i).toLocaleDateString('pt-BR', { month: 'short' })}
                            </button>
                          ))}
                        </div>
                        
                        <div className="calendario-actions">
                          <button
                            onClick={voltarMesAtual}
                            className="btn-hoje"
                          >
                            Mês Atual
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <button
                  onClick={exportarParaExcel}
                  className="btn btn-secondary"
                  disabled={historico.length === 0}
                >
                  <Download size={16} />
                  Exportar Excel
                </button>
                <button
                  onClick={() => setShowImportarPlanilhaModal(true)}
                  className="btn btn-primary"
                >
                  <Upload size={16} />
                  Importar Planilha
                </button>
                <button
                  onClick={() => setShowLimparDadosModal(true)}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  <Trash2 size={16} />
                  Limpar Dados
                </button>
                <button
                  onClick={carregarDados}
                  className="btn btn-primary"
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'spin' : ''} />
                  Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* Mensagens de Alerta */}
          {successMessage && (
            <div className="alert success fade-in-up">
              <CheckCircle size={20} />
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="alert error fade-in-up">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          {/* Grid de Estatísticas */}
          <div className="stats-grid">
            <div className="stat-card fade-in-up">
              <div className="stat-header">
                <div className="stat-icon green">
                  <TrendingUp size={24} />
                </div>
                <div className="stat-trend positive">
                  <ArrowUpRight size={12} />
                  +{estatisticas.totalPedidosMes}
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatarMoeda(estatisticas.totalVendidoMes)}</div>
                <div className="stat-label">
                  Vendas do Mês
                  {estatisticas.dadosImportados && (
                    <span className="tag-dados-importados">
                      <Upload size={10} />
                      Importado
                    </span>
                  )}
                </div>
                <div className="stat-details">
                  <Target size={12} />
                  <span>Ticket médio: {formatarMoeda(estatisticas.ticketMedio)}</span>
                </div>
              </div>
            </div>

            <div className="stat-card fade-in-up">
              <div className="stat-header">
                <div className="stat-icon blue">
                  <DollarSign size={24} />
                </div>
                <div className="stat-trend positive">
                  <TrendingUp size={12} />
                  {estatisticas.percentualFaturamento.toFixed(1)}%
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatarMoeda(estatisticas.totalFaturadoMes)}</div>
                <div className="stat-label">
                  Faturamento do Mês
                  {estatisticas.dadosImportados && (
                    <span className="tag-dados-importados">
                      <Upload size={10} />
                      Importado
                    </span>
                  )}
                </div>
                <div className="stat-details">
                  <Calculator size={12} />
                  <span>Taxa de conversão em faturamento</span>
                </div>
              </div>
            </div>

            <div className="stat-card fade-in-up">
              <div className="stat-header">
                <div className="stat-icon purple">
                  <Award size={24} />
                </div>
                <div className="stat-trend positive">
                  <Star size={12} />
                  2%
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatarMoeda(estatisticas.comissaoMes)}</div>
                <div className="stat-label">
                  Comissão do Mês
                  {estatisticas.dadosImportados && (
                    <span className="tag-dados-importados">
                      <Upload size={10} />
                      Importado
                    </span>
                  )}
                </div>
                <div className="stat-details">
                  <Percent size={12} />
                  <span>Baseado no faturamento</span>
                </div>
              </div>
            </div>

            <div className="stat-card fade-in-up">
              <div className="stat-header">
                <div className="stat-icon orange">
                  <Clock size={24} />
                </div>
                <div className="stat-trend neutral">
                  <Timer size={12} />
                  Em produção
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{estatisticas.pedidosAguardandoProducao}</div>
                <div className="stat-label">Aguardando Produção</div>
                <div className="stat-details">
                  <Activity size={12} />
                  <span>Pedidos em processo</span>
                </div>
              </div>
            </div>

            <div className="stat-card fade-in-up">
              <div className="stat-header">
                <div className="stat-icon red">
                  <AlertCircle size={24} />
                </div>
                <div className="stat-trend neutral">
                  <Package size={12} />
                  Pendentes
                </div>
              </div>
              <div className="stat-content">
                <div className="stat-value">{formatarMoeda(estatisticas.valorPedidosAbertos)}</div>
                <div className="stat-label">Pedidos em Aberto</div>
                <div className="stat-details">
                  <CreditCard size={12} />
                  <span>Aguardando faturamento</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Funcionalidades */}
          <div className="features-section">
            {/* Card Vendas */}
            <div className="feature-card fade-in-up">
              <div className="feature-header">
                <div className="feature-icon green">
                  <Plus size={24} />
                </div>
                <div>
                  <h3 className="feature-title">Registrar Vendas</h3>
                  <p className="feature-subtitle">Adicione novos pedidos ao sistema</p>
                </div>
              </div>
              
              <div className="feature-metrics">
                <div className="metric-item">
                  <div className="metric-value">{vendas.length}</div>
                  <div className="metric-label">Total de Pedidos</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">{estatisticas.totalPedidosMes}</div>
                  <div className="metric-label">Pedidos do Mês</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">{formatarMoeda(estatisticas.totalVendidoMes)}</div>
                  <div className="metric-label">Valor do Mês</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddVendaModal(true)}
                className="btn btn-primary w-full"
              >
                <Plus size={16} />
                Adicionar Venda
              </button>
            </div>

            {/* Card Faturamentos */}
            <div className="feature-card fade-in-up">
              <div className="feature-header">
                <div className="feature-icon blue">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h3 className="feature-title">Registrar Faturamentos</h3>
                  <p className="feature-subtitle">Controle valores faturados</p>
                </div>
              </div>
              
              <div className="feature-metrics">
                <div className="metric-item">
                  <div className="metric-value">{faturamentos.length}</div>
                  <div className="metric-label">Total Faturado</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">{historico.filter(h => h.status === 'Faturado').length}</div>
                  <div className="metric-label">Faturados do Mês</div>
                </div>
                <div className="metric-item">
                  <div className="metric-value">{formatarMoeda(estatisticas.totalFaturadoMes)}</div>
                  <div className="metric-label">Valor do Mês</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowAddFaturamentoModal(true)}
                className="btn btn-primary w-full"
              >
                <Plus size={16} />
                Adicionar Faturamento
              </button>
            </div>
          </div>

          {/* Histórico de Vendas */}
          <div className="historico-vendas fade-in-up">
            <div className="historico-header">
              <div className="historico-titulo-container">
                <h2 className="historico-title">Histórico de Vendas</h2>
                <div className="periodo-indicator">
                  <Calendar size={14} />
                  <span>{formatarMesAno(mesAnoSelecionado.mes, mesAnoSelecionado.ano)}</span>
                </div>
              </div>
              <div className="historico-filtro">
                <button
                  className={`filtro-btn ${filtroHistorico === 'todos' ? 'active' : ''}`}
                  onClick={() => setFiltroHistorico('todos')}
                >
                  Todos
                </button>
                <button
                  className={`filtro-btn ${filtroHistorico === 'pendentes' ? 'active' : ''}`}
                  onClick={() => setFiltroHistorico('pendentes')}
                >
                  Pendentes
                </button>
                <button
                  className={`filtro-btn ${filtroHistorico === 'atrasados' ? 'active' : ''}`}
                  onClick={() => setFiltroHistorico('atrasados')}
                  style={{ color: filtroHistorico === 'atrasados' ? 'white' : '#ef4444', background: filtroHistorico === 'atrasados' ? '#ef4444' : 'transparent' }}
                >
                  <AlertCircle size={14} />
                  Atrasados
                </button>
                <button
                  className={`filtro-btn ${filtroHistorico === 'faturados' ? 'active' : ''}`}
                  onClick={() => setFiltroHistorico('faturados')}
                >
                  Faturados
                </button>
                <button
                  className={`filtro-btn ${filtroHistorico === 'mes_atual' ? 'active' : ''}`}
                  onClick={() => setFiltroHistorico('mes_atual')}
                >
                  Mês Atual
                </button>
              </div>
            </div>
            
            <div className="historico-lista">
              {filtrarHistoricoPorPeriodo(historico).slice(0, 10).map((item, index) => (
                <div key={index} className={`historico-item ${item.estaAtrasado ? 'atrasado' : ''} ${item.status.toLowerCase()}`}>
                  <div className="historico-info">
                    <div className="historico-detail">
                      <span className="historico-label">Pedido</span>
                      <span className="historico-value">{item.numeroPedido}</span>
                    </div>
                    <div className="historico-detail">
                      <span className="historico-label">Cliente</span>
                      <span className="historico-value">{item.nomeCliente}</span>
                    </div>
                    <div className="historico-detail">
                      <span className="historico-label">Valor Vendido</span>
                      <span className="historico-value">{formatarMoeda(item.valorVendido)}</span>
                    </div>
                    <div className="historico-detail">
                      <span className="historico-label">Data Pedido</span>
                      <span className="historico-value">{formatarData(item.dataPedido)}</span>
                      {item.status === 'Pendente' && (
                        <span className={`dias-pendente ${item.estaAtrasado ? 'atrasado' : ''}`}>
                          {item.diasPendente} dia{item.diasPendente !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    <div className="historico-detail">
                      <span className="historico-label">Status</span>
                      <div className="historico-status">
                        <span className={`status-indicator ${item.estaAtrasado ? 'atrasado' : item.status.toLowerCase()}`}></span>
                        <span className="historico-value">{item.status}</span>
                      </div>
                      {item.estaAtrasado && (
                        <div className="tag-atraso">
                          <AlertCircle size={12} />
                          Atrasado
                        </div>
                      )}
                      {item.aguardandoProducao && !item.estaAtrasado && (
                        <div className="tag-producao">
                          <Clock size={12} />
                          Produção
                        </div>
                      )}
                    </div>
                    <div className="historico-detail">
                      <span className="historico-label">
                        {item.status === 'Faturado' ? 'Data Faturamento' : 'Previsão'}
                      </span>
                      <span className="historico-value">
                        {item.status === 'Faturado' 
                          ? formatarData(item.dataFaturamento) 
                          : formatarData(item.previsaoFaturamento)
                        }
                      </span>
                    </div>
                    {item.aguardandoProducao && item.itensProducao && (
                      <div className="historico-detail">
                        <span className="historico-label">Itens em Produção</span>
                        <span className="historico-value items-producao">{item.itensProducao}</span>
                      </div>
                    )}
                  </div>
                  <div className="historico-actions">
                    {item.status === 'Pendente' && (
                      <button
                        onClick={() => abrirModalEdicao(item.vendaOriginal)}
                        className="btn-edit"
                        title="Editar pedido"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {filtrarHistoricoPorPeriodo(historico).length === 0 && (
                <div className="historico-item">
                  <div style={{ textAlign: 'center', color: 'var(--secondary-text)', width: '100%' }}>
                    <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Nenhum pedido encontrado para {formatarMesAno(mesAnoSelecionado.mes, mesAnoSelecionado.ano)}</p>
                    {estatisticas.dadosImportados ? (
                      <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                        As estatísticas mostram dados importados para este período
                      </p>
                    ) : (
                      <p style={{ fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                        Adicione vendas ou importe dados históricos para este mês
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal - Adicionar Faturamento */}
          {showAddFaturamentoModal && (
            <div className="modal-overlay" onClick={() => setShowAddFaturamentoModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Adicionar Faturamento</h2>
                  <button
                    onClick={() => setShowAddFaturamentoModal(false)}
                    className="close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={adicionarFaturamento}>
                  <div className="form-group">
                    <label className="form-label">Número do Pedido *</label>
                    <input
                      type="text"
                      value={novoFaturamento.numeroPedido}
                      onChange={(e) => setNovoFaturamento({...novoFaturamento, numeroPedido: e.target.value})}
                      className="form-input"
                      placeholder="Ex: #001234"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Valor Faturado *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novoFaturamento.valorFaturado}
                      onChange={(e) => setNovoFaturamento({...novoFaturamento, valorFaturado: e.target.value})}
                      className="form-input"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Data do Faturamento *</label>
                    <input
                      type="date"
                      value={novoFaturamento.dataFaturamento}
                      onChange={(e) => setNovoFaturamento({...novoFaturamento, dataFaturamento: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setShowAddFaturamentoModal(false)}
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-save"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={16} className="spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Salvar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal - Adicionar Venda */}
          {showAddVendaModal && (
            <div className="modal-overlay" onClick={() => setShowAddVendaModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Adicionar Nova Venda</h2>
                  <button
                    onClick={() => setShowAddVendaModal(false)}
                    className="close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={adicionarVenda}>
                  <div className="form-group">
                    <label className="form-label">Número do Pedido *</label>
                    <input
                      type="text"
                      value={novaVenda.numeroPedido}
                      onChange={(e) => setNovaVenda({...novaVenda, numeroPedido: e.target.value})}
                      className="form-input"
                      placeholder="Ex: #001234"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Nome do Cliente *</label>
                    <input
                      type="text"
                      value={novaVenda.nomeCliente}
                      onChange={(e) => setNovaVenda({...novaVenda, nomeCliente: e.target.value})}
                      className="form-input"
                      placeholder="Nome do cliente"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Valor do Pedido *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={novaVenda.valorPedido}
                      onChange={(e) => setNovaVenda({...novaVenda, valorPedido: e.target.value})}
                      className="form-input"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Data do Pedido *</label>
                    <input
                      type="date"
                      value={novaVenda.dataPedido}
                      onChange={(e) => setNovaVenda({...novaVenda, dataPedido: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Previsão de Faturamento</label>
                    <input
                      type="date"
                      value={novaVenda.previsaoFaturamento}
                      onChange={(e) => setNovaVenda({...novaVenda, previsaoFaturamento: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={novaVenda.aguardandoProducao}
                        onChange={(e) => setNovaVenda({...novaVenda, aguardandoProducao: e.target.checked})}
                        className="form-checkbox"
                      />
                      Aguardando Produção
                    </label>
                  </div>
                  
                  {novaVenda.aguardandoProducao && (
                    <div className="form-group">
                      <label className="form-label">Itens em Produção</label>
                      <textarea
                        value={novaVenda.itensProducao}
                        onChange={(e) => setNovaVenda({...novaVenda, itensProducao: e.target.value})}
                        className="form-textarea"
                        rows={3}
                        placeholder="Descreva quais itens estão aguardando produção..."
                      />
                    </div>
                  )}
                  
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setShowAddVendaModal(false)}
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-save"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={16} className="spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Salvar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal - Editar Venda */}
          {showEditVendaModal && vendaEditando && (
            <div className="modal-overlay" onClick={() => setShowEditVendaModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Editar Venda</h2>
                  <button
                    onClick={() => setShowEditVendaModal(false)}
                    className="close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={editarVenda}>
                  <div className="form-group">
                    <label className="form-label">Número do Pedido *</label>
                    <input
                      type="text"
                      value={vendaEditando.numeroPedido}
                      onChange={(e) => setVendaEditando({...vendaEditando, numeroPedido: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Nome do Cliente *</label>
                    <input
                      type="text"
                      value={vendaEditando.nomeCliente}
                      onChange={(e) => setVendaEditando({...vendaEditando, nomeCliente: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Valor do Pedido *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={vendaEditando.valorPedido}
                      onChange={(e) => setVendaEditando({...vendaEditando, valorPedido: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Data do Pedido *</label>
                    <input
                      type="date"
                      value={vendaEditando.dataPedido}
                      onChange={(e) => setVendaEditando({...vendaEditando, dataPedido: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Previsão de Faturamento</label>
                    <input
                      type="date"
                      value={vendaEditando.previsaoFaturamento || ''}
                      onChange={(e) => setVendaEditando({...vendaEditando, previsaoFaturamento: e.target.value})}
                      className="form-input"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={vendaEditando.aguardandoProducao || false}
                        onChange={(e) => setVendaEditando({...vendaEditando, aguardandoProducao: e.target.checked})}
                        className="form-checkbox"
                      />
                      Aguardando Produção
                    </label>
                  </div>
                  
                  {vendaEditando.aguardandoProducao && (
                    <div className="form-group">
                      <label className="form-label">Itens em Produção</label>
                      <textarea
                        value={vendaEditando.itensProducao || ''}
                        onChange={(e) => setVendaEditando({...vendaEditando, itensProducao: e.target.value})}
                        className="form-textarea"
                        rows={3}
                        placeholder="Descreva quais itens estão aguardando produção..."
                      />
                    </div>
                  )}
                  
                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setShowEditVendaModal(false)}
                      className="btn-cancel"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-save"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={16} className="spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Salvar
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal - Confirmar Exclusão */}
          {showDeleteConfirmModal && vendaParaExcluir && (
            <div className="modal-overlay" onClick={() => setShowDeleteConfirmModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Confirmar Exclusão</h2>
                  <button
                    onClick={() => setShowDeleteConfirmModal(false)}
                    className="close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="form-group">
                  <p>Tem certeza que deseja excluir o pedido <strong>#{vendaParaExcluir.numeroPedido}</strong> do cliente <strong>{vendaParaExcluir.nomeCliente}</strong>?</p>
                  <p>Esta ação não pode ser desfeita.</p>
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirmModal(false)}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={excluirVenda}
                    disabled={loading}
                    className="btn btn-danger"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="spin" />
                        Excluindo...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Excluir
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal - Limpar Dados */}
          {showLimparDadosModal && (
            <div className="modal-overlay" onClick={() => setShowLimparDadosModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Confirmar Limpeza de Dados</h2>
                  <button
                    onClick={() => setShowLimparDadosModal(false)}
                    className="close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="alert warning">
                  <AlertCircle size={24} />
                  <div>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Atenção!</h3>
                    <p style={{ margin: '0 0 0.5rem 0' }}>Esta ação irá:</p>
                    <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                      <li>Excluir todos os pedidos <strong>faturados</strong> do mês atual</li>
                      <li>Excluir todos os faturamentos do mês atual</li>
                      <li>Manter pedidos pendentes e aguardando produção</li>
                      <li>Salvar um histórico mensal com os dados antes da limpeza</li>
                    </ul>
                    <p style={{ margin: '0.5rem 0 0 0' }}><strong>Esta ação não pode ser desfeita!</strong></p>
                  </div>
                </div>
                
                <div className="feature-metrics">
                  <div className="metric-item">
                    <div className="metric-value">{formatarMoeda(estatisticas.totalVendidoMes)}</div>
                    <div className="metric-label">Vendas do Mês</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">{formatarMoeda(estatisticas.totalFaturadoMes)}</div>
                    <div className="metric-label">Faturado do Mês</div>
                  </div>
                  <div className="metric-item">
                    <div className="metric-value">{formatarMoeda(estatisticas.comissaoMes)}</div>
                    <div className="metric-label">Comissão do Mês</div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    onClick={() => setShowLimparDadosModal(false)}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={limparDadosDoMes}
                    disabled={loading}
                    className="btn btn-danger"
                  >
                    {loading ? (
                      <>
                        <RefreshCw size={16} className="spin" />
                        Limpando...
                      </>
                    ) : (
                      <>
                        <Trash2 size={16} />
                        Confirmar Limpeza
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal - Importar Planilha */}
          {showImportarPlanilhaModal && (
            <div className="modal-overlay" onClick={() => setShowImportarPlanilhaModal(false)}>
              <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2 className="modal-title">Importar Histórico de Vendas</h2>
                  <button
                    onClick={() => setShowImportarPlanilhaModal(false)}
                    className="close-btn"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {!previewImportacao ? (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Arquivo da Planilha (.xlsx, .xls, .csv)</label>
                      <input
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={(e) => {
                          const arquivo = e.target.files[0];
                          if (arquivo) {
                            setArquivoPlanilha(arquivo);
                            processarPlanilha(arquivo);
                          }
                        }}
                        className="form-input"
                      />
                    </div>
                    
                    <div className="alert warning">
                      <AlertCircle size={24} />
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Formato da Planilha</h3>
                        <p style={{ margin: '0 0 0.5rem 0' }}>A planilha deve conter as seguintes colunas:</p>
                        <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                          <li><strong>Valor vendido mes</strong> - Valor total vendido no mês</li>
                          <li><strong>Valor faturado mes</strong> - Valor total faturado no mês</li>
                          <li><strong>Mes</strong> - Número do mês (0-11, onde 0=Janeiro)</li>
                          <li><strong>Ano</strong> - Ano de referência</li>
                        </ul>
                        <p style={{ margin: '0.5rem 0 0 0' }}>A comissão será calculada automaticamente (2% do valor faturado).</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="alert success">
                      <CheckCircle size={24} />
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: '600' }}>Dados Carregados</h3>
                        <p style={{ margin: '0' }}>Foram encontrados {dadosImportacao.length} registro(s) para importação.</p>
                      </div>
                    </div>
                    
                    <div className="preview-container">
                      <h4>Preview dos Dados:</h4>
                      <div className="preview-table">
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Período</th>
                              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Valor Vendido</th>
                              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Valor Faturado</th>
                              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600' }}>Comissão</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dadosImportacao.slice(0, 10).map((item, index) => (
                              <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{item.mesNome}</td>
                                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{formatarMoeda(item.valorVendidoMes)}</td>
                                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{formatarMoeda(item.valorFaturadoMes)}</td>
                                <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{formatarMoeda(item.comissao)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {dadosImportacao.length > 10 && (
                          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--secondary-text)' }}>
                            ... e mais {dadosImportacao.length - 10} registro(s)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button
                    onClick={() => {
                      setShowImportarPlanilhaModal(false);
                      setPreviewImportacao(false);
                      setDadosImportacao([]);
                      setArquivoPlanilha(null);
                    }}
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                  {previewImportacao && (
                    <button
                      onClick={confirmarImportacao}
                      disabled={loading}
                      className="btn-save"
                    >
                      {loading ? (
                        <>
                          <RefreshCw size={16} className="spin" />
                          Importando...
                        </>
                      ) : (
                        <>
                          <Upload size={16} />
                          Confirmar Importação
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default VendasPage;