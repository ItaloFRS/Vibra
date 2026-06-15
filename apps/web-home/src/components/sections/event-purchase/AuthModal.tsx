"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

const registerSchema = z.object({
  nome: z.string().min(3, "Nome muito curto"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
});

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal = ({ isOpen, onClose, onSuccess }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "register">("login");

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors, isSubmitting: isSubmittingLogin },
    reset: resetLogin,
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: registerForm,
    handleSubmit: handleSubmitRegister,
    formState: { errors: registerErrors, isSubmitting: isSubmittingRegister },
    reset: resetRegister,
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmitLogin = (data: LoginData) => {
    console.log("Login:", data);
    // Simular delay
    setTimeout(() => {
      onSuccess();
      resetLogin();
    }, 1000);
  };

  const onSubmitRegister = (data: RegisterData) => {
    console.log("Register:", data);
    // Simular delay
    setTimeout(() => {
      onSuccess();
      resetRegister();
    }, 1000);
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    resetLogin();
    resetRegister();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-md h-fit max-h-[90vh] overflow-y-auto bg-black/80 backdrop-blur-3xl border border-white/10 z-[201] rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Border Glow Effect */}
            <div className="absolute inset-0 border border-primary/20 rounded-[2.5rem] pointer-events-none" />
            <div className="absolute inset-0 border border-white/5 rounded-[2.5rem] pointer-events-none" />

            <div className="relative px-10 py-8">

              <div className="text-center mb-5">
                <div className="flex justify-center mb-3">
                  <Image 
                    src="/Logo_Vibra-Cromo.png" 
                    alt="Vibra Logo" 
                    width={110} 
                    height={40} 
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2">
                  {mode === "login" ? "Bem-vindo de Volta" : "Crie sua Conta"}
                </h2>
                <p className="text-stone-500 text-[10px] font-bold uppercase tracking-widest">
                  {mode === "login" ? "Acesse para finalizar sua compra" : "Cadastre-se para vibrar com a gente"}
                </p>
              </div>

              <div className="space-y-3">
                {/* Social Login */}
                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  <GithubIcon className="w-3.5 h-3.5" />
                  Continuar com GitHub
                </button>
                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-white text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                  <GoogleIcon className="w-3.5 h-3.5" />
                  Continuar com Google
                </button>

                <div className="py-3 flex items-center gap-4">
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-[9px] font-bold text-stone-600 uppercase tracking-widest">Ou use seu e-mail</span>
                  <div className="flex-1 h-px bg-white/10" />
                </div>

                {/* Forms */}
                <form 
                  onSubmit={mode === "login" ? handleSubmitLogin(onSubmitLogin) : handleSubmitRegister(onSubmitRegister)}
                  className="space-y-3"
                >
                  {mode === "register" && (
                    <div className="space-y-1.5">
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-primary transition-colors" />
                        <input 
                          {...registerForm("nome")}
                          type="text" 
                          placeholder="Nome Completo" 
                          className={`w-full bg-white/5 border ${registerErrors.nome ? "border-red-500/50" : "border-white/10"} rounded-xl py-3 pl-12 pr-4 text-white text-xs outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-stone-700 font-medium`}
                        />
                      </div>
                      {registerErrors.nome && (
                        <span className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 uppercase tracking-widest ml-1">
                          <AlertCircle className="w-3 h-3" />
                          {registerErrors.nome.message}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-primary transition-colors" />
                      <input 
                        {...(mode === "login" ? registerLogin("email") : registerForm("email"))}
                        type="email" 
                        placeholder="E-mail" 
                        className={`w-full bg-white/5 border ${(mode === "login" ? loginErrors.email : registerErrors.email) ? "border-red-500/50" : "border-white/10"} rounded-xl py-3 pl-12 pr-4 text-white text-xs outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-stone-700 font-medium`}
                      />
                    </div>
                    {(mode === "login" ? loginErrors.email : registerErrors.email) && (
                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 uppercase tracking-widest ml-1">
                        <AlertCircle className="w-3 h-3" />
                        {(mode === "login" ? loginErrors.email : registerErrors.email)?.message}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-600 group-focus-within:text-primary transition-colors" />
                      <input 
                        {...(mode === "login" ? registerLogin("password") : registerForm("password"))}
                        type="password" 
                        placeholder="Senha" 
                        className={`w-full bg-white/5 border ${(mode === "login" ? loginErrors.password : registerErrors.password) ? "border-red-500/50" : "border-white/10"} rounded-xl py-3 pl-12 pr-4 text-white text-xs outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-stone-700 font-medium`}
                      />
                    </div>
                    {(mode === "login" ? loginErrors.password : registerErrors.password) && (
                      <span className="flex items-center gap-1.5 text-[9px] font-bold text-red-500 uppercase tracking-widest ml-1">
                        <AlertCircle className="w-3 h-3" />
                        {(mode === "login" ? loginErrors.password : registerErrors.password)?.message}
                      </span>
                    )}
                  </div>

                  <button 
                    type="submit"
                    disabled={mode === "login" ? isSubmittingLogin : isSubmittingRegister}
                    className="w-full py-4 bg-white/10 text-white rounded-full font-black text-[10px] tracking-[0.2em] uppercase hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-3 mt-6 group disabled:opacity-50"
                  >
                    {mode === "login" ? "Entrar" : "Criar Conta"}
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                <div className="text-center mt-6">
                  <button 
                    onClick={toggleMode}
                    className="text-[9px] font-bold text-stone-500 hover:text-white uppercase tracking-widest transition-colors"
                  >
                    {mode === "login" ? "Ainda não tem conta? Cadastre-se" : "Já tem uma conta? Faça Login"}
                  </button>
                </div>
              </div>
            </div>

            {/* Decorative texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Icons components
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.041-1.416-4.041-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 3.071 1.305 3.819.997.108-.775.44-1.305.805-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.22 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
