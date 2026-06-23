<script lang="ts">
  let { src }: { src: string } = $props();
</script>

<div style={`--image: url(${src})`} class="revert"></div>

<style>
  div {
    background-size: cover;
    background-image: var(--image);

    width: 100%;
    height: 100%;
    background-position: center center;
  }
</style>
