export interface SobaDurum {
  doldur:boolean
  aktif: boolean
  isi: number
  servo: number
}

export interface SobaAyarlar {
  dolum_suresi:number
  mod:number
  dakikada_atilan: number
  max_sicaklik: number
  min_sicaklik: number
}

export interface Soba {
  durum: SobaDurum
  ayarlar: SobaAyarlar
}