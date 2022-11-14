<template>
  <a-form-item>
    <div slot="extra" v-if="option.tip" style="padding-top: 5px">{{ option.tip }}</div>
    <label slot="label" :for="option._name_" :title="option.tip ? option.tip : option.label">
      <span>
        {{ option.label }}
      </span>
    </label>
    <!-- <a-upload
          :name="val._name_"
          :action="val.action ? val.action : '#'"
          :headers="val.headers ? val.headers : {}"
          @change="upChange"
          :before-upload="upBefore"
          :remove="upRemove"
          :file-list="fileList"
          v-decorator="[`${val._name_}`, { valuePropName: 'upList', getValueFromEvent: normFile }]"
        > -->
    <a-upload
      :multiple="true"
      :name="option._name_"
      :action="option.action ? option.action : '#'"
      :headers="option.headers ? option.headers : {}"
      @change="upChange"
      @reject="reject"
      :before-upload="upBefore"
      :remove="upRemove"
      :list-type="listType"
      :showUploadList="option.showUploadList ? option.showUploadList : showUploadList"
      :accept="option.accept"
      v-decorator="[`${option._name_}`, { valuePropName: 'fileList', getValueFromEvent: normFile }]"
    >
      <a-button>
        <a-icon type="upload" />
        {{ text }}
      </a-button>
    </a-upload>
  </a-form-item>
</template>

<script>
export default {
  props: {
    option: {
      type: Object,
      default: () => {},
    },
    text: {
      type: String,
      default: "点击选择",
    },
    number: {
      type: Number,
      default: 1,
    },
    size: {
      type: Number,
      default: 0,
    },
  },
  name: "HUpLoad",
  computed: {
    listType() {
      return ["text", "picture", "picture-card"].includes(this.option.listType) ? this.option.listType : "text";
    },
    num() {
      return this.option.number ? this.option.number : this.number;
    },
    sizes() {
      let size = parseInt(this.option.size);
      return size ? size : this.size;
    },
  },
  data() {
    return {
      // lists: [{ uid: "-1", name: "1.png", status: "done", url: "/statics/image/1.jpg" }],
      showUploadList: { showPreviewIcon: true, showRemoveIcon: true },
      lists: [],
    };
  },
  methods: {
    upChange(info) {
      let curF = info.file;
      let fileList = [...info.fileList];
      // 限制上传数量
      fileList = fileList.slice(-this.num);
      // 读取远程路径并显示链接
      fileList = fileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      // const fileType = info.file.name.substring(info.file.name.lastIndexOf("."));
      // let type = [];
      // let option = JSON.parse(JSON.stringify(this.option.accept));
      // type = option.split(",");
      // console.log(type, fileType);
      // if (type.indexOf(fileType) === -1) {
      //   console.log(1);
      //   this.$message.error("上传文件不符合格式，请删除重选，此文件不会处理");
      //   return false;
      // }

      // 限制上传大小
      let isLtM = this.sizes ? curF.size / 1024 / 1024 < this.sizes : true;
      if (!isLtM) {
        this.$message.error(curF.name + "大小需要小于" + this.sizes + "M");
        console.log(">>>CURF>>", fileList, curF, fileList.indexOf(curF));
      }
      fileList = fileList.filter((file) => {
        return this.sizes ? file.size / 1024 / 1024 < this.sizes : true;
      });

      this.lists = fileList;
      info.fileList = fileList;
    },
    //不符合时候的回调
    reject() {
      this.$message.error("上传文件不符合格式，请注意上传的类型（图片或视频）");
    },
    upBefore(file) {
      //限制上传的格式
      // console.log(URL.createObjectURL(file));
      const fileType = file.name.substring(file.name.lastIndexOf("."));
      let type = [];
      let option = JSON.parse(JSON.stringify(this.option.accept));
      type = option.split(",");
      console.log(type, fileType);
      if (type.indexOf(fileType) === -1) {
        console.log(1);
        this.$message.error("上传文件不符合格式，请删除重选，此文件不会处理");
        return false;
      }
      // 关闭自动上传
      this.lists = [...this.lists, file];
      return false;
    },
    upRemove(file) {
      const index = this.lists.indexOf(file);
      const copy_list = this.lists.slice();
      copy_list.splice(index, 1);
      this.lists = copy_list;
    },
    normFile(e) {
      if (Array.isArray(e)) {
        return e;
      }
      return e && e.fileList;
    },
    inform(e) {
      // console.log(e);
    },
  },
};
</script>
<style scoped></style>
