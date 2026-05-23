# Pelet 🔥

Pelet, Firebase üzerinden gerçek zamanlı olarak pelet sobası kontrol ve izleme yapan bir Nuxt 3 uygulamasıdır.

## 📋 Özellikler

- ✅ **Gerçek Zamanlı Soba Kontrolü** - Firebase Realtime Database ile anında veri senkronizasyonu
- 🌡️ **Sıcaklık Takibi** - Mevcut sıcaklık, minimum ve maksimum sıcaklık değerleri
- ⚙️ **Ayarlar Yönetimi** - Dakikada atılan pelet miktarı, servo kontrolü
- 🎚️ **Servo Kontrolü** - Hava akışını ayarlama
- 🔒 **TypeScript Desteği** - Tam tip güvenliği
- 🎨 **Modern UI** - Nuxt UI ve Tailwind CSS ile şık arayüz

## 🚀 Başlangıç

### Gereksinimler
- Node.js 
- pnpm (veya npm/yarn)

### Kurulum

```bash
# Bağımlılıkları yükle
pnpm install

# Geliştirme sunucusunu başlat
pnpm dev

# Üretim için derle
pnpm build

# Üretim sunucusunu önizle
pnpm preview
```

## 📁 Proje Yapısı

```
app/
├── pages/          # Sayfalar
├── components/     # Vue bileşenleri
├── layouts/        # Sayfa düzenleri
├── stores/         # Pinia state management
│   └── api.ts      # API ve Firebase entegrasyonu
├── plugins/        # Firebase eklentisi
├── types/          # TypeScript tipleri
└── assets/         # Stil ve medya dosyaları
```

## 🔧 Ana Bileşenler

### API Store (`app/stores/api.ts`)

Pelet sobasının tüm verilerine ve kontrol işlevlerine erişimi sağlar.

**Veri Yapısı:**
```typescript
interface Soba {
  durum: {
    aktif: boolean        // Soba aktif mi?
    isi: number          // Sıcaklık (°C)
    servo: number        // Servo pozisyonu
  }
  ayarlar: {
    dakikada_atilan: number  // Dakikada atılan pelet
    max_sicaklik: number     // Maksimum sıcaklık
    min_sicaklik: number     // Minimum sıcaklık
  }
}
```

**Ana Fonksiyonlar:**
- `start()` - Firebase dinlemesini başlat
- `stop()` - Firebase dinlemesini durdur
- `setAktif(boolean)` - Sobaı aç/kapat
- `setIsi(number)` - Sıcaklık ayarla
- `setServo(number)` - Servo pozisyonunu ayarla
- `setMaxSicaklik(number)` - Maksimum sıcaklık ayarla
- `setMinSicaklik(number)` - Minimum sıcaklık ayarla
- `setDakikadaAtilan(number)` - Dakikada atılan pelet miktarı ayarla

**Computed Properties:**
- `isActive` - Soba aktif mi?
- `isTooHot` - Fazla sıcak mı?
- `isTooCold` - Fazla soğuk mu?
- `isInRange` - Sıcaklık uygun mu?

### Kullanım Örneği

```typescript
import { useApiStore } from '~/stores/api'

export default defineComponent({
  setup() {
    const apiStore = useApiStore()

    onMounted(() => {
      apiStore.start() // Firebase dinlemesini başlat
    })

    onUnmounted(() => {
      apiStore.stop() // Dinlemeyi durdur
    })

    const controlStove = async () => {
      await apiStore.setAktif(true)
      await apiStore.setMaxSicaklik(40)
    }

    return {
      sobaData: apiStore.data,
      isTooHot: apiStore.isTooHot,
      controlStove
    }
  }
})
```

## 🔌 Firebase Konfigürasyonu

Firebase bağlantısı `app/plugins/firebase.client.ts` dosyasında yapılandırılır. Uygulamayı çalıştırmak için Firebase yapılandırmasını güncelleyin.

**Gerekli Firebase Kurulum:**
- Authentication
- Realtime Database
- Database Rules (güvenlik kuralları)

## 📦 Teknolojiler

| Teknoloji | Sürüm | Açıklama |
|-----------|-------|----------|
| Nuxt | ^4.3.1 | Vue3 framework |
| Vue | ^3.5.29 | JavaScript framework |
| Firebase | ^12.11.0 | Backend ve realtime database |
| Pinia | 0.11.3 | State management |
| Nuxt UI | ^4.5.1 | UI bileşenleri |
| Tailwind CSS | ^4.2.1 | Stil çatısı |

## 🛠️ Geliştirme

### Debug Modu
```bash
pnpm dev
# http://localhost:3000 adresinde uygulamaya erişin
```

### Derleme ve Optimizasyon
```bash
pnpm build
pnpm preview
```