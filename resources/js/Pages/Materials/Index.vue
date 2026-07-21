<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import { Head, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

const props = defineProps({
    materials: {
        type: Array,
        required: true,
    },
    canManage: {
        type: Boolean,
        required: true,
    },
    canUse: {
        type: Boolean,
        required: true,
    },
});

// Modals State
const isCreateModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isAdjustModalOpen = ref(false);
const selectedMaterial = ref(null);

// Forms
const createForm = useForm({
    name: '',
    unit: '',
    quantity: 0,
    reorder_level: 10,
    price: 0.00,
});

const editForm = useForm({
    name: '',
    unit: '',
    quantity: 0,
    reorder_level: 10,
    price: 0.00,
});

const adjustForm = useForm({
    type: 'add',
    amount: 1,
});

// Operations
const openEditModal = (material) => {
    selectedMaterial.value = material;
    editForm.name = material.name;
    editForm.unit = material.unit;
    editForm.quantity = material.quantity;
    editForm.reorder_level = material.reorder_level;
    editForm.price = material.price;
    isEditModalOpen.value = true;
};

const openAdjustModal = (material) => {
    selectedMaterial.value = material;
    adjustForm.type = 'consume';
    adjustForm.amount = 1;
    isAdjustModalOpen.value = true;
};

const submitCreate = () => {
    createForm.post(route('materials.store'), {
        onSuccess: () => {
            isCreateModalOpen.value = false;
            createForm.reset();
        }
    });
};

const submitEdit = () => {
    editForm.patch(route('materials.update', selectedMaterial.value.id), {
        onSuccess: () => {
            isEditModalOpen.value = false;
            selectedMaterial.value = null;
        }
    });
};

const submitAdjust = () => {
    adjustForm.post(route('materials.stock', selectedMaterial.value.id), {
        onSuccess: () => {
            isAdjustModalOpen.value = false;
            selectedMaterial.value = null;
        }
    });
};

const deleteMaterial = (id) => {
    if (confirm('Are you sure you want to delete this material?')) {
        useForm({}).delete(route('materials.destroy', id));
    }
};
</script>

<template>
    <Head title="Resources Catalog" />

    <AuthenticatedLayout>
        <template #header>
            Material Stock Catalog
        </template>

        <div class="space-y-6">
            <!-- Header Actions -->
            <div class="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
                <div>
                    <h2 class="text-base font-bold text-white">Construction Materials & Stock Catalog</h2>
                    <p class="text-slate-400 text-xs mt-0.5">Track raw materials (steel rebar, cement, bricks, aggregates), monitor stock levels & unit prices.</p>
                </div>
                <button
                    v-if="canManage"
                    @click="isCreateModalOpen = true"
                    class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow flex items-center gap-2"
                >
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Material
                </button>
            </div>

            <!-- Materials Table Card -->
            <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse text-xs text-slate-300">
                        <thead>
                            <tr class="bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-800">
                                <th class="px-6 py-4">Resource Item</th>
                                <th class="px-6 py-4 text-right">Available Stock</th>
                                <th class="px-6 py-4">Reorder Alert Level</th>
                                <th class="px-6 py-4 text-right">Unit Price</th>
                                <th class="px-6 py-4 text-right">Total Valuation</th>
                                <th class="px-6 py-4 text-center">Stock Status</th>
                                <th class="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                            <tr v-for="material in materials" :key="material.id" class="hover:bg-slate-800/40 transition-colors">
                                <td class="px-6 py-4 font-bold text-white">
                                    {{ material.name }}
                                </td>
                                <td class="px-6 py-4 text-right font-extrabold" :class="material.quantity <= material.reorder_level ? 'text-rose-400' : 'text-slate-200'">
                                    {{ material.quantity }} <span class="text-[10px] text-slate-400 font-normal uppercase">{{ material.unit }}</span>
                                </td>
                                <td class="px-6 py-4 text-slate-400 font-medium">
                                    {{ material.reorder_level }} {{ material.unit }}
                                </td>
                                <td class="px-6 py-4 text-right text-slate-300 font-semibold">
                                    ৳ {{ Number(material.price).toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                                </td>
                                <td class="px-6 py-4 text-right font-bold text-white">
                                    ৳ {{ (material.quantity * material.price).toLocaleString(undefined, {minimumFractionDigits: 2}) }}
                                </td>
                                <td class="px-6 py-4 text-center">
                                    <span
                                        v-if="material.quantity <= material.reorder_level"
                                        class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase"
                                    >
                                        Low Stock Alert
                                    </span>
                                    <span
                                        v-else
                                        class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase"
                                    >
                                        In Stock
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <div class="flex items-center justify-end gap-2">
                                        <!-- Quick Stock Adjustment -->
                                        <button
                                            v-if="canUse"
                                            @click="openAdjustModal(material)"
                                            title="Consume or Restock"
                                            class="px-3 py-1.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/20 text-xs font-semibold transition-colors flex items-center gap-1"
                                        >
                                            Update Stock
                                        </button>

                                        <!-- Edit -->
                                        <button
                                            v-if="canManage"
                                            @click="openEditModal(material)"
                                            class="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                                        >
                                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                        <!-- Delete -->
                                        <button
                                            v-if="canManage"
                                            @click="deleteMaterial(material.id)"
                                            class="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                                        >
                                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Add Material Modal -->
        <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-sm font-bold text-white">Add New Material</h3>
                    <button @click="isCreateModalOpen = false" class="text-slate-400 hover:text-white">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitCreate" class="space-y-4 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-300 mb-1.5">Material Name</label>
                        <input v-model="createForm.name" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="e.g. BSRM Steel 500W (12mm)" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Unit</label>
                            <input v-model="createForm.unit" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" placeholder="e.g. Tons, Bags, CFT" />
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">Unit Price (৳)</label>
                            <input v-model="createForm.price" required type="number" step="0.01" min="0" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Initial Quantity</label>
                            <input v-model="createForm.quantity" required type="number" min="0" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">Reorder Alert Level</label>
                            <input v-model="createForm.reorder_level" required type="number" min="0" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                        <button type="button" @click="isCreateModalOpen = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors">Cancel</button>
                        <button type="submit" :disabled="createForm.processing" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">Save Material</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Edit Material Modal -->
        <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-xl space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 class="text-sm font-bold text-white">Edit Material Details</h3>
                    <button @click="isEditModalOpen = false" class="text-slate-400 hover:text-white">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitEdit" class="space-y-4 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-300 mb-1.5">Material Name</label>
                        <input v-model="editForm.name" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Unit</label>
                            <input v-model="editForm.unit" required type="text" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">Unit Price (৳)</label>
                            <input v-model="editForm.price" required type="number" step="0.01" min="0" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-slate-300 mb-1.5">Current Quantity</label>
                            <input v-model="editForm.quantity" required type="number" min="0" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                            <label class="block text-slate-300 mb-1.5">Reorder Alert Level</label>
                            <input v-model="editForm.reorder_level" required type="number" min="0" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        </div>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                        <button type="button" @click="isEditModalOpen = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors">Cancel</button>
                        <button type="submit" :disabled="editForm.processing" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">Update Material</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Adjust Stock Modal -->
        <div v-if="isAdjustModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
            <div class="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl space-y-5">
                <div class="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div>
                        <h3 class="text-sm font-bold text-white">Adjust Stock Level</h3>
                        <p class="text-xs text-blue-400 font-semibold mt-0.5">{{ selectedMaterial?.name }}</p>
                    </div>
                    <button @click="isAdjustModalOpen = false" class="text-slate-400 hover:text-white">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                <form @submit.prevent="submitAdjust" class="space-y-4 text-xs font-semibold">
                    <div>
                        <label class="block text-slate-300 mb-2">Operation Type</label>
                        <div class="grid grid-cols-2 gap-3">
                            <label class="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-bold transition-colors" :class="adjustForm.type === 'add' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-slate-950 border-slate-800 text-slate-400'">
                                <input v-model="adjustForm.type" type="radio" value="add" class="hidden" />
                                <span>Restock (Add)</span>
                            </label>
                            <label class="flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer font-bold transition-colors" :class="adjustForm.type === 'consume' ? 'bg-rose-500/20 border-rose-500 text-rose-400' : 'bg-slate-950 border-slate-800 text-slate-400'">
                                <input v-model="adjustForm.type" type="radio" value="consume" class="hidden" />
                                <span>Consume (Use)</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label class="block text-slate-300 mb-1.5">Quantity ({{ selectedMaterial?.unit }})</label>
                        <input v-model="adjustForm.amount" required type="number" min="1" class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:border-blue-500 outline-none" />
                        <span v-if="adjustForm.errors.amount" class="text-xs text-rose-400 font-bold mt-1.5 block">{{ adjustForm.errors.amount }}</span>
                    </div>

                    <div class="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                        <button type="button" @click="isAdjustModalOpen = false" class="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold transition-colors">Cancel</button>
                        <button type="submit" :disabled="adjustForm.processing" class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors">Submit Adjustment</button>
                    </div>
                </form>
            </div>
        </div>
    </AuthenticatedLayout>
</template>
