import { ref as dbRef, onValue, off, set, update } from 'firebase/database'
import type { Soba, SobaAyarlar, SobaDurum } from '~/types/soba'

export const useApiStore = defineStore('ApiStore', () => {
  const { $db } = useNuxtApp()

  const data = ref<Soba>({
    ayarlar: {
      dolum_suresi: 0,
      mod: 0,
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

  let sobaRef: ReturnType<typeof dbRef> | null = null

  const start = () => {
    loading.value = true
    error.value = ''

    sobaRef = dbRef($db, 'soba1')

    onValue(
      sobaRef,
      (snapshot) => {
        data.value = snapshot.exists()
          ? (snapshot.val() as Soba)
          : {
              ayarlar: {
                dolum_suresi:0,
                mod: 0,
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
            }

        loading.value = false
      },
      (err) => {
        error.value = err.message || 'Veri alınamadı'
        loading.value = false
      }
    )
  }

  const stop = () => {
    if (sobaRef) {
      off(sobaRef)
      sobaRef = null
    }
  }

  const updateDurum = async (payload: Partial<SobaDurum>) => {
    error.value = ''

    try {
      await update(dbRef($db, 'soba1/durum'), payload)
    } catch (err: any) {
      error.value = err.message || 'Durum güncellenemedi'
    }
  }

  const updateAyarlar = async (payload: Partial<SobaAyarlar>) => {
    error.value = ''

    try {
      await update(dbRef($db, 'soba1/ayarlar'), payload)
    } catch (err: any) {
      error.value = err.message || 'Ayarlar güncellenemedi'
    }
  }

  const setAktif = async (val: boolean) => {
    await updateDurum({ aktif: val })
  }

  const setIsi = async (val: number) => {
    await updateDurum({ isi: val })
  }

  const setServo = async (val: number) => {
    error.value = ''

    try {
      await set(dbRef($db, 'soba1/durum/servo'), val)
    } catch (err: any) {
      error.value = err.message || 'Servo güncellenemedi'
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

  const setDoldur = async (val: number,val2 :boolean) => {
    await updateDurum({ servo: val })
    await updateDurum({ doldur: val2 })
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