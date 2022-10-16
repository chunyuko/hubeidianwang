<template>
  <div>
    <div v-for="(val, index) in values" :key="index">
      <a-form-item v-if="val.type == 'radio'">
        <label slot="label" :for="val._name_" :title="val.tip ? val.tip : val.label">{{ val.label }}</label>
        <a-radio-group v-decorator="[`${val._name_}`, val.decorator]">
          <a-radio v-for="(v, i) in getData(val)" :key="i" :value="v.value">{{ v.label }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-else-if="val.type == 'radioBtn'">
        <label slot="label" :for="val._name_" :title="val.tip ? val.tip : val.label">{{ val.label }}</label>
        <a-radio-group v-decorator="[`${val._name_}`, val.decorator]">
          <a-radio-button v-for="(v, i) in getData(val)" :key="i" :value="v.value">
            {{ v.label }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-else-if="val.type == 'select'">
        <label slot="label" :for="val._name_" :title="val.tip ? val.tip : val.label">{{ val.label }}</label>
        <a-select v-decorator="[`${val._name_}`, val.decorator]" :placeholder="val.placeholder">
          <a-select-option v-for="(v, i) in getData(val)" :key="i" :value="v.value">{{ v.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <div v-else-if="val.type == 'upload'">
        <h-up-load :option="val" />
      </div>
      <a-form-item v-else>
        <label slot="label" :for="val._name_" :title="val.tip ? val.tip : val.label">{{ val.label }}</label>
        <a-input
          v-decorator="[`${val._name_}`, val.decorator]"
          :placeholder="val.placeholder"
          :disabled="val.disabled"
          :type="val.type"
        />
      </a-form-item>
    </div>
  </div>
</template>

<script>
import { is } from "@/core/utils";
import HUpLoad from "./UpLoad.vue";
export default {
  name: "HFormItem",
  components: { HUpLoad },
  props: {
    type: {
      type: String,
      default: "input",
    },
    value: {
      type: Object,
      default: () => {},
    },
    values: {
      type: Array,
      default: () => [],
    },
  },
  inject: ["src"],
  data() {
    return {
      // lists: [],
    };
  },
  methods: {
    getData(val) {
      // console.log(
      //   "???>>>",
      //   val.src,
      //   val.data,
      //   val.src ? (is(this.src[val._name_], "function") ? this.src[val._name_](val) : this.src[val._name_]) : val.data
      // );
      return val.src
        ? is(this.src[val._name_], "function")
          ? this.src[val._name_](val)
          : this.src[val._name_]
        : val.data;
    },
    // upChange(info) {
    //   let fileList = [...info.fileList];
    //   // 限制上传数量
    //   fileList = fileList.slice(-2);
    //   // 读取远程路径并显示链接
    //   fileList = fileList.map((file) => {
    //     if (file.response) {
    //       file.url = file.response.url;
    //     }
    //     return file;
    //   });
    //   this.lists = fileList;
    //   info.fileList = fileList;
    // },
    // upBefore(file) {
    //   // 关闭自动上传
    //   this.lists = [...this.lists, file];
    //   return false;
    // },
    // upRemove(file) {
    //   const index = this.lists.indexOf(file);
    //   const copy_list = this.lists.slice();
    //   copy_list.splice(index, 1);
    //   this.lists = copy_list;
    // },
    // normFile(e) {
    //   if (Array.isArray(e)) {
    //     return e;
    //   }
    //   return e && e.fileList;
    // },
  },
};
</script>

<style scoped></style>
