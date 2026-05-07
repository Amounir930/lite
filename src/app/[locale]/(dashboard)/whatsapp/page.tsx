"use client";

import { useState, useEffect } from "react";
import { Zap, QrCode, Wifi, WifiOff, Loader2, RefreshCw, LogOut, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

export default function WhatsAppPage() {
  const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const instanceName = "WhatSaaS_Main"; // 🔍 Default instance for now

  const fetchStatus = async () => {
    // 🛡️ Logic to fetch status from Evolution API
    // This is a placeholder for now to show the UI
  };

  const connectInstance = async () => {
    setLoading(true);
    setStatus("connecting");
    // 🚀 Logic to call EvolutionService.createInstance
    // For demo purposes, we'll simulate a QR code after 2 seconds
    setTimeout(() => {
      setQrCode("https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=EvolutionAPI_Demo_QR");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 text-start">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold text-text-main flex items-center gap-4">
            <Zap className="text-primary" size={36} />
            ربط الواتساب (Evolution API)
          </h2>
          <p className="text-text-muted mt-2 text-lg">اربط حسابك الآن لبدء استقبال وإرسال الرسائل لحظياً.</p>
        </div>
        
        <div className={cn(
          "flex items-center gap-3 px-6 py-3 rounded-2xl border font-bold text-sm transition-all",
          status === "connected" ? "bg-green-500/10 border-green-500/20 text-green-500" :
          status === "connecting" ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
          "bg-red-500/10 border-red-500/20 text-red-500"
        )}>
          {status === "connected" ? <Wifi size={18} /> : status === "connecting" ? <RefreshCw size={18} className="animate-spin" /> : <WifiOff size={18} />}
          {status === "connected" ? "متصل الآن" : status === "connecting" ? "جاري الاتصال..." : "غير متصل"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 📱 Connection Card */}
        <div className="lg:col-span-2 soft-card p-10 flex flex-col items-center justify-center text-center gap-8 min-h-[500px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          {status === "disconnected" && !qrCode && (
            <div className="max-w-md space-y-6 animate-in zoom-in-95 duration-500">
              <div className="size-24 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-primary mx-auto border border-primary/10 shadow-xl shadow-primary/5">
                <QrCode size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-main">ابدأ عملية الربط</h3>
                <p className="text-text-muted mt-3 text-sm leading-relaxed">
                  سنقوم بإنشاء نسخة جديدة لك على Evolution API. ستحتاج لمسح الـ QR Code باستخدام تطبيق واتساب على هاتفك (الأجهزة المرتبطة).
                </p>
              </div>
              <button 
                onClick={connectInstance}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-5 font-bold text-white shadow-2xl shadow-primary/20 hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Zap size={24} />}
                <span>إنشاء نسخة وجلب QR Code</span>
              </button>
            </div>
          )}

          {qrCode && status !== "connected" && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white p-6 rounded-[2.5rem] shadow-2xl">
                  <img src={qrCode} alt="WhatsApp QR Code" className="size-64" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-bold text-text-main flex items-center justify-center gap-2">
                  <RefreshCw size={18} className="animate-spin text-primary" />
                  بانتظار مسح الرمز...
                </p>
                <p className="text-sm text-text-muted">افتح واتساب {">"} الأجهزة المرتبطة {">"} ربط جهاز</p>
              </div>
            </div>
          )}

          {status === "connected" && (
            <div className="space-y-6 animate-in scale-in-95 duration-500">
              <div className="size-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto border border-green-500/20 shadow-xl shadow-green-500/10">
                <CheckCircle2 size={48} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-text-main">تم الاتصال بنجاح!</h3>
                <p className="text-text-muted mt-2">حسابك الآن نشط وجاهز لاستقبال الرسائل.</p>
              </div>
              <button 
                className="flex items-center justify-center gap-3 mx-auto px-8 py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500 hover:text-white transition-all"
              >
                <LogOut size={20} />
                قطع الاتصال
              </button>
            </div>
          )}
        </div>

        {/* ℹ️ Instructions & Info */}
        <div className="space-y-8">
          <div className="soft-card p-8 space-y-6 bg-primary/5 border-primary/10">
            <h4 className="text-sm font-bold text-primary uppercase tracking-widest">تلميحات الربط</h4>
            <ul className="space-y-4">
              {[
                "تأكد من شحن هاتفك واتصاله بالإنترنت.",
                "لا تغلق هذه الصفحة حتى يكتمل الربط.",
                "يمكنك ربط أكثر من جهاز في النسخة الكاملة.",
                "الربط يتم عبر بروتوكول Evolution الآمن."
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-text-muted leading-relaxed">
                  <div className="size-1.5 rounded-full bg-primary mt-1 shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </div>

          <div className="soft-card p-8 space-y-4">
            <h4 className="text-sm font-bold text-text-main uppercase tracking-widest">معلومات النسخة</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">اسم النسخة:</span>
                <span className="font-mono font-bold text-primary">{instanceName}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted">المزود:</span>
                <span className="font-bold text-text-main">Evolution API v2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
