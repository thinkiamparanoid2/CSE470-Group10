<script setup>
defineProps({
    title: { type: String, required: true },
    description: { type: String, default: '' },
});
</script>

<template>
    <div class="surface-card p-6 flex items-center justify-between flex-wrap gap-4">
        <div>
            <h2 class="text-base font-bold text-white">{{ title }}</h2>
            <p v-if="description" class="text-slate-400 text-xs mt-1 max-w-xl">{{ description }}</p>
        </div>
        <slot />
    </div>
</template>
