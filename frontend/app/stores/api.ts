import type { Soba, SobaAyarlar, SobaDurum } from '~/types/soba'

export const useApiStore = defineStore('ApiStore', () => {
  const config = useRuntimeConfig()
  const PHP_API = config.public.phpApiUrl as string

  const data = ref<Soba>({
    ayarlar: {
      dolum_suresi: 0,
      mod: 2,
      dakikada_atilan: 0,
      max_sicaklik: 0,
      min_sicaklik: 0,
    },
    durum: {
      aktif: false,
      doldur: false,
      isi: 0,
      servo: 0,
    },
  })

  const loading = ref(false)
  const error = ref('')
  let pollingInterval: NodeJS.Timeout | null = null
  let isUpdating = ref(false)

  // Veri getir (updating sırasında atlanır)
  const fetchData = async () => {
    // Updating sırasında çekme
    if (isUpdating.value) return

    try {
      const response = await fetch(`${PHP_API}/soba1`)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const result = await response.json()
      data.value = result
      error.value = ''
      return result
    } catch (err: any) {
      error.value = `Hata: ${err.message}`
      console.error('Fetch error:', err)
      throw err
    }
  }

  const start = async () => {
    loading.value = true
    try {
      await fetchData()
    } catch (err) {
      console.error('İlk veri çekme başarısız')
    } finally {
      loading.value = false
    }
    
    // Polling: Her 2 saniyede veri çek
    if (process.client) {
      pollingInterval = setInterval(() => {
        fetchData().catch(() => {
          console.error('Polling başarısız')
        })
      }, 2000)
    }
  }

  const stop = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval)
      pollingInterval = null
    }
  }

  const updateDurum = async (payload: Partial<SobaDurum>) => {
    try {
      isUpdating.value = true
      const response = await fetch(`${PHP_API}/soba1/durum`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) throw new Error('Durum güncellenemedi')
      error.value = ''
    } catch (err: any) {
      error.value = err.message
      console.error('Update durum error:', err)
    } finally {
      isUpdating.value = false
      // Update bittikten sonra bir kez veri çek
      await fetchData()
    }
  }

  const updateAyarlar = async (payload: Partial<SobaAyarlar>) => {
    try {
      isUpdating.value = true
      const response = await fetch(`${PHP_API}/soba1/ayarlar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!response.ok) throw new Error('Ayarlar güncellenemedi')
      error.value = ''
    } catch (err: any) {
      error.value = err.message
      console.error('Update ayarlar error:', err)
    } finally {
      isUpdating.value = false
      // Update bittikten sonra bir kez veri çek
      await fetchData()
    }
  }

  const setAktif = async (val: boolean) => {
    await updateDurum({ aktif: val })
  }

  const setIsi = async (val: number) => {
    await updateDurum({ isi: val })
  }

  const setServo = async (val: number) => {
    try {
      isUpdating.value = true
      const response = await fetch(`${PHP_API}/soba1/durum/servo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servo: val })
      })
      if (!response.ok) throw new Error('Servo güncellenemedi')
      error.value = ''
    } catch (err: any) {
      error.value = err.message
      console.error('Set servo error:', err)
    } finally {
      isUpdating.value = false
      await fetchData()
    }
  }

  const setMaxSicaklik = async (val: number) => {
    await updateAyarlar({ max_sicaklik: val })
  }

  const setMinSicaklik = async (val: number) => {
    await updateAyarlar({ min_sicaklik: val })
  }

  const setDakikadaAtilan = async (val: number) => {
    await updateAyarlar({ dakikada_atilan: val })
  }

  const setDolumSuresi = async (val: number) => {
    await updateAyarlar({ dolum_suresi: val })
  }

  const setMod = async (val: number) => {
    await updateAyarlar({ mod: val })
  }

  const setDoldur = async (val: number, val2: boolean) => {
    try {
      isUpdating.value = true
      const response = await fetch(`${PHP_API}/soba1/durum`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ servo: val, doldur: val2 })
      })
      if (!response.ok) throw new Error('Doldur güncellenemedi')
      error.value = ''
    } catch (err: any) {
      error.value = err.message
      console.error('Set doldur error:', err)
    } finally {
      isUpdating.value = false
      await fetchData()
    }
  }

  const isActive = computed(() => data.value.durum.aktif)

  const isTooHot = computed(() => {
    return data.value.durum.isi > data.value.ayarlar.max_sicaklik
  })

  const isTooCold = computed(() => {
    return data.value.durum.isi < data.value.ayarlar.min_sicaklik
  })

  const isInRange = computed(() => {
    return !isTooHot.value && !isTooCold.value
  })

  return {
    data,
    loading,
    error,

    start,
    stop,

    updateDurum,
    updateAyarlar,

    setAktif,
    setIsi,
    setServo,

    setMaxSicaklik,
    setMinSicaklik,
    setDakikadaAtilan,
    setDolumSuresi,
    setMod,
    setDoldur,

    isActive,
    isTooHot,
    isTooCold,
    isInRange,
  }
})