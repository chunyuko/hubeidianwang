<template>
  <div>
    <a-modal
      :visible="visible"
      title="像素配置"
      @ok="handleConfig"
      okText="确认"
      cancelText="取消"
      @cancel="handleCancel"
      :z-index="zIndex"
    >
      <a-form-model :model="formData" ref="configForm">
        <a-form-model-item label="视频像素宽" :rules="rules.px">
          <a-input v-model="formData.vwidth" placeholder="请输入像素宽" />
        </a-form-model-item>
        <a-form-model-item label="视频像素高" :rules="rules.px">
          <a-input v-model="formData.vheight" placeholder="请输入像素高" />
        </a-form-model-item>
        <a-form-model-item label="图片像素宽" :rules="rules.px">
          <a-input v-model="formData.mwidth" placeholder="请输入像素宽" />
        </a-form-model-item>
        <a-form-model-item label="图片像素高" :rules="rules.px">
          <a-input v-model="formData.mheight" placeholder="请输入像素高" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "TenSafePxConfig",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 1000,
    },
    handle: {
      type: Function,
      default: () => {},
    },
    form: {
      type: Object,
    },
  },
  data() {
    return {
      rules: {
        px: [{ type: "Number", message: "请输入数字", trigger: "blur" }],
      },
      formData: this.form,
    };
  },

  mounted() {},
  watch: {
    form() {
      this.formData = this.form;
    },
  },

  methods: {
    handleConfig() {
      let username = this.$store.getters.userInfo.name;
      console.log(this.formData);
      localStorage.setItem(username, JSON.stringify(this.formData));
      this.handle();
    },
    handleCancel() {
      if (this.isLoading) {
        return false;
      }
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="scss" scoped></style>
