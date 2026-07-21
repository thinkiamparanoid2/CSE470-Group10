<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm, router } from '@inertiajs/vue3';
import { ref, watch } from 'vue';

const props = defineProps({
    vendors: {
        type: Array,
        required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    filters: {
        type: Object,
        required: true,
    },
    canManage: {
        type: Boolean,
        required: true,
    },
    canRate: {
        type: Boolean,
        required: true,
    },
});

// Filters
const search = ref(props.filters.search || '');
const category = ref(props.filters.category || '');

// Trigger filtering when inputs change
watch([search, category], () => {
    router.get(route('vendors.index'), {
        search: search.value,
        category: category.value
    }, {
        preserveState: true,
        replace: true
    });
});

const clearFilters = () => {
    search.value = '';
    category.value = '';
};

// Modals
const isCreateModalOpen = ref(false);
const isRateModalOpen = ref(false);
const selectedVendor = ref(null);
const hoverRating = ref(0);
const chosenRating = ref(5);

// Forms
const createForm = useForm({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    category: '',
});

const submitCreate = () => {
    createForm.post(route('vendors.store'), {
        onSuccess: () => {
            isCreateModalOpen.value = false;
            createForm.reset();
        }
    });
};

const openRateModal = (vendor) => {
    selectedVendor.value = vendor;
    chosenRating.value = 5;
    isRateModalOpen.value = true;
};

const submitRating = () => {
    useForm({
        rating: chosenRating.value
    }).post(route('vendors.rate', selectedVendor.value.id), {
        onSuccess: () => {
            isRateModalOpen.value = false;
            selectedVendor.value = null;
        }
    });
};
</script>

<template>
    <Head title="Suppliers Directory" />

    <AuthenticatedLayout>
        <template #header>
            Vendor & Supplier Directory
        </template>

        <div class="space-y-6">
            <!-- Header Section -->
            <div class="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                <div>
                    <h2 class="text-base font-bold text-white">Verified Construction Suppliers & Partners</h2>
                    <p class="text-slate-400 text-xs mt-0.5">Supplier corporate profiles, contact personnel, and performance rating audits.</p>
                </div>
                <button
                    v-if="canManage"
                    @click="isCreateModalOpen = true"
                    class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Register Vendor
                </button>
            </div>

            <!-- Filter Controls -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-sm">
                <div class="md:col-span-6 relative">
                    <input
                        v-model="search"
                        type="text"
                        placeholder="Search partners by company name or category..."
                        class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-blue-500 outline-none"
                    />
                    <svg class="absolute left-3.5 top-3 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div class="md:col-span-4 text-xs font-semibold">
                    <select
                        v-model="category"
                        class="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-300 focus:border-blue-500 outline-none cursor-pointer"
                    >
                        <option value="">All Supplier Categories</option>
                        <option v-for="cat in categories" :key="cat" :value="cat">
                            {{ cat }}
                        </option>
                    </select>
                </div>

                <div class="md:col-span-2 text-right">
                    <button
                        v-if="search || category"
                        @click="clearFilters"
                        class="text-xs font-bold text-rose-400 hover:text-rose-350 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            <!-- Vendor Cards Grid -->
            <div v-if="vendors.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div
                    v-for="vendor in vendors"
                    :key="vendor.id"
                    class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-sm hover:border-slate-700 transition-colors"
                >
                    <div class="space-y-4">
                        <div class="flex items-start justify-between gap-3">
                            <div>
                                <span class="px-2.5 py-1 text-[10px] font-bold rounded bg-blue-600/10 text-blue-400 border border-blue-500/20 uppercase">
                                    {{ vendor.category }}
                                </span>
                                <h3 class="font-bold text-white text-base mt-2.5">
                                    {{ vendor.company_name }}
                                </h3>
                            </div>
                        </div>

                        <!-- Rating Summary -->
                        <div class="flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 w-fit text-xs font-bold">
                            <div class="flex text-amber-400 text-xs gap-0.5">
                                <span v-for="i in 5" :key="i">
                                    {{ i <= Math.round(vendor.average_rating) ? '★' : '☆' }}
                                </span>
                            </div>
                            <span class="text-white pl-1">
                                {{ vendor.average_rating.toFixed(1) }}
                            </span>
                            <span class="text-slate-500 font-semibold">
                                ({{ vendor.rating_count }} reviews)
                            </span>
                        </div>

                        <!-- Contact Details -->
                        <div class="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400 font-medium">
                            <div class="flex items-center gap-2.5">
                                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{{ vendor.name }}</span>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span class="truncate">{{ vendor.email }}</span>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <svg class="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>{{ vendor.phone }}</span>
                            </div>
                        </div>
                    </div>

                    <!-- Rate Button Action -->
                    <button
                        v-if="canRate"
                        @click="openRateModal(vendor)"
                        class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 hover:text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.176 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.97-2.883c-.772-.563-.373-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
                        </svg>
                        Submit Supplier Rating
                    </button>
                </div>
            </div>
            <!-- Empty directory state -->
            <div v-else class="py-16 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-2xl">
                <svg class="w-10 h-10 text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8" />
                </svg>
                <div class="space-y-1">
                    <h3 class="text-sm font-bold text-white">No Suppliers Found</h3>
                    <p class="text-xs text-slate-400">Try adjusting your search filters.</p>
                </div>
            </div>
        </div>

        <!-- Register Vendor Modal -->
        <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-sm font-bold text-white">Register Supplier Partner</h3>
                    <button @click="isCreateModalOpen = false" class="text-slate-400 hover:text-white">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitCreate" class="space-y-4 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-300 mb-1.5">Company Name</label>
                        <input v-model="createForm.company_name" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="e.g. Seven Rings Cement PLC" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Category</label>
                            <input v-model="createForm.category" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="e.g. Cement, Steel" />
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">Contact Person</label>
                            <input v-model="createForm.name" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="e.g. Engr. Rafiqul Islam" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Email</label>
                            <input v-model="createForm.email" required type="email" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="sales@company.com" />
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">Phone Number</label>
                            <input v-model="createForm.phone" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="+880 1700-000000" />
                        </div>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                        <button type="button" @click="isCreateModalOpen = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors">Cancel</button>
                        <button type="submit" :disabled="createForm.processing" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">Register Supplier</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Rating Submission Modal -->
        <div v-if="isRateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                        <h3 class="text-sm font-bold text-white">Rate Supplier Performance</h3>
                        <p class="text-xs text-slate-400 mt-0.5">{{ selectedVendor?.company_name }}</p>
                    </div>
                    <button @click="isRateModalOpen = false" class="text-slate-400 hover:text-white">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <div class="space-y-4 py-3 flex flex-col items-center">
                    <span class="text-slate-300 text-xs font-semibold">Select score (1 to 5 stars):</span>
                    
                    <!-- Star Rating Interactive Widget -->
                    <div class="flex items-center gap-2">
                        <button
                            v-for="star in 5"
                            :key="star"
                            type="button"
                            @click="chosenRating = star"
                            @mouseover="hoverRating = star"
                            @mouseleave="hoverRating = 0"
                            class="text-3xl transition-transform hover:scale-110 focus:outline-none"
                            :class="(hoverRating ? star <= hoverRating : star <= chosenRating) ? 'text-amber-400' : 'text-slate-700'"
                        >
                            ★
                        </button>
                    </div>
                    
                    <span class="text-xs font-bold text-blue-400 bg-slate-950 px-3 py-1 rounded-md border border-slate-800">
                        {{ chosenRating === 1 ? 'Poor Quality' : chosenRating === 2 ? 'Substandard' : chosenRating === 3 ? 'Acceptable' : chosenRating === 4 ? 'Good Quality' : 'Outstanding Service' }}
                    </span>
                </div>

                <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                    <button type="button" @click="isRateModalOpen = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors">Cancel</button>
                    <button type="button" @click="submitRating" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">Submit Score</button>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
