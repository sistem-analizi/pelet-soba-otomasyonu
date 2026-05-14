<script setup lang="ts">
const detayStore = useDetayStore();
const apiStore = useApiStore();

// Ayarlar form state
const formAyarlar = ref({
    dolum_suresi: apiStore.data.ayarlar.dolum_suresi,
    mod: apiStore.data.ayarlar.mod,
    min_sicaklik: apiStore.data.ayarlar.min_sicaklik,
    max_sicaklik: apiStore.data.ayarlar.max_sicaklik,
    dakikada_atilan: apiStore.data.ayarlar.dakikada_atilan,
});

// Durum form state
const formDurum = ref({
    aktif: apiStore.data.durum.aktif,
    doldur: apiStore.data.durum.doldur,
});

const isSaving = ref(false);

// Form verilerini apiStore'dan senkronize et
watch(() => apiStore.data.ayarlar, (newVal) => {
    formAyarlar.value = {
        dolum_suresi: newVal.dolum_suresi,
        mod: newVal.mod,
        min_sicaklik: newVal.min_sicaklik,
        max_sicaklik: newVal.max_sicaklik,
        dakikada_atilan: newVal.dakikada_atilan,
    };
}, { deep: true });

watch(() => apiStore.data.durum, (newVal) => {
    formDurum.value = {
        aktif: newVal.aktif,
        doldur: newVal.doldur,
    };
}, { deep: true });

// Ayarları kaydet
const saveAyarlar = async () => {
    isSaving.value = true;
    try {
        await apiStore.updateAyarlar({
            dolum_suresi: formAyarlar.value.dolum_suresi,
            min_sicaklik: formAyarlar.value.min_sicaklik,
            max_sicaklik: formAyarlar.value.max_sicaklik,
            dakikada_atilan: formAyarlar.value.dakikada_atilan,
        });
    } finally {
        isSaving.value = false;
    }
};

// Durum değiştir
const toggleStatus = async () => {
    isSaving.value = true;
    try {
        await apiStore.setAktif(!formDurum.value.aktif);
    } finally {
        isSaving.value = false;
    }
};

// Doldur
const handleDoldur = async () => {
    isSaving.value = true;
    try {
        await apiStore.setDoldur(180, true);
    } finally {
        isSaving.value = false;
    }
};

// Boşalt
const handleBosalt = async () => {
    isSaving.value = true;
    try {
        await apiStore.setDoldur(0, false);
    } finally {
        isSaving.value = false;
    }
};

// Mod değiştir
const changeMod = async (newMod: number) => {
    isSaving.value = true;
    try {
        await apiStore.setMod(newMod);
    } finally {
        isSaving.value = false;
    }
};

