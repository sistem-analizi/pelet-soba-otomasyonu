<script setup lang="ts">
const detayStore = useDetayStore();
const apiStore = useApiStore();

onMounted(() => {
    apiStore.start();
});

onUnmounted(() => {
    detayStore.detay = false;
    apiStore.stop();
})

</script>

<template>
    <ClientOnly>
        <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
            <div class="max-w-7xl mx-auto">
                <!-- Yükleniyor durumu -->
                <div v-if="apiStore.loading" class="text-center py-12">
                    <div class="inline-flex items-center gap-3">
                        <div class="animate-spin">
                            <UIcon name="i-heroicons-arrow-path" class="size-6 text-blue-500" />
                        </div>
                        <p class="text-slate-600">Veriler yükleniyor...</p>
                    </div>
                </div>
                
                <!-- Hata durumu -->
                <div v-if="apiStore.error" class="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <p class="text-red-700">{{ apiStore.error }}</p>
                </div>

                <!-- Soba Kartı -->
                <div v-if="!apiStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 z-0">
                    <div class="bg-white rounded-xl shadow-2xs hover:shadow-xl transition-all duration-300 p-6 border-4"
                        :class="apiStore.data.durum.aktif ? 'border-t-orange-500' : 'border-t-blue-500'">
                        
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="text-xl font-bold text-slate-800">Soba 1</h4>
                            <UIcon 
                                :name="apiStore.data.durum.aktif ? 'i-heroicons-fire' : 'ic:sharp-severe-cold'"
                                :class="apiStore.data.durum.aktif ? 'text-orange-500' : 'text-blue-500'" 
                                class="size-10"
                            />
                        </div>
                        
                        <div class="space-y-3 mb-4">
                            <div class="flex items-center gap-2">
                                <UIcon 
                                :name="apiStore.data.ayarlar.mod === 0 || apiStore.data.ayarlar.mod === 2 ? 'boxicons:robot' : 'wordpress:settings'"
                                :class="apiStore.data.ayarlar.mod === 0 || apiStore.data.ayarlar.mod === 2 ? 'text-orange-500' : 'text-blue-500'" 
                                class="size-10"
                            />
                                <div class="flex flex-col">
                                    <span class="text-xs text-slate-500">Mod</span>
                                    <span class="font-semibold text-slate-800">
                                        {{ 
                                            apiStore.data.ayarlar.mod === 2 ? 'Otomatik' : 
                                            apiStore.data.ayarlar.mod === 1 ? 'Manuel' : 
                                            'Isı Duyarlı'
                                        }}
                                    </span>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-2">
                                <div class="w-3 h-3 ml-1 rounded-full" :class="apiStore.data.durum.aktif ? 'bg-green-500' : 'bg-red-500'"></div>
                                <span class="text-slate-600">Durum:</span>
                                <span class="font-semibold" :class="apiStore.data.durum.aktif ? 'text-green-600' : 'text-red-600'">
                                    {{ apiStore.data.durum.aktif ? 'Aktif' : 'Kapalı' }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-fire" class="size-5 text-red-500"/>
                                <span class="text-slate-600">Sıcaklık:</span>
                                <span class="font-semibold text-slate-800">{{ apiStore.data.durum.isi }}°C</span>
                            </div>
                            
                            
                            <div class="flex items-center gap-2">
                                <UIcon name="i-heroicons-cube" class="size-5 text-amber-600"/>
                                <span class="text-slate-600">Boşaltma:</span>
                                <span class="font-semibold text-slate-800">{{ Math.round(60000 / apiStore.data.ayarlar.dakikada_atilan) }} ms</span>
                            </div>
                        </div>
                        
                        <UButton 
                            color="primary" 
                            label="Detaylar" 
                            icon="i-heroicons-information-circle" 
                            block
                            size="lg"
                            class="mt-4 rounded-full"
                            @click="detayStore.toggleDetay()"
                        />
                    </div>
                </div>
                
                <Detay v-if="detayStore.detay"/>
            </div>
        </div>
    </ClientOnly>
</template>