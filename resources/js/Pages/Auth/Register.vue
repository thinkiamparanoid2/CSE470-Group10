<script setup>
import GuestLayout from '@/Layouts/GuestLayout.vue';
import InputError from '@/Components/InputError.vue';
import InputLabel from '@/Components/InputLabel.vue';
import PrimaryButton from '@/Components/PrimaryButton.vue';
import TextInput from '@/Components/TextInput.vue';
import { Head, Link, useForm } from '@inertiajs/vue3';

const form = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const submit = () => {
    form.post(route('register'), {
        onFinish: () => form.reset('password', 'password_confirmation'),
    });
};
</script>

<template>
    <GuestLayout title="Create Corporate Account" subtitle="Register to access SmartConstruct ERP.">
        <Head title="Register" />

        <form @submit.prevent="submit" class="space-y-5">
            <div>
                <InputLabel for="name" value="Full Name" class="!text-slate-700 !font-bold !text-xs mb-2" />
                <TextInput
                    id="name"
                    type="text"
                    class="w-full !bg-slate-50 !border-slate-300 focus:!border-blue-600 focus:!bg-white !rounded-xl !px-4 !py-3 !text-xs !text-slate-900 shadow-sm transition-all"
                    v-model="form.name"
                    required
                    autofocus
                    autocomplete="name"
                    placeholder="Engr. Rafiqul Islam"
                />
                <InputError class="mt-2 text-rose-600 text-xs font-bold" :message="form.errors.name" />
            </div>

            <div>
                <InputLabel for="email" value="Corporate Email Address" class="!text-slate-700 !font-bold !text-xs mb-2" />
                <TextInput
                    id="email"
                    type="email"
                    class="w-full !bg-slate-50 !border-slate-300 focus:!border-blue-600 focus:!bg-white !rounded-xl !px-4 !py-3 !text-xs !text-slate-900 shadow-sm transition-all"
                    v-model="form.email"
                    required
                    autocomplete="username"
                    placeholder="you@company.com"
                />
                <InputError class="mt-2 text-rose-600 text-xs font-bold" :message="form.errors.email" />
            </div>

            <div>
                <InputLabel for="password" value="Password" class="!text-slate-700 !font-bold !text-xs mb-2" />
                <TextInput
                    id="password"
                    type="password"
                    class="w-full !bg-slate-50 !border-slate-300 focus:!border-blue-600 focus:!bg-white !rounded-xl !px-4 !py-3 !text-xs !text-slate-900 shadow-sm transition-all"
                    v-model="form.password"
                    required
                    autocomplete="new-password"
                    placeholder="Create a strong password"
                />
                <InputError class="mt-2 text-rose-600 text-xs font-bold" :message="form.errors.password" />
            </div>

            <div>
                <InputLabel for="password_confirmation" value="Confirm Password" class="!text-slate-700 !font-bold !text-xs mb-2" />
                <TextInput
                    id="password_confirmation"
                    type="password"
                    class="w-full !bg-slate-50 !border-slate-300 focus:!border-blue-600 focus:!bg-white !rounded-xl !px-4 !py-3 !text-xs !text-slate-900 shadow-sm transition-all"
                    v-model="form.password_confirmation"
                    required
                    autocomplete="new-password"
                    placeholder="Re-enter your password"
                />
                <InputError class="mt-2 text-rose-600 text-xs font-bold" :message="form.errors.password_confirmation" />
            </div>

            <div class="pt-2">
                <PrimaryButton
                    class="w-full !py-3.5 !rounded-xl !bg-blue-600 hover:!bg-blue-700 !text-white !font-extrabold !text-xs !tracking-wide shadow-md shadow-blue-600/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
                    :class="{ 'opacity-50': form.processing }"
                    :disabled="form.processing"
                >
                    Register Account &rarr;
                </PrimaryButton>
            </div>

            <p class="text-center text-xs text-slate-500 font-medium pt-2 border-t border-slate-100">
                Already registered?
                <Link :href="route('login')" class="text-blue-600 font-extrabold hover:text-blue-700 transition-colors ml-1">
                    Sign In
                </Link>
            </p>
        </form>
    </GuestLayout>
</template>
