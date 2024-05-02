<script lang="ts">
   import Swiper from '$lib/Swiper.svelte';

  const images = [
    {
      img: "http://res.cloudinary.com/dz1nhhgwu/image/upload/v1713909021/gd1vzptrdpedza6s3wkf.jpg",
      width: 680,
      height: 680,
      alt: "Bad"
    },
    {
      img: "http://res.cloudinary.com/dz1nhhgwu/image/upload/v1713909021/gd1vzptrdpedza6s3wkf.jpg",
      width: 680,
      height: 680,
      alt: "Bad"
    },
    {
      img: "https://res.cloudinary.com/dr2cryzhk/video/upload/v1708625122/ezusbec0py8eny6tbo2z.mp4",
      width: 680,
      height: 680,
      alt: "Bad"
    },
    {
      img: "http://res.cloudinary.com/dz1nhhgwu/image/upload/v1713909021/gd1vzptrdpedza6s3wkf.jpg",
      width: 680,
      height: 680,
      alt: "Bad"
    },
  ]

</script>

<Swiper images={images} />

