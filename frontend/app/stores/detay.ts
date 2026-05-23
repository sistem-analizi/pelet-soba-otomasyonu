export const useDetayStore = defineStore('DetayStore    ', () => {
    const detay = ref(false);

    function toggleDetay() {
        detay.value = !detay.value;
        console.log("Detay durumu:", detay.value);
    }

    return {
        detay,
        toggleDetay,
    }
})