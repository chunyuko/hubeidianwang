<template>
  <div>
    <bread-crumb></bread-crumb>
    <div style="padding: 0px 20px">
      <a-card :bordered="false" id="filterCom" style="overflow: hidden; position: relative">
        <div class="table-operator">
          <a-button-group>
            <a-button type="primary" @click="handleAdd">
              <a-icon type="plus" />
              新增
            </a-button>
          </a-button-group>
          <a-dropdown v-if="selectedRowKeys.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" @click="delAll">
                <a-icon type="delete" />
                删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <h-table
          ref="table"
          size="default"
          rowKey="id"
          :columns="columns"
          :data="loadData"
          :alert="true"
          :rowSelection="rowSelection"
          showPagination="auto"
        >
          <span slot="serial" slot-scope="text, record, index">
            {{ index + 1 }}
          </span>
          <span slot="address" slot-scope="text">
            <ellipsis :length="6" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="extra" slot-scope="text">
            <ellipsis :length="6" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="time" slot-scope="text">
            <ellipsis :length="6" tooltip>{{ text }}</ellipsis>
          </span>
          <span slot="develop" slot-scope="text, record">
            <template>
              <a-tooltip>
                <template slot="title">编辑</template>
                <a-icon type="edit" @click="handleDevelop(record)" style="font-size: 16px"></a-icon>
              </a-tooltip>
            </template>
          </span>
          <span slot="manage" slot-scope="text, record">
            <template>
              <a-tooltip>
                <template slot="title">编辑</template>
                <a-icon type="edit" @click="handleManage(record)" style="font-size: 16px"></a-icon>
              </a-tooltip>
            </template>
          </span>
          <span slot="info" slot-scope="text, record">
            <template>
              <a-tooltip>
                <template slot="title">编辑</template>
                <a-icon type="edit" @click="handleInfo(record)" style="font-size: 16px"></a-icon>
              </a-tooltip>
            </template>
          </span>
          <span slot="action" slot-scope="text, record">
            <template>
              <a-tooltip>
                <template slot="title">编辑</template>
                <a-icon type="edit" @click="handleEdit(record)" style="font-size: 16px"></a-icon>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip>
                <template slot="title">删除</template>
                <a-popconfirm title="是否删除该数据？" ok-text="确定" cancel-text="取消" @confirm="handleDel(record)">
                  <a-icon type="delete" @click="selectRow(record)" v-if="!asking" style="font-size: 16px"></a-icon>
                  <a-icon type="loading" v-else></a-icon>
                </a-popconfirm>
              </a-tooltip>
            </template>
          </span>
        </h-table>
        <h-form-modal
          ref="createModal"
          :visible="visible"
          :loading="confirmLoading"
          :models="models"
          :configs="configs"
          @cancel="handleCancel"
          :handle="oked"
          :type="type"
          :typeTitle="typeTitle"
          :initModel="initModel"
        />
      </a-card>
    </div>
  </div>
</template>

<script>
import { Ellipsis, HFormModal, HTable } from "@/libs/components";
import { columns, parseFields } from "@/config/options/safe.js";
import BreadCrumb from "@/views/Components/BreadCrumb";

export default {
  provide() {
    return {
      src: {
        grouped: () => this.grouped,
      },
    };
  },
  components: {
    HTable,
    Ellipsis,
    HFormModal,
    BreadCrumb,
  },
  data() {
    this.columns = columns;
    let [models, configs] = parseFields();
    return {
      total: 0,
      eleLoading: false,
      asking: false,
      eleVisible: false,
      eleForm: {},
      initModel: Object.assign({}, models),
      grouped: [],
      models,
      configs,
      type: "add",
      typeTitle: "新增",
      visible: false,
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam);
        return this.$store.dispatch("list_safe", requestParameters).then((res) => {
          return Promise.resolve(res);
        });
      },
      selectedRowKeys: [],
      selectedRows: [],
      rules: {
        tag: [{ required: true, message: "请输入设备标识", trigger: "change" }],
      },
    };
  },
  created() {},
  mounted() {},
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  methods: {
    showElec() {
      this.eleForm = {};
      this.eleVisible = true;
    },
    handlejump(record) {
      localStorage.setItem("tenDatas", record.id);
      this.contentRow = record;
      this.selectRow(record);
    },
    handleManage(record) {
      this.$router.push({
        name: "manage",
        params: { tenDatas: record.id },
      });
      this.handlejump(record);
    },
    handleInfo(record) {
      this.$router.push({
        name: "info",
        params: { tenDatas: record.id },
      });
      this.handlejump(record);
    },
    handleDevelop(record) {
      this.$router.push({
        name: "develop",
        params: { tenDatas: record.id },
      });
      this.handlejump(record);
    },
    handleAdd() {
      this.visible = true;
      this.type = "add";
      this.typeTitle = "新增";
    },
    handleEdit(record) {
      this.selectRow(record);
      this.visible = true;

      this.models = { ...record };
      this.type = "update";
      this.typeTitle = "编辑：" + this.models.title;
    },
    delAll() {
      this.$confirm({
        title: `确定删除所选${this.selectedRowKeys.length}项吗?`,
        content: () => <div style="color:red;">删除{this.getSelectBy("title").join("，")}后数据无法恢复</div>,
        onOk: () => {
          this.asking = true;
          this.sumbit({ ids: this.selectedRowKeys }, "del_multi");
        },
        onCancel() {},
        cancelText: "取消",
        okText: "确定",
      });
    },
    oked(vals, form) {
      return this.sumbit(vals, form.type);
    },
    handleCancel() {
      this.visible = false;
    },
    handleDel(vals) {
      this.asking = true;
      this.sumbit(vals, "del");
    },
    sumbit(vals, type) {
      let table = this.$refs.table;
      vals["pages"] = { pageNo: table.localPagination.current, pageSize: table.localPagination.pageSize };
      return this.$store.dispatch(type + "_safe", vals).then((res) => {
        this.$refs.filtrate && this.$refs.filtrate.reload(res.data);
        // 刷新表格
        table.refresh();
        // this.onClose(res.data);
        // this.$message.info(type + "成功");
        this.visible && this.handleCancel(type);
        type.indexOf("del") > -1 && this.resetSelect();
        this.asking = false;
        this.models = { ...this.initModel };
        return Promise.resolve(res);
      });
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    selectRow(record) {
      this.selectedRowKeys = [record.id];
      this.selectedRows = [record];
      this.$refs.table.updateSelect(this.selectedRowKeys, this.selectedRows);
    },
    resetSelect() {
      this.selectedRowKeys = [];
      this.selectedRows = [];
      this.$refs.table.updateSelect(this.selectedRowKeys, this.selectedRows);
    },
    getSelectBy(name) {
      return this.selectedRows.map((val) => val[name]);
    },
  },
};
</script>

<style scoped>
.table-operator {
  margin: 20px 0;
}
</style>
