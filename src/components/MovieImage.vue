<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  imgClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['error']);

const imageSrc = ref(props.src);
const imageError = ref(false);

const isValidImage = (url) => {
  return url && url !== 'N/A' && !url.includes('notfound') && url.startsWith('http');
};

const loadImage = () => {
  if (!isValidImage(props.src)) {
    imageError.value = true;
    imageSrc.value = getDefaultImage();
    return;
  }

  imageSrc.value = props.src;
};

const getDefaultImage = () => {
  return (
    'data:image/svg+xml;base64,' +
    'PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQ1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48' +
    'cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHBhdGggZD0iTTAgMGgzMDB2' +
    'NDUwSDB6IiBzdHlsZT0iZmlsbDojZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJB' +
    'cmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0i' +
    'PkltYWdlIG5vdCBhdmFpbGFibGU8L3RleHQ+PC9zdmc+'
  );
};

const handleError = (event) => {
  imageError.value = true;
  imageSrc.value = getDefaultImage();
  emit('error', event);
};

onMounted(() => {
  loadImage();
});
</script>

<template>
  <img :src="imageSrc" :alt="alt" :class="imgClass" @error="handleError" />
</template>
