<template>
  <div class="header">
    <!-- <a herf="javascript:0;" style="margin-right: 20px">
      <a-icon type="user"></a-icon>
      admin
    </a> -->
    <a-dropdown>
      <a class="ant-dropdown-link" @click="(e) => e.preventDefault()" style="margin-right: 20px">
        <a-icon type="user" />
        {{ loginUser }}
        <a-icon type="down" />
      </a>
      <a-menu slot="overlay" @click="onClick">
        <a-menu-item key="3">
          <a-icon type="redo" />
          转换数据
        </a-menu-item>
        <a-menu-item key="1">
          <a-icon type="edit" />
          修改信息
        </a-menu-item>
        <a-menu-item key="2">
          <a-icon type="logout" />
          退出
        </a-menu-item>
        <a-menu-item key="4">
          <a-icon type="upload" />
          上传配置
        </a-menu-item>

        <!-- <a-menu-item key="2">2nd menu item</a-menu-item>
        <a-menu-item key="3">3rd menu item</a-menu-item> -->
      </a-menu>
    </a-dropdown>
    <a-modal :visible="pwdVisible" title="修改密码" @ok="handleOk" okText="确认" cancelText="取消" @cancel="close">
      <a-form-model :model="addForm" ref="ruleForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-model-item label="旧密码" prop="password">
          <a-input-password v-model="addForm.password" placeholder="请输入旧密码" />
        </a-form-model-item>
        <a-form-model-item label="新密码" :rules="rules.newPassword">
          <a-input-password v-model="password" placeholder="请输入新密码" />
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="newpwd">
          <a-input-password v-model="addForm.newpwd" placeholder="请输入新密码" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
    <!-- <a-modal
      :visible="visible"
      title="像素配置"
      @ok="handleConfig"
      okText="确认"
      cancelText="取消"
      @cancel="closevisible"
    >
      <a-form-model :model="form" ref="configForm" :label-col="labelCol" :wrapper-col="wrapperCol">
       
        <a-form-model-item label="视频像素宽">
          <a-input v-model="form.vwidth" placeholder="请输入像素宽" />
        </a-form-model-item>
        <a-form-model-item label="视频像素高">
          <a-input v-model="form.vheight" placeholder="请输入像素高" />
        </a-form-model-item>
        <a-form-model-item label="图片像素宽">
          <a-input v-model="form.mwidth" placeholder="请输入像素宽" />
        </a-form-model-item>
        <a-form-model-item label="图片像素高">
          <a-input v-model="form.mheight" placeholder="请输入像素高" />
        </a-form-model-item>
      </a-form-model>
    </a-modal> -->
    <PxConfig :form="form" :visible="visible" :handle="oked" @cancel="closevisible"></PxConfig>
  </div>
</template>

<script>
import api from "@/libs/api";
import PxConfig from "@/components/layouts/PxConfig.vue";
export default {
  components: {
    PxConfig,
  },
  data() {
    return {
      form: {
        isstart: "",
        mheight: null,
        mwidth: null,
        vheight: null,
        vwidth: null,
      },
      loginUser: null,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
      pwdVisible: false,
      disabled: true,
      visible: false,
      addForm: { id: null },
      password: null,
      select: [
        { value: 1, label: "yes" },
        { value: 2, label: "no" },
      ],
      rules: {
        password: [
          { required: true, message: "请输入旧密码", trigger: "change" },
          { min: 5, max: 15, message: "长度为5-15字符", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "change" },
          { min: 5, max: 15, message: "长度为5-15字符", trigger: "blur" },
        ],
        newpwd: [
          { required: true, message: "请输入新密码", trigger: "change" },
          { min: 5, max: 15, message: "长度为5-15字符", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.loginUser = this.$store.getters.userInfo.nickname;
  },
  methods: {
    // handleChange(value) {
    //   if (value === 1) {
    //     this.disabled = false;
    //   } else this.disabled = true;
    // },
    oked() {
      this.visible = false;
    },
    onClick(e) {
      let { key } = e;
      if (key == 2) {
        this.$store.dispatch("logout").then((res) => {
          if (res.success) {
            this.$store.commit("setUser", {});
            this.$router.push("/user/login");
          }
        });
      } else if (key == 3) {
        api.toapi.list();
      } else if (key == 4) {
        let username = this.$store.getters.userInfo.name;
        this.visible = true;
        if (JSON.parse(localStorage.getItem(username))) {
          this.form = JSON.parse(localStorage.getItem(username));
          console.log(this.form);
        }
      } else {
        this.addForm.id = this.$store.getters.userInfo.id;
        this.pwdVisible = true;
      }
    },
    handleOk() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.password === this.addForm.newpwd) {
            const vals = this.addForm;
            this.$store.dispatch("change_rights", vals).then((res) => {
              // 刷新表格
              return Promise.resolve(res);
            });
            this.$store.dispatch("logout").then((res) => {
              if (res.success) {
                this.$store.commit("setUser", {});
                this.$router.push("/user/login");
              }
            });
          } else {
            this.$message.error("前后密码不一致");
          }
        }
      });
    },
    close(e) {
      this.pwdVisible = false;
    },
    closevisible(e) {
      this.visible = false;
    },
  },
};
</script>

<style scoped>
.header {
  float: right;
}
</style>
