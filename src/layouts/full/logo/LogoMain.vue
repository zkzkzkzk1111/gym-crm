<script setup>
const props= defineProps({
  miniSidebar: false
})

</script>
  <template>
  <div class="logo">
    <RouterLink to="/" >
     
    <div>
    <v-avatar size="small" class="mr-2">
    <img style="width:35px;, height:35px;" src="https://cdn.imweb.me/thumbnail/20250703/e93fae7849867.png"  /></v-avatar>
     <v-label v-if="!props.miniSidebar" class="secondary text-h4 cursor-pointer">DiteGym</v-label>
    </div>
    </RouterLink>
  </div>
</template>

