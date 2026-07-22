<script setup>
import Checkbox from '@/Components/Checkbox.vue';
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});

const form = useForm({
    email: '',
    password: '',
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <GuestLayout title="Welcome Back" subtitle="Sign in to access your ERP operations console.">
        <Head title="Sign In" />

        <div v-if="status" class="mb-6 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-2">
            <svg class="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>{{ status }}</span>
        </div>

        <form @submit.prevent="submit" class="space-y-6">
            <div>
                <InputLabel for="email" value="Corporate Email Address" class="!text-slate-700 !font-bold !text-xs mb-2" />
                <TextInput
                    id="email"
                    type="email"
                    class="w-full !bg-slate-50 !border-slate-300 focus:!border-blue-600 focus:!bg-white !rounded-xl !px-4 !py-3 !text-xs !text-slate-900 shadow-sm transition-all"
                    v-model="form.email"
                    required
                    autofocus
                    autocomplete="username"
                    placeholder="you@company.com"
                />
                <InputError class="mt-2 text-rose-600 text-xs font-bold" :message="form.errors.email" />
            </div>

            <div>
                <InputLabel for="password" value="Account Password" class="!text-slate-700 !font-bold !text-xs mb-2" />
                <TextInput
                    id="password"
                    type="password"
                    class="w-full !bg-slate-50 !border-slate-300 focus:!border-blue-600 focus:!bg-white !rounded-xl !px-4 !py-3 !text-xs !text-slate-900 shadow-sm transition-all"
                    v-model="form.password"
                    required
                    autocomplete="current-password"
                    placeholder="Enter your account password"
                />
                <InputError class="mt-2 text-rose-600 text-xs font-bold" :message="form.errors.password" />
            </div>

            <div class="flex items-center justify-between pt-1">
                <label class="flex items-center gap-2.5 cursor-pointer select-none">
                    <Checkbox name="remember" v-model:checked="form.remember" class="!rounded !border-slate-300 !text-blue-600 focus:!ring-blue-600/20" />
                    <span class="text-xs font-semibold text-slate-600">Remember me</span>
                </label>

                <Link
                    v-if="canResetPassword"
                    :href="route('password.request')"
                    class="text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors"
                >
                    Forgot password?
                </Link>
            </div>

            <div class="pt-2">
                <PrimaryButton
                    class="w-full !py-3.5 !rounded-xl !bg-blue-600 hover:!bg-blue-700 !text-white !font-extrabold !text-xs !tracking-wide shadow-md shadow-blue-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    :class="{ 'opacity-50': form.processing }"
                    :disabled="form.processing"
                >
                    Sign In to Console &rarr;
                </PrimaryButton>
            </div>

            <p class="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                Don't have an account?
                <Link :href="route('register')" class="text-blue-600 font-extrabold hover:text-blue-700 transition-colors ml-1">
                    Register Account
                </Link>
            </p>
        </form>
    </GuestLayout>
</template>
