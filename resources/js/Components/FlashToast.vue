<script setup>
import { computed, ref, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';

const page = usePage();
const visible = ref(false);
const message = ref('');
const type = ref('success');

const flash = computed(() => page.props.flash);

watch(flash, (newFlash) => {
    const msg = newFlash?.success || newFlash?.error || newFlash?.status;
    if (msg) {
        message.value = msg;
        type.value = newFlash?.error ? 'error' : 'success';
        visible.value = true;
        setTimeout(() => { visible.value = false; }, 4000);
    }
}, { deep: true, immediate: true });
</script>

<template>
    <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-2 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-2 scale-95"
    >
        <div
            v-if="visible"
            class="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border max-w-sm animate-slide-up"
            :class="type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/90 border-rose-500/30 text-rose-300'"
        >
            <div
                class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                :class="type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'"
            >
                <svg v-if="type === 'success'" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <p class="text-xs font-semibold leading-snug">{{ message }}</p>
            <button
                @click="visible = false"
                class="ml-1 p-1 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
            >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </Transition>
</template>
