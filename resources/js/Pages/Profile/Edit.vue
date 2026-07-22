<script setup>
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout.vue';
import DeleteUserForm from './Partials/DeleteUserForm.vue';
import UpdatePasswordForm from './Partials/UpdatePasswordForm.vue';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm.vue';
import { Head } from '@inertiajs/vue3';

defineProps({
    mustVerifyEmail: {
        type: Boolean,
    },
    status: {
        type: String,
    },
});
</script>

<template>
    <Head title="Profile Settings" />

    <AuthenticatedLayout>
        <template #header>
            <div>
                <h1 class="page-title">Profile Settings</h1>
                <p class="text-xs text-slate-500 mt-0.5">Manage your account information and security</p>
            </div>
        </template>

        <div class="max-w-3xl space-y-6">
            <div class="surface-card p-6 sm:p-8">
                <UpdateProfileInformationForm
                    :must-verify-email="mustVerifyEmail"
                    :status="status"
                />
            </div>

            <div class="surface-card p-6 sm:p-8">
                <UpdatePasswordForm />
            </div>

            <div class="surface-card p-6 sm:p-8 border-rose-500/20">
                <DeleteUserForm />
            </div>
        </div>
    </AuthenticatedLayout>
</template>