// Manuel modda dolum süresi için debounce
let dolumSuresiTimeout: NodeJS.Timeout;
watch(() => formAyarlar.value.dolum_suresi, (newVal) => {
    if (formAyarlar.value.mod === 1) {
        clearTimeout(dolumSuresiTimeout);
        dolumSuresiTimeout = setTimeout(async () => {
            isSaving.value = true;
            try {
                await apiStore.updateAyarlar({
                    dolum_suresi: newVal,
                    min_sicaklik: formAyarlar.value.min_sicaklik,
                    max_sicaklik: formAyarlar.value.max_sicaklik,
                    dakikada_atilan: formAyarlar.value.dakikada_atilan,
                });
            } finally {
                isSaving.value = false;
            }
        }, 500);
    }
});
</script>
<template>
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 class="text-xl font-bold text-slate-800">Soba 1 - Detayları</h2>
                <div class="flex items-center gap-3">
                    <!-- Mod Seçimi -->
                    <div class="flex rounded-lg overflow-hidden border border-purple-200">
                        <button 
                            @click="changeMod(0)"
                            :disabled="isSaving || apiStore.loading"
                            class="px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="formAyarlar.mod === 0 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-white text-slate-500 hover:bg-slate-100'"
                        >
                            Otomatik
                        </button>
                        <button 
                            @click="changeMod(1)"
                            :disabled="isSaving || apiStore.loading"
                            class="px-3 py-1.5 text-xs font-medium transition-colors"
                            :class="formAyarlar.mod === 1 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-white text-slate-500 hover:bg-slate-100'"
                        >
                            Manuel
                        </button>
                    </div>
                    <!-- Kapat Butonu -->
                    <button class="p-2 rounded-full hover:bg-slate-100 transition-colors" title="Kapat" @click="detayStore.toggleDetay()">
                        <UIcon name="i-heroicons-x-mark" class="size-5" />
                    </button>
                </div>
            </div>

            <!-- Hata Mesajı -->
            <div v-if="apiStore.error" class="px-6 pt-4">
                <div class="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                    {{ apiStore.error }}
                </div>
            </div>

            <!-- Body -->
            <div class="p-6 space-y-4">

            <!-- Soba Durumu -->
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Soba Durumu</h3>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-600">Soba Durumu:</span>
                        <div class="flex rounded-lg overflow-hidden border border-blue-200">
                            <button 
                                @click="toggleStatus()"
                                :disabled="isSaving || apiStore.loading"
                                class="px-4 py-1.5 text-sm font-medium transition-colors"
                                :class="formDurum.aktif 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-white text-slate-500 hover:bg-slate-100'"
                            >
                                {{ formDurum.aktif ? 'Aktif' : 'Aktif' }}
                            </button>
                            <button 
                                @click="toggleStatus()"
                                :disabled="isSaving || apiStore.loading"
                                class="px-4 py-1.5 text-sm font-medium transition-colors"
                                :class="!formDurum.aktif 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-white text-slate-500 hover:bg-slate-100'"
                            >
                                {{ !formDurum.aktif ? 'Pasif' : 'Pasif' }}
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Manuel Mod - Doldur/Boşalt -->
                <div v-if="formAyarlar.mod === 1" class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Manuel Mod</h3>
                    <div class="space-y-4">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-600">Yakıt Doldur/Boşalt:</span>
                            <div class="flex rounded-lg overflow-hidden border border-amber-200">
                                <button 
                                    @click="handleDoldur()"
                                    :disabled="isSaving || apiStore.loading"
                                    class="px-4 py-1.5 text-sm font-medium transition-colors"
                                    :class="formDurum.doldur 
                                        ? 'bg-orange-500 text-white' 
                                        : 'bg-white text-slate-500 hover:bg-slate-100'"
                                >
                                    Doldur
                                </button>
                                <button 
                                    @click="handleBosalt()"
                                    :disabled="isSaving || apiStore.loading"
                                    class="px-4 py-1.5 text-sm font-medium transition-colors"
                                    :class="!formDurum.doldur 
                                        ? 'bg-slate-600 text-white' 
                                        : 'bg-white text-slate-500 hover:bg-slate-100'"
                                >
                                    Boşalt
                                </button>
                            </div>
                        </div>
                        <div class="text-xs text-slate-500">
                            Durum: {{ formDurum.doldur ? '✓ Doldurma Aktif' : '✗ Boşaltma Aktif' }}
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-600">Dolum Süresi:</span>
                            <span class="font-semibold text-slate-800">{{ formAyarlar.dolum_suresi }} ms</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <input 
                                type="range"
                                v-model.number="formAyarlar.dolum_suresi"
                                :disabled="isSaving || apiStore.loading"
                                min="100"
                                max="5000"
                                step="100"
                                class="flex-1 h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>
                    </div>
                </div>

                <!-- Otomatik Mod Bilgisi -->
                <div v-if="formAyarlar.mod === 0" class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Otomatik Mod</h3>
                    <div class="flex items-center justify-between text-slate-600">
                        <span>Sıcaklık otomatik olarak ayarlanmaktadır</span>
                        <span class="text-lg">🤖</span>
                    </div>
                </div>

                <!-- Mevcut Sıcaklık Bilgisi -->
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Mevcut Sıcaklık</h3>
                    <div class="flex items-center justify-between">
                        <span class="text-slate-600">İç Sıcaklık:</span>
                        <div class="flex items-baseline gap-2">
                            <span class="text-3xl font-bold text-slate-800">{{ apiStore.data.durum.isi }}</span>
                            <span class="text-lg text-slate-600">°C</span>
                        </div>
                    </div>
                </div>

                <!-- Sıcaklık Ayarları (Sabit) -->
                <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Mevcut Ayarlar</h3>
                    <div class="space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-slate-600">Minimum Sıcaklık:</span>
                            <span class="font-bold text-slate-800">{{ apiStore.data.ayarlar.min_sicaklik }}°C</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-600">Maksimum Sıcaklık:</span>
                            <span class="font-bold text-slate-800">{{ apiStore.data.ayarlar.max_sicaklik }}°C</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-600">Dakikada Yakıt Atımı:</span>
                            <span class="font-bold text-slate-800">{{ apiStore.data.ayarlar.dakikada_atilan }} ölçü</span>
                        </div>
                        <div class="flex items-center justify-between">
                            <span class="text-slate-600">Dolum Süresi:</span>
                            <span class="font-bold text-slate-800">{{ apiStore.data.ayarlar.dolum_suresi }} ms</span>
                        </div>
                    </div>
                </div>

                <!-- Kullanıcı Ayarları (Otomatik Mod) -->
                <div v-if="formAyarlar.mod === 0" class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ayarları Düzenle</h3>
                    <div class="space-y-4">
                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-slate-600">Minimum Sıcaklık:</span>
                                <span class="font-semibold text-slate-800">{{ formAyarlar.min_sicaklik }}°C</span>
                            </div>
                            <input 
                                type="range"
                                v-model.number="formAyarlar.min_sicaklik" 
                                :disabled="isSaving || apiStore.loading"
                                min="10"
                                max="80"
                                step="1"
                                class="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-slate-600">Maksimum Sıcaklık:</span>
                                <span class="font-semibold text-slate-800">{{ formAyarlar.max_sicaklik }}°C</span>
                            </div>
                            <input 
                                type="range"
                                v-model.number="formAyarlar.max_sicaklik" 
                                :disabled="isSaving || apiStore.loading"
                                min="10"
                                max="80"
                                step="1"
                                class="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-slate-600">Dakikada Yakıt Atımı:</span>
                                <span class="font-semibold text-slate-800">{{ formAyarlar.dakikada_atilan }} ölçü</span>
                            </div>
                            <input 
                                type="range"
                                v-model.number="formAyarlar.dakikada_atilan" 
                                :disabled="isSaving || apiStore.loading"
                                min="1"
                                max="100"
                                step="1"
                                class="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                            />
                        </div>

                        <div>
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-slate-600">Dolum Süresi:</span>
                                <span class="font-semibold text-slate-800">{{ formAyarlar.dolum_suresi }} ms</span>
                            </div>
                            <input 
                                type="range"
                                v-model.number="formAyarlar.dolum_suresi" 
                                :disabled="isSaving || apiStore.loading"
                                min="100"
                                max="5000"
                                step="100"
                                class="w-full h-2 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-slate-600"
                            />
                        </div>

                        <div class="flex justify-end pt-1">
                            <button 
                                @click="saveAyarlar()"
                                :disabled="isSaving || apiStore.loading"
                                class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <UIcon v-if="isSaving" name="i-heroicons-arrow-path" class="size-4 animate-spin" />
                                <span>{{ isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet' }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="flex justify-end pt-2">
                    <button 
                        @click="detayStore.toggleDetay()" 
                        class="px-6 py-2 bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        Kapat
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>