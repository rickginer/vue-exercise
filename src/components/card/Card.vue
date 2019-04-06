<template>
  <div class="card">
    <div class="title">
      <slot name="title">
        Default title
      </slot>
    </div>

    <div class="content">
      <slot name="content">
        Default Content
      </slot>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.card {
  display: flex;
  flex-direction: column;
  margin: 2px 2px 20px 2px;
  border: solid 1px #ccc;
  border-radius: 4px;
  box-shadow: 0px 0px 5px -1px rgba(0,0,0,0.75);

  justify-content: center;

  > * {
    padding: 5px;
  }

  .title {
    font-size: 0.8em;
    border-bottom: solid 1px #ccc;
  }

  .content {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
    text-align: center;
    min-height: 50px;
  }
}
</style>
