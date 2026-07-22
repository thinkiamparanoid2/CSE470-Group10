<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

defineProps({
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
});

const submit = () => {
    form.post(route('password.email'));
};
</script>

<template>
    <GuestLayout title="Reset your password" subtitle="Enter your email and we'll send you a reset link.">
        <Head title="Forgot Password" />

        <div v-if="status" class="mb-6 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            {{ status }}
        </div>

        <form @submit.prevent="submit" class="space-y-5">
            <div>
                <InputLabel for="email" value="Email Address" />
                <TextInput
                    id="email"
                    type="email"
                    class="mt-1.5"
                    v-model="form.email"
                    required
                    autofocus
                    autocomplete="username"
                    placeholder="you@company.com"
                />
                <InputError :message="form.errors.email" />
            </div>

            <PrimaryButton
                class="w-full !py-3"
                :class="{ 'opacity-50': form.processing }"
                :disabled="form.processing"
            >
                Send Reset Link
            </PrimaryButton>

            <p class="text-center text-xs text-slate-500">
                <Link :href="route('login')" class="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                    Back to sign in
                </Link>
            </p>
        </form>
    </GuestLayout>
</template>
