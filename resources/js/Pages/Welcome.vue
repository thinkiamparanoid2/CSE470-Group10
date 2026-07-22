<script setup>
import { Head, Link } from '@inertiajs/vue3';
import BrandLogos from '@/Components/BrandLogos.vue';

defineProps({
    canLogin: {
        type: Boolean,
    },
    canRegister: {
        type: Boolean,
    },
});

const handleHeroImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1200&auto=format&fit=crop';
};
</script>

<template>
    <Head title="SmartConstruct - High-End Infrastructure ERP" />
    <div class="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased selection:bg-blue-500/20 selection:text-blue-900 relative overflow-hidden">
        
        <!-- Premium Navbar Header -->
        <header class="relative border-b border-slate-200/80 bg-white/90 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-300 shadow-sm">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 h-24 flex items-center justify-between">
                <!-- Brand logo -->
                <Link href="/" class="flex items-center gap-3 group py-1">
                    <BrandLogos name="smartconstruct" className="h-16 sm:h-18 lg:h-20" />
                </Link>

                <!-- Navigation Links (Desktop) -->
                <div class="hidden md:flex items-center gap-8 text-xs font-extrabold text-slate-600 tracking-wide uppercase">
                    <a href="#features" class="hover:text-blue-600 transition-colors">Features</a>
                    <a href="#partners" class="hover:text-blue-600 transition-colors">Manufacturers</a>
                    <a href="#preview" class="hover:text-blue-600 transition-colors">Operations</a>
                </div>
                
                <nav v-if="canLogin" class="flex items-center gap-4 sm:gap-5">
                    <Link
                        v-if="$page.props.auth.user"
                        :href="route('dashboard')"
                        class="px-6 py-3 rounded-xl text-xs font-extrabold tracking-wide bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:scale-105"
                    >
                        Access Console &rarr;
                    </Link>

                    <template v-else>
                        <Link
                            :href="route('login')"
                            class="text-xs font-bold tracking-wide text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            Sign In
                        </Link>

                        <Link
                            v-if="canRegister"
                            class="px-6 py-3 rounded-xl text-xs font-extrabold tracking-wide bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:scale-105"
                            :href="route('register')"
                        >
                            Register Account
                        </Link>
                    </template>
                </nav>
            </div>
        </header>

        <!-- A. Hero Section -->
        <section class="relative pt-12 sm:pt-16 pb-20 sm:pb-28 bg-white border-b border-slate-200/80">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    
                    <!-- Left Hero Content (Expanded 7 Columns) -->
                    <div class="lg:col-span-7 space-y-7 text-center lg:text-left">
                        <div class="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200">
                            <span class="flex h-2 w-2 rounded-full bg-blue-600 relative">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-75"></span>
                            </span>
                            <span class="text-[11px] font-extrabold tracking-[0.2em] text-blue-700 uppercase">Enterprise Infrastructure ERP v2.0</span>
                        </div>
                        
                        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08]">
                            Precision control for <span class="text-blue-600">mega projects.</span>
                        </h1>
                        
                        <p class="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                            Connect site material inventories (BSRM steel, Seven Rings cement), verified vendor networks, and project milestone timelines into one unified command center console.
                        </p>
                        
                        <div class="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                            <Link
                                v-if="!$page.props.auth.user"
                                :href="route('login')"
                                class="px-8 py-4 rounded-2xl text-xs font-extrabold tracking-wide bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-600/20 hover:scale-105"
                            >
                                Launch Console &rarr;
                            </Link>
                            <Link
                                v-else
                                :href="route('dashboard')"
                                class="px-8 py-4 rounded-2xl text-xs font-extrabold tracking-wide bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-lg shadow-blue-600/20 hover:scale-105"
                            >
                                Enter Dashboard &rarr;
                            </Link>
                            <a
                                href="#features"
                                class="px-8 py-4 rounded-2xl text-xs font-bold tracking-wide bg-slate-100 text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-200 transition-all"
                            >
                                Explore Features
                            </a>
                        </div>

                        <!-- Mini Stats Grid -->
                        <div class="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200">
                            <div>
                                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900">৳ 50M+</div>
                                <div class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Stock Tracked</div>
                            </div>
                            <div>
                                <div class="text-2xl sm:text-3xl font-extrabold text-blue-600">100%</div>
                                <div class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">RBAC Guarded</div>
                            </div>
                            <div>
                                <div class="text-2xl sm:text-3xl font-extrabold text-emerald-600">24/7</div>
                                <div class="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Site Sync</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Hero Showcase Visual Card (Compact 5 Columns) -->
                    <div class="lg:col-span-5 relative">
                        <div class="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl max-h-[340px] aspect-[16/10] group bg-slate-900">
                            <!-- Real Construction High-Rise Site Photo -->
                            <img 
                                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" 
                                alt="Metro Infrastructure High-Rise Site" 
                                @error="handleHeroImageError"
                                class="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out opacity-90" 
                            />
                            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-slate-900/10"></div>
                            
                            <!-- Top Left Telemetry Pill -->
                            <div class="absolute top-4 left-4 inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-[9px] font-extrabold uppercase tracking-wider">
                                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                Site Telemetry Active
                            </div>

                            <!-- Top Right Real-Time Material Badge -->
                            <div class="absolute top-4 right-4 hidden sm:inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-600/90 backdrop-blur-md text-white text-[9px] font-extrabold uppercase tracking-wider border border-blue-400/30">
                                <span>🏗️ BSRM STEEL • 14 TONS</span>
                            </div>

                            <!-- Floating UI Card Overlay -->
                            <div class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-xl p-3.5 shadow-xl">
                                <div class="flex items-center justify-between gap-3">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                                            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                        </div>
                                        <div>
                                            <div class="text-slate-900 font-extrabold text-xs tracking-tight">Site Phase #02 In Progress</div>
                                            <div class="text-slate-500 text-[11px] mt-0.5 font-medium">Basement Mat Raft Foundation Casting</div>
                                        </div>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0 tracking-wider">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- B. Official Manufacturers Brand Logo Banner -->
        <section id="partners" class="border-b border-slate-200 bg-slate-50 py-16">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 space-y-8">
                <p class="text-center text-[11px] font-extrabold text-slate-400 uppercase tracking-[0.25em]">Integrated with Verified Material Manufacturers & Official Brand Partners</p>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm">
                    <BrandLogos name="bsrm" className="h-10" />
                    <BrandLogos name="lafarge" className="h-9" />
                    <BrandLogos name="sevenrings" className="h-10" />
                    <BrandLogos name="mir" className="h-10" />
                    <BrandLogos name="berger" className="h-9" />
                    <BrandLogos name="cat" className="h-9" />
                </div>
            </div>
        </section>

        <!-- C. Bento Box Features Grid -->
        <section id="features" class="py-24 sm:py-32 relative">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
                <div class="mb-16 max-w-2xl space-y-3">
                    <span class="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Core Infrastructure Architecture</span>
                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">Built for scale, speed, and precision.</h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                    <!-- Feature 1: Inventory -->
                    <div class="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl space-y-6 hover:border-blue-300 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                        <div class="w-14 h-14 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                        </div>
                        <div class="space-y-3">
                            <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Material Stock Catalog</h3>
                            <p class="text-slate-600 text-xs font-medium leading-relaxed">
                                Complete CRUD for building materials (500W steel rebar, composite cement, red bricks, coarse sand, stone chips). Real-time stock valuation and low-stock alerts.
                            </p>
                        </div>
                    </div>

                    <!-- Feature 2: Vendor Directory -->
                    <div class="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl space-y-6 hover:border-indigo-300 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                        <div class="w-14 h-14 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                        </div>
                        <div class="space-y-3">
                            <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Supplier Directory & Ratings</h3>
                            <p class="text-slate-600 text-xs font-medium leading-relaxed">
                                Profiles for key material suppliers. Category filters, contact personnel logging, and interactive 1-5 star performance scorecards.
                            </p>
                        </div>
                    </div>

                    <!-- Feature 3: Milestone Tracker -->
                    <div class="bg-white border border-slate-200/80 p-8 sm:p-10 rounded-3xl space-y-6 hover:border-teal-300 hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                        <div class="w-14 h-14 bg-teal-50 text-teal-600 border border-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        </div>
                        <div class="space-y-3">
                            <h3 class="text-xl font-extrabold text-slate-900 tracking-tight">Milestone Tracker</h3>
                            <p class="text-slate-600 text-xs font-medium leading-relaxed">
                                Timeline visualization with FullCalendar. Create, map, and track structural phase status (`Pending`, `In Progress`, `Completed`).
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- D. Live Operations Preview Section -->
        <section id="preview" class="py-24 bg-white border-y border-slate-200/80">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
                <div class="text-center max-w-2xl mx-auto space-y-3">
                    <span class="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Command Center Interface</span>
                    <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Real-time visibility across all operational layers</h2>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Inventory Command Card -->
                    <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                        <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop" alt="Material Stock Tracking" class="w-full h-48 object-cover rounded-2xl border border-slate-200" />
                        <div>
                            <span class="text-[10px] font-extrabold uppercase text-blue-600 tracking-wider">Inventory Command</span>
                            <h3 class="text-base font-extrabold text-slate-900 mt-1">Material Stock Tracking</h3>
                            <p class="text-xs text-slate-500 mt-1">Monitor BSRM steel, Holcim cement bags, and aggregate volume with automated reorder alerts.</p>
                        </div>
                    </div>

                    <!-- Supplier Auditing Card -->
                    <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                        <img src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop" alt="Verified Vendor Scorecards" class="w-full h-48 object-cover rounded-2xl border border-slate-200" />
                        <div>
                            <span class="text-[10px] font-extrabold uppercase text-indigo-600 tracking-wider">Supplier Auditing</span>
                            <h3 class="text-base font-extrabold text-slate-900 mt-1">Verified Vendor Scorecards</h3>
                            <p class="text-xs text-slate-500 mt-1">Audit ready-mix concrete and building material partners with 1-5 star quality ratings.</p>
                        </div>
                    </div>

                    <!-- Timeline Scheduling Card -->
                    <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                        <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" alt="Milestone Phase Tracker" class="w-full h-48 object-cover rounded-2xl border border-slate-200" />
                        <div>
                            <span class="text-[10px] font-extrabold uppercase text-teal-600 tracking-wider">Timeline Scheduling</span>
                            <h3 class="text-base font-extrabold text-slate-900 mt-1">Milestone Phase Tracker</h3>
                            <p class="text-xs text-slate-500 mt-1">FullCalendar Gantt-style timeline tracking for raft foundations, columns, and slab casting.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- E. Refined Call to Action Card Section -->
        <section class="py-24 relative overflow-hidden bg-[#f8fafc]">
            <div class="max-w-5xl mx-auto px-6 relative z-10">
                <div class="bg-white border border-slate-200/80 rounded-3xl p-10 sm:p-16 text-center space-y-6 shadow-lg relative overflow-hidden">
                    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-extrabold uppercase tracking-widest">
                        <span>🚀</span> Instant Enterprise Access
                    </div>

                    <h2 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Ready to streamline your construction site?
                    </h2>

                    <p class="text-slate-600 text-xs sm:text-sm font-medium max-w-xl mx-auto leading-relaxed">
                        Experience real-time inventory tracking, verified supplier scorecards, and project milestone monitoring with SmartConstruct ERP.
                    </p>

                    <div class="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link
                            v-if="!$page.props.auth.user"
                            :href="route('register')"
                            class="px-8 py-4 rounded-2xl text-xs font-extrabold tracking-wide bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/20 hover:scale-105 flex items-center gap-2"
                        >
                            Create Corporate Account &rarr;
                        </Link>
                        <Link
                            v-else
                            :href="route('dashboard')"
                            class="px-8 py-4 rounded-2xl text-xs font-extrabold tracking-wide bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md shadow-blue-600/20 hover:scale-105 flex items-center gap-2"
                        >
                            Go to Dashboard Console &rarr;
                        </Link>

                        <Link
                            v-if="!$page.props.auth.user"
                            :href="route('login')"
                            class="px-8 py-4 rounded-2xl text-xs font-bold tracking-wide bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-all"
                        >
                            Sign In to Console
                        </Link>
                    </div>
                </div>
            </div>
        </section>

        <!-- F. Footer -->
        <footer class="border-t border-slate-200 bg-white py-10 relative z-10">
            <div class="max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                <BrandLogos name="smartconstruct" className="h-16 sm:h-18" />

                <div class="flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <a href="#features" class="hover:text-slate-900 transition-colors">Features</a>
                    <a href="#partners" class="hover:text-slate-900 transition-colors">Partners</a>
                    <a href="#preview" class="hover:text-slate-900 transition-colors">Operations</a>
                </div>

                <div class="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                    &copy; 2026 SmartConstruct ERP. All rights reserved.
                </div>
            </div>
        </footer>
    </div>
</template>
