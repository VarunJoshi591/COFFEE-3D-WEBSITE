'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  FileText,
  Cookie,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  X,
  Mail,
  Coffee,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Globe,
  Sliders,
  Send,
  HelpCircle
} from 'lucide-react';

interface PolicyTab {
  id: 'privacy' | 'terms' | 'cookies' | 'rights';
  label: string;
  icon: React.ReactNode;
}

export default function Footer() {
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies' | 'rights'>('privacy');
  
  // Newsletter state
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Cookie settings state
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [marketingCookies, setMarketingCookies] = useState(false);
  const [cookieSaved, setCookieSaved] = useState(false);

  // Rights form state
  const [rightsEmail, setRightsEmail] = useState('');
  const [rightsType, setRightsType] = useState<'export' | 'delete'>('export');
  const [rightsSubmitted, setRightsSubmitted] = useState(false);

  const policyPillars = [
    {
      id: 1,
      icon: <ShieldCheck className="w-6 h-6 text-coffee-accent" />,
      title: 'Transparent Data Collection',
      summary: 'Only the essential ingredients. We only capture data required for your bespoke orders and taste preferences.',
      details: 'We strictly collect order credentials, delivery coordinates, and brew profile configurations to optimize your personalized coffee experience. We will never collect unrelated telemetry or background activity.',
    },
    {
      id: 2,
      icon: <Lock className="w-6 h-6 text-coffee-accent" />,
      title: 'Zero Data Broker Sharing',
      summary: 'Your taste is your business. We never sell, rent, or monetize your personal information to third parties.',
      details: 'Your data stays within our secure ecosystem. We partner only with vetted logistics and payment processors (such as Stripe) solely to fulfill your orders under strict non-disclosure agreements.',
    },
    {
      id: 3,
      icon: <Cookie className="w-6 h-6 text-coffee-accent" />,
      title: 'Respectful Cookie Policies',
      summary: 'Smart session memory without intrusive surveillance. Full control over local storage and preferences.',
      details: 'We utilize lightweight cookies and local session storage to remember your time-of-day theme preferences, ambient café sound volume, and cart items. You have full liberty to tune or disable non-essential cookies at any time.',
    },
    {
      id: 4,
      icon: <Globe className="w-6 h-6 text-coffee-accent" />,
      title: 'GDPR & CCPA Compliant Rights',
      summary: 'Full control and sovereignty over your identity. 1-click access, export, or permanent data erasure.',
      details: 'Under global data protection standards (GDPR, CCPA, APPI), you are entitled to request an immediate export of your saved data or demand permanent deletion of your profile with zero friction.',
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 5000);
      setEmail('');
    }
  };

  const handleSaveCookies = () => {
    setCookieSaved(true);
    setTimeout(() => setCookieSaved(false), 3000);
  };

  const handleRightsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rightsEmail && rightsEmail.includes('@')) {
      setRightsSubmitted(true);
      setTimeout(() => {
        setRightsSubmitted(false);
        setRightsEmail('');
      }, 4000);
    }
  };

  const openPolicyModal = (tab: 'privacy' | 'terms' | 'cookies' | 'rights') => {
    setActiveTab(tab);
    setIsModalOpen(true);
  };

  const tabs: PolicyTab[] = [
    { id: 'privacy', label: 'Privacy Policy', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'terms', label: 'Terms of Service', icon: <FileText className="w-4 h-4" /> },
    { id: 'cookies', label: 'Cookie Preferences', icon: <Cookie className="w-4 h-4" /> },
    { id: 'rights', label: 'Data Rights Request', icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <footer className="relative bg-[#120A06] border-t border-coffee-border/40 text-coffee-text-secondary font-inter overflow-hidden">
      {/* Background Subtle Ambience */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-coffee-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-coffee-primary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ========================================================================= */}
      {/* PRIVACY & POLICY SHOWCASE SECTION                                        */}
      {/* ========================================================================= */}
      <section id="privacy-policy" className="pt-16 sm:pt-20 pb-12 sm:pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coffee-accent/10 border border-coffee-accent/25 text-coffee-accent text-xs font-bold tracking-widest uppercase mb-4"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Trust & Data Protection</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-playfair font-bold text-coffee-text-primary mb-4"
          >
            Privacy & <span className="text-coffee-accent italic font-normal">Policy</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-coffee-text-secondary leading-relaxed"
          >
            At BREWHAUS, our dedication to ethically sourced beans extends equally to the ethical treatment of your data. We honor your digital privacy with full transparency and zero compromise.
          </motion.p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-12">
          {policyPillars.map((pillar, idx) => {
            const isOpen = activeAccordion === idx;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`group rounded-2xl border transition-all duration-300 backdrop-blur-md overflow-hidden ${
                  isOpen
                    ? 'bg-coffee-secondary/80 border-coffee-accent/50 shadow-xl shadow-coffee-accent/5'
                    : 'bg-coffee-secondary/40 border-coffee-border/40 hover:border-coffee-border/80 hover:bg-coffee-secondary/60'
                }`}
              >
                <div
                  onClick={() => setActiveAccordion(isOpen ? null : idx)}
                  className="p-5 sm:p-6 cursor-pointer flex items-start justify-between gap-4 select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-coffee-espresso/80 border border-coffee-border/50 group-hover:scale-105 group-hover:border-coffee-accent/40 transition-transform duration-300 shrink-0">
                      {pillar.icon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-coffee-text-primary group-hover:text-coffee-accent transition-colors font-playfair">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-coffee-text-secondary mt-1 leading-relaxed">
                        {pillar.summary}
                      </p>
                    </div>
                  </div>
                  <button
                    aria-label="Toggle details"
                    className="p-1 rounded-full text-coffee-text-secondary hover:text-coffee-text-primary transition-colors shrink-0 mt-1"
                  >
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-coffee-text-secondary/90 border-t border-coffee-border/30 leading-relaxed">
                        {pillar.details}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Action Bar for Legal Modal */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-coffee-secondary/30 border border-coffee-border/40 backdrop-blur-md">
          <span className="text-xs sm:text-sm text-coffee-text-secondary font-medium">
            Need comprehensive legal agreements or specific disclosures?
          </span>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => openPolicyModal('privacy')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-coffee-accent text-coffee-espresso hover:brightness-110 active:scale-95 transition-all shadow-md shadow-coffee-accent/20 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Privacy Policy</span>
            </button>
            <button
              onClick={() => openPolicyModal('terms')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-coffee-espresso border border-coffee-border hover:border-coffee-accent text-coffee-text-primary active:scale-95 transition-all"
            >
              Terms of Service
            </button>
            <button
              onClick={() => openPolicyModal('cookies')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-full bg-coffee-espresso border border-coffee-border hover:border-coffee-accent text-coffee-text-primary active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Cookie className="w-3.5 h-3.5 text-coffee-accent" />
              <span>Cookie Preferences</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN FOOTER NAVIGATION & NEWSLETTER                                      */}
      {/* ========================================================================= */}
      <div className="border-t border-coffee-border/30 pt-12 sm:pt-16 pb-8 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-coffee-accent to-coffee-border flex items-center justify-center shadow-lg">
                <Coffee className="w-5 h-5 text-coffee-text-primary" />
              </div>
              <span className="text-xl font-extrabold font-inter tracking-[0.16em] text-transparent bg-clip-text bg-gradient-to-r from-coffee-text-primary via-[#F5E6D3] to-[#D4A574]">
                BREWHAUS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-coffee-text-secondary leading-relaxed max-w-sm">
              Artisanal single-origin coffee roasted in micro-batches with mindful sourcing and immersive sensory craftsmanship.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-coffee-secondary/50 border border-coffee-border/40 text-[11px] text-coffee-text-secondary font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                256-Bit SSL Encrypted
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-coffee-secondary/50 border border-coffee-border/40 text-[11px] text-coffee-text-secondary font-medium">
                <CheckCircle2 className="w-3 h-3 text-coffee-accent" />
                GDPR & CCPA
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-coffee-accent">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#hero" className="hover:text-coffee-accent transition-colors">
                  Experience
                </a>
              </li>
              <li>
                <a href="#blends" className="hover:text-coffee-accent transition-colors">
                  The Blends
                </a>
              </li>
              <li>
                <a href="#brewing" className="hover:text-coffee-accent transition-colors">
                  Brewing Guide
                </a>
              </li>
              <li>
                <a href="#sourcing" className="hover:text-coffee-accent transition-colors">
                  Why Brewhaus
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Policy Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-coffee-accent">
              Legal & Safety
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => openPolicyModal('privacy')}
                  className="hover:text-coffee-accent transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('terms')}
                  className="hover:text-coffee-accent transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('cookies')}
                  className="hover:text-coffee-accent transition-colors text-left"
                >
                  Cookie Settings
                </button>
              </li>
              <li>
                <button
                  onClick={() => openPolicyModal('rights')}
                  className="hover:text-coffee-accent transition-colors text-left"
                >
                  Data Rights
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-coffee-accent">
              The Roaster&apos;s Dispatch
            </h4>
            <p className="text-xs sm:text-sm text-coffee-text-secondary leading-relaxed">
              Subscribe for exclusive seasonal drops, cupping invitations, and brewing masterclasses.
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <div className="flex items-center rounded-full bg-coffee-espresso border border-coffee-border/70 focus-within:border-coffee-accent p-1 transition-all">
                <Mail className="w-4 h-4 ml-3 text-coffee-text-secondary shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-coffee-text-primary placeholder:text-coffee-text-secondary/50 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full bg-coffee-accent text-coffee-espresso font-bold text-xs hover:brightness-110 transition-all shrink-0 flex items-center gap-1 shadow-md"
                >
                  <span>Join</span>
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </form>
            <AnimatePresence>
              {isSubscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-coffee-accent font-medium flex items-center gap-1.5 pt-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Welcome to the circle! Check your inbox soon.</span>
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="border-t border-coffee-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-coffee-text-secondary/70">
          <p>© 2026 BREWHAUS Coffee Roasters. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => openPolicyModal('privacy')}
              className="hover:text-coffee-accent transition-colors"
            >
              Privacy
            </button>
            <button
              onClick={() => openPolicyModal('terms')}
              className="hover:text-coffee-accent transition-colors"
            >
              Terms
            </button>
            <button
              onClick={() => openPolicyModal('cookies')}
              className="hover:text-coffee-accent transition-colors"
            >
              Cookies
            </button>
            <a
              href="#hero"
              className="hover:text-coffee-accent transition-colors flex items-center gap-1 text-coffee-accent font-semibold"
            >
              <span>Back to Top</span>
              <span>↑</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INTERACTIVE LEGAL & POLICY MODAL                                         */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-3xl max-h-[90vh] bg-coffee-espresso border border-coffee-border rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-coffee-border/40 bg-coffee-secondary/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-coffee-accent/20 border border-coffee-accent/40 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-coffee-accent" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold font-playfair text-coffee-text-primary">
                      BREWHAUS Legal & Trust Center
                    </h3>
                    <p className="text-xs text-coffee-text-secondary">
                      Last Updated: August 2026 • Effective Worldwide
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-coffee-text-secondary hover:text-coffee-text-primary hover:bg-coffee-secondary/80 transition-colors"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-coffee-border/30 bg-coffee-secondary/20 px-4 sm:px-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 py-3 px-4 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-coffee-accent text-coffee-accent'
                        : 'border-transparent text-coffee-text-secondary hover:text-coffee-text-primary'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Modal Body Content */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs sm:text-sm text-coffee-text-secondary/90 leading-relaxed custom-scroll">
                {/* 1. PRIVACY POLICY TAB */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-coffee-text-primary font-playfair mb-2">
                        1. Our Privacy Commitment
                      </h4>
                      <p>
                        At BREWHAUS Coffee Co., we are dedicated to protecting the personal information of our coffee aficionados. This Privacy Policy details how we collect, store, utilize, and protect your personal information when you visit our website, place orders for roasted beans, or use our digital services.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-coffee-text-primary font-playfair mb-2">
                        2. Information We Collect
                      </h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>
                          <strong className="text-coffee-text-primary">Order & Account Details:</strong> Name, shipping address, email, phone number, and transaction references for order fulfillment.
                        </li>
                        <li>
                          <strong className="text-coffee-text-primary">Sensory & Brew Preferences:</strong> Custom grind sizes, roast preferences, and coffee quiz results configured through our interactive brewing tools.
                        </li>
                        <li>
                          <strong className="text-coffee-text-primary">Technical Telemetry:</strong> Anonymized browser type, device resolution, and session timestamps used solely to render optimized 3D canvas animations and fluid transitions.
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-coffee-text-primary font-playfair mb-2">
                        3. How We Safeguard Your Information
                      </h4>
                      <p>
                        All communication between your client browser and our infrastructure is secured using enterprise-grade Transport Layer Security (TLS 1.3) with 256-bit encryption. Payment processing is completely tokenized through PCI-DSS Level 1 compliant vendors; we never store raw credit card numbers.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-coffee-text-primary font-playfair mb-2">
                        4. Sharing & Disclosure Policy
                      </h4>
                      <p>
                        We do not sell, lease, or monetize customer records to marketing aggregators. We only share required delivery coordinates with accredited courier services (e.g., DHL, FedEx, UPS) exclusively for delivery fulfillment.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-coffee-text-primary font-playfair mb-2">
                        5. Data Retention & Privacy Officer
                      </h4>
                      <p>
                        We retain your purchase records only for statutory accounting durations. For questions or formal inquiries, contact our Data Protection Officer at{' '}
                        <span className="text-coffee-accent font-semibold">privacy@brewhaus.coffee</span>.
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. TERMS OF SERVICE TAB */}
                {activeTab === 'terms' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-coffee-text-primary font-playfair mb-2">
                        1. Artisan Roast Guarantee
                      </h4>
                      <p>
                        All specialty coffee is roasted to order and packaged with one-way degassing valves to ensure peak freshness upon arrival. If your package arrives damaged or defective, notify us within 14 days for a replacement or store credit.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-coffee-text-primary font-playfair mb-2">
                        2. Website Usage & Intellectual Property
                      </h4>
                      <p>
                        All 3D interactive coffee models, animations, sound engineering assets, and proprietary brewing calculators are intellectual property of BREWHAUS Coffee Co. Unauthorized duplication or commercial scraping is prohibited.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-base sm:text-lg font-bold text-coffee-text-primary font-playfair mb-2">
                        3. Pricing & Currency
                      </h4>
                      <p>
                        All prices are displayed in USD unless localized otherwise. We reserve the right to adjust seasonal pricing in response to green bean harvest yield fluctuations and global fair-trade adjustments.
                      </p>
                    </div>
                  </div>
                )}

                {/* 3. COOKIE PREFERENCES TAB */}
                {activeTab === 'cookies' && (
                  <div className="space-y-6">
                    <p>
                      Configure how BREWHAUS manages cookies and local browser storage. Essential cookies cannot be turned off as they are necessary for website stability and the 3D rendering pipeline.
                    </p>

                    <div className="space-y-4">
                      {/* Essential */}
                      <div className="p-4 rounded-xl bg-coffee-secondary/40 border border-coffee-border/50 flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-coffee-text-primary">Essential Cookies</span>
                            <span className="text-[10px] font-bold uppercase bg-coffee-accent/20 text-coffee-accent px-2 py-0.5 rounded-full">
                              Required
                            </span>
                          </div>
                          <p className="text-xs text-coffee-text-secondary mt-1">
                            Needed for 3D canvas render state, audio toggle memory, cart count, and time-of-day dynamic themes.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="w-5 h-5 accent-coffee-accent cursor-not-allowed opacity-80"
                        />
                      </div>

                      {/* Analytics */}
                      <div className="p-4 rounded-xl bg-coffee-secondary/40 border border-coffee-border/50 flex items-start justify-between gap-4">
                        <div>
                          <span className="font-bold text-coffee-text-primary">Performance & Analytics</span>
                          <p className="text-xs text-coffee-text-secondary mt-1">
                            Helps us measure site speed, FPS rendering smoothness, and which brewing guides are most helpful.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={analyticsCookies}
                          onChange={(e) => setAnalyticsCookies(e.target.checked)}
                          className="w-5 h-5 accent-coffee-accent cursor-pointer"
                        />
                      </div>

                      {/* Marketing */}
                      <div className="p-4 rounded-xl bg-coffee-secondary/40 border border-coffee-border/50 flex items-start justify-between gap-4">
                        <div>
                          <span className="font-bold text-coffee-text-primary">Personalized Recommendations</span>
                          <p className="text-xs text-coffee-text-secondary mt-1">
                            Tailors flavor notes and roast profiles according to your past brew choices.
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={marketingCookies}
                          onChange={(e) => setMarketingCookies(e.target.checked)}
                          className="w-5 h-5 accent-coffee-accent cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={handleSaveCookies}
                        className="px-6 py-2.5 rounded-full bg-coffee-accent text-coffee-espresso font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-coffee-accent/20"
                      >
                        Save Preferences
                      </button>

                      <AnimatePresence>
                        {cookieSaved && (
                          <motion.span
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-xs font-semibold text-coffee-accent flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Preferences saved successfully!</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {/* 4. DATA RIGHTS TAB */}
                {activeTab === 'rights' && (
                  <div className="space-y-6">
                    <p>
                      In accordance with GDPR (Articles 15 & 17) and CCPA regulations, you can submit an official request to export or delete all personal data associated with your email address.
                    </p>

                    <form onSubmit={handleRightsSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-coffee-text-primary uppercase tracking-wider mb-2">
                          Select Request Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setRightsType('export')}
                            className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                              rightsType === 'export'
                                ? 'bg-coffee-accent/20 border-coffee-accent text-coffee-accent'
                                : 'bg-coffee-secondary/40 border-coffee-border/50 text-coffee-text-secondary'
                            }`}
                          >
                            Export My Data (JSON)
                          </button>
                          <button
                            type="button"
                            onClick={() => setRightsType('delete')}
                            className={`p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                              rightsType === 'delete'
                                ? 'bg-red-500/20 border-red-400 text-red-300'
                                : 'bg-coffee-secondary/40 border-coffee-border/50 text-coffee-text-secondary'
                            }`}
                          >
                            Permanent Account Deletion
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-coffee-text-primary uppercase tracking-wider mb-2">
                          Your Email Address
                        </label>
                        <input
                          type="email"
                          value={rightsEmail}
                          onChange={(e) => setRightsEmail(e.target.value)}
                          placeholder="barista@example.com"
                          required
                          className="w-full rounded-xl bg-coffee-secondary/60 border border-coffee-border/70 px-4 py-2.5 text-xs sm:text-sm text-coffee-text-primary focus:outline-none focus:border-coffee-accent"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-full bg-coffee-accent text-coffee-espresso font-bold text-xs sm:text-sm hover:brightness-110 active:scale-95 transition-all shadow-lg"
                      >
                        Submit Privacy Request
                      </button>

                      <AnimatePresence>
                        {rightsSubmitted && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="p-3 rounded-xl bg-coffee-accent/15 border border-coffee-accent/30 text-coffee-accent text-xs flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>
                              Request received. A verification email has been dispatched to {rightsEmail}.
                            </span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-coffee-border/40 bg-coffee-secondary/30 flex items-center justify-between">
                <div className="text-[11px] text-coffee-text-secondary/70 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-coffee-accent" />
                  <span>Verified ISO/IEC 27001 Security Standards</span>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-1.5 rounded-full bg-coffee-secondary hover:bg-coffee-border/60 text-coffee-text-primary text-xs font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
