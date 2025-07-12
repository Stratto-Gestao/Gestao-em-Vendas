import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Package, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (error) {
      console.error('Erro no login:', error);
      setError('Email ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        
        {/* Card principal com glassmorphism */}
        <div className="glass-card">
          
          {/* Conteúdo */}
          <div className="login-content">
            
            {/* Logo e título */}
            <div className="login-header">
              <div className="glass-icon">
                <Package className="icon" />
              </div>
              
              <h1 className="login-title">
                Bem-vindo
              </h1>
              
              <p className="login-subtitle">
                Plataforma Embalagens Conceito
              </p>
            </div>

            {/* Alert de erro */}
            {error && (
              <div className="error-alert">
                <AlertCircle className="error-icon" />
                <span className="error-text">{error}</span>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="login-form">
              
              {/* Campo Email */}
              <div className="form-group">
                <label className="form-label">
                  Email
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="form-group">
                <label className="form-label">
                  Senha
                </label>
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="password-toggle"
                  >
                    {showPassword ? (
                      <EyeOff className="toggle-icon" />
                    ) : (
                      <Eye className="toggle-icon" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão de login */}
              <button
                type="submit"
                disabled={loading}
                className="glass-button"
              >
                {loading ? (
                  <div className="loading-content">
                    <div className="loading-spinner"></div>
                    Entrando...
                  </div>
                ) : (
                  'Entrar'
                )}
              </button>
              
            </form>

            {/* Footer */}
            <div className="login-footer">
              <p className="footer-text">
                Desenvolvido com ❤️ para a equipe de vendas
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;