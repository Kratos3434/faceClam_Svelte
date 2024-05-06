<script lang="ts">
  import emblaCarouselSvelte from 'embla-carousel-svelte';

  interface ImagesProps {
    img: string,
    width: number,
    height: number,
    alt: string
  }

  export let images: ImagesProps[];
  let emblaApi: any;
  let selectedIndex = 0;

  function onInit(event: any) {
    emblaApi = event.detail
    emblaApi.on('scroll', () => {
      selectedIndex = emblaApi.selectedScrollSnap();
    })
  }
</script>

{#if images.length === 1}
  {#if images[0].img.substring(images[0].img.lastIndexOf('.')) === '.mp4'}
    <video width={images[0].width} height={images[0].height} controls style={`width: ${images[0].width}px;height: ${images[0].height}px;object-fit: fill;`}>
      <source src={`https${images[0].img.substring(images[0].img.indexOf(':'))}`} type="video/mp4" />
      <track kind="captions" />
    </video>
  {:else}
    <img src={images[0].img} width={images[0].width} height={images[0].height} alt={images[0].alt} style={`width: ${images[0].width}px;height: ${images[0].height}px`} />
  {/if}
{:else}
<div class="embla tw-relative" use:emblaCarouselSvelte on:emblaInit="{onInit}">
  <div class="embla__container">
    {#each images as image }
      <div class="embla__slide">
        {#if image.img.substring(image.img.lastIndexOf('.')) === '.mp4'}
          <video width={image.width} height={image.height} controls style={`width: ${image.width}px;height: ${image.height}px;object-fit: fill;`}>
            <source src={`https${image.img.substring(image.img.indexOf(':'))}`} type="video/mp4" />
            <track kind="captions" />
          </video>
        {:else}
          <img src={image.img} width={image.width} height={image.height} alt={image.alt} style={`width: ${image.width}px;height: ${image.height}px`} />
        {/if}
      </div>
    {/each}
  </div>
  <div class="tw-absolute tw-flex tw-justify-center tw-w-full tw-bottom-3 tw-gap-2">
    {#each images as _, idx }
      <div class={`tw-p-1 tw-rounded-[1000px] ${selectedIndex === idx ? "tw-bg-blue-600" : "tw-bg-gray-400"} tw-w-[10px] tw-h-[10px]`}></div>
    {/each}
  </div>
</div>
{/if}

<style>
 .embla {
   overflow: hidden;
   width: 100%;
   height: 100%;
 }
 .embla__container {
   display: flex;
   width: 100%;
   height: 100%;
 }
 .embla__slide {
   flex: 0 0 100%;
   min-width: 0;
 }
</style>
