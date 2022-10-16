<template>
  <div>
    <bread-crumb></bread-crumb>
    <div style="padding: 0px 20px">
      <a-card :bordered="false" id="filterCom" style="overflow: hidden; position: relative">
        <div class="table-operator">
          <a-button-group>
            <a-button type="primary" @click="returnback">
              <a-icon type="rollback" />
              返回
            </a-button>
            <a-button type="primary" @click="showContent">
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
          <span slot="ppt" slot-scope="text, record">
            <template>
              <a-tooltip>
                <template slot="title">编辑</template>
                <a-icon type="edit" @click="handlePPt(record)" style="font-size: 16px"></a-icon>
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
          :destroy="destroy"
          :initModel="initModel"
          :footer="undefined"
          :zIndex="1001"
        ></h-form-modal>
      </a-card>
      <a-drawer placement="right" :visible="view_next" @close="close_view_detail" width="550">
        <a-card style="width: 100%" :bordered="false" tabPosition="left" :loading="cardLoading">
          <a slot="extra" href="#">
            <a-tooltip>
              <template slot="title">添加素材</template>
              <a-icon type="plus" @click="showContent()" style="font-size: 16px"></a-icon>
            </a-tooltip>
            <a-divider type="vertical" />
            <a-tooltip>
              <template slot="title">删除素材</template>
              <a-popconfirm title="是否删除选中数据？" ok-text="确定" cancel-text="取消" @confirm="delMedia">
                <a-icon type="delete" style="font-size: 16px" v-if="!asking"></a-icon>
                <a-icon type="loading" style="font-size: 16px" v-else></a-icon>
              </a-popconfirm>
            </a-tooltip>
          </a>
          <a-list item-layout="horizontal" :data-source="dataNext[tabnextKey]" :bordered="false">
            <a-list-item slot="renderItem" slot-scope="item, index">
              <a slot="actions">
                <a-checkbox
                  @change="(e) => checkRulenextMedia(e, item, index)"
                  :checked="checkednextKeys.indexOf(item.id) >= 0 ? true : false"
                />
              </a>
              <a-tooltip slot="actions">
                <template slot="title">编辑</template>
                <a-icon style="font-size: 16px" type="edit" @click="handlenextEdit(item)"></a-icon>
              </a-tooltip>
              <a-tooltip slot="actions">
                <template slot="title">配置</template>
                <a-icon style="font-size: 16px" type="diff" @click="handleMore(item)"></a-icon>
              </a-tooltip>
              <a-tooltip slot="actions">
                <template slot="title">删除</template>
                <a-popconfirm
                  title="是否删除该数据？"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="handleDell(item)"
                  @visibleChange="(e) => shownextPop(e, item)"
                >
                  <a-icon type="delete" style="font-size: 16px" v-if="!asking"></a-icon>
                  <a-icon type="loading" style="font-size: 16px" v-else></a-icon>
                </a-popconfirm>
              </a-tooltip>

              <a-list-item-meta :description="item.number">
                <a slot="title">{{ item.title }}</a>
                <a-avatar
                  class="card-avatar"
                  slot="avatar"
                  style="color: #f56a00; background-color: #fde3cf"
                  size="default"
                >
                  C
                </a-avatar>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </a-card>
        <div
          :style="{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: '100%',
            borderTop: '1px solid #e9e9e9',
            padding: '10px 16px',
            background: '#fff',
            textAlign: 'right',
            zIndex: 1,
          }"
        >
          <a-button type="primary" @click="close_view_detail">关闭</a-button>
        </div>
        <a-drawer placement="right" :visible="view_more" @close="close_view_more" width="550">
          <a-card style="width: 100%" :bordered="false" tabPosition="left" :loading="cardLoading">
            <a slot="extra" href="#">
              <a-tooltip>
                <template slot="title">添加素材</template>
                <a-icon type="plus" @click="showContent()" style="font-size: 16px"></a-icon>
              </a-tooltip>
              <a-divider type="vertical" />
              <a-tooltip>
                <template slot="title">删除素材</template>
                <a-popconfirm title="是否删除选中数据？" ok-text="确定" cancel-text="取消" @confirm="delMedia">
                  <a-icon type="delete" style="font-size: 16px" v-if="!asking"></a-icon>
                  <a-icon type="loading" style="font-size: 16px" v-else></a-icon>
                </a-popconfirm>
              </a-tooltip>
            </a>
            <a-list item-layout="horizontal" :data-source="dataMore[tabmoreKey]" :bordered="false">
              <a-list-item slot="renderItem" slot-scope="item, index">
                <a slot="actions">
                  <a-checkbox
                    @change="(e) => checkRulemoreMedia(e, item, index)"
                    :checked="checkedmoreKeys.indexOf(item.id) >= 0 ? true : false"
                  />
                </a>
                <a-tooltip slot="actions">
                  <template slot="title">编辑</template>
                  <a-icon style="font-size: 16px" type="edit" @click="handlemoreEdit(item)"></a-icon>
                </a-tooltip>
                <a-tooltip slot="actions">
                  <template slot="title">删除</template>
                  <a-popconfirm
                    title="是否删除该数据？"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handlemoreDell(item)"
                    @visibleChange="(e) => showmorePop(e, item)"
                  >
                    <a-icon type="delete" style="font-size: 16px" v-if="!asking"></a-icon>
                    <a-icon type="loading" style="font-size: 16px" v-else></a-icon>
                  </a-popconfirm>
                </a-tooltip>
                <a-list-item-meta :description="item.number">
                  <a slot="title">{{ item.name }}</a>
                  <!-- <a slot="title" v-if="tabmoreKey === 'imagetext'">{{ item.tit }}</a> -->
                  <a-avatar
                    class="card-avatar"
                    slot="avatar"
                    style="color: #f56a00; background-color: #fde3cf"
                    size="default"
                  >
                    C
                  </a-avatar>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
          <div
            :style="{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
              zIndex: 1,
            }"
          >
            <a-button type="primary" @click="close_view_more">关闭</a-button>
          </div>
        </a-drawer>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import { Ellipsis, HFormModal, HTable } from "@/libs/components";
import { columns, parseFields } from "@/config/options/manage.js";
import BreadCrumb from "@/views/Components/BreadCrumb";
import { parseFields_ppt } from "@/config/options/ppt.js";
import { parseFields_image } from "@/config/options/image.js";
let [models, configs] = parseFields();
let [models_ppt, configs_ppt] = parseFields_ppt();
let [models_image, configs_image] = parseFields_image();
let media_fields = {
  ppt_info: {
    models: models_ppt,
    configs: configs_ppt,
  },
  image: {
    models: models_image,
    configs: configs_image,
  },
};
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
      view_more: false,
      asking: false,
      view_next: false,
      destroy: true,
      eleForm: {},
      initModel: Object.assign({}, models),
      grouped: [],
      dataMore: { image: [] },
      checkednextKeys: [],
      checkedmoreKeys: [],
      models,
      dataNext: { ppt_info: [] },
      tabnextKey: "",
      tabmoreKey: "",
      configs,
      type: "add",
      typeTitle: "新增",
      visible: false,
      cardLoading: false,
      selRecord: {},
      moreRecord: {},
      confirmLoading: false,
      mdl: null,
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 加载数据方法 必须为 Promise 对象
      loadData: (parameter) => {
        const requestParameters = Object.assign({}, parameter, this.queryParam, {
          tenDatas: localStorage.getItem("tenDatas"),
        });
        return this.$store.dispatch("list_info", requestParameters).then((res) => {
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
  mounted() {
    console.log(localStorage.getItem("tenDatas"));
  },
  computed: {
    rowSelection() {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange,
      };
    },
  },
  watch: {
    view_next() {
      this.$refs.createModal.$emit("cancel");
      this.changenextModel();
    },
    view_more() {
      this.$refs.createModal.$emit("cancel");
      this.changemoreModel();
    },
  },
  methods: {
    returnback() {
      this.$router.back();
    },
    showContent() {
      if (this.view_next && !this.view_more) {
        let { models = {}, configs = {} } = media_fields[this.tabnextKey] ? media_fields[this.tabnextKey] : {};
        this.models = models;
        console.log(">>>");
      } else if (this.view_more) {
        let { models = {}, configs = {} } = media_fields[this.tabmoreKey] ? media_fields[this.tabmoreKey] : {};
        this.models = models;
        console.log(">>>>");
      } else {
        this.models = { ...this.initModel };
        console.log(">");
      }
      this.visible = true;
      this.type = "add";
      this.typeTitle = "新增";
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
      if (this.view_next && !this.view_more) {
        vals.set("safeData", this.selRecord.id);
        console.log(">");
      } else if (this.view_more) {
        vals.set("ppt1Datas", this.moreRecord.id);
        console.log(">>>");
      } else {
        vals.set("tenDatas", localStorage.getItem("tenDatas"));
      }
      return this.sumbit(vals, form.type);
    },
    checkRulemoreMedia(e, item, index) {
      const checkmoreIndex = this.checkedmoreKeys.indexOf(item.id);
      if (checkmoreIndex >= 0) {
        this.checkedmoreKeys.splice(checkmoreIndex, 1);
      } else {
        this.checkedmoreKeys.push(item.id);
      }
      console.log(this.checkedmoreKeys);
    },
    handlePPt(record) {
      this.tabnextKey = "ppt_info";
      console.log(this.tabnextKey);
      this.selectRow(record);
      this.checkednextKeys = [];
      this.view_next = true;
      this.selRecord = record;
    },
    handleCancel() {
      this.visible = false;
    },
    handleDel(vals) {
      this.asking = true;
      this.sumbit(vals, "del");
    },
    close_view_detail() {
      this.view_next = false;
    },
    close_view_more() {
      this.view_more = false;
    },
    sumbit(vals, type, form) {
      let table = this.$refs.table;
      // console.log("vals.>>>", vals, ">>>>", vals.get("options"));
      if (this.view_next && !this.view_more) {
        vals["pages"] = { pageNo: table.localPagination.current, pageSize: table.localPagination.pageSize };
        return this.$store.dispatch(type + "_" + this.tabnextKey, vals).then((res) => {
          this.dataNext[this.tabnextKey] = res.data;
          this.visible && this.handleCancel(type);
          type.indexOf("del") > -1 && (this.checkenextdKeys = []);
          this.asking = false;
          return Promise.resolve(res);
        });
      } else if (this.view_more) {
        vals["pages"] = { pageNo: table.localPagination.current, pageSize: table.localPagination.pageSize };
        return this.$store.dispatch(type + "_" + this.tabmoreKey, vals).then((res) => {
          this.dataMore[this.tabmoreKey] = res.data;
          this.visible && this.handleCancel(type);
          type.indexOf("del") > -1 && (this.checkemoredKeys = []);
          this.asking = false;
          return Promise.resolve(res);
        });
      } else {
        vals["pages"] = { pageNo: table.localPagination.current, pageSize: table.localPagination.pageSize };
        // vals["refresh"] = true;
        // console.log(">>>>>>>>>", vals);
        return this.$store.dispatch(type + "_info", vals).then((res) => {
          // this.onClose();
          this.$refs.filtrate && this.$refs.filtrate.reload(res.data);
          // 刷新表格
          table.refresh();
          // this.$message.info(type + "成功");
          this.visible && this.handleCancel(type);
          type.indexOf("del") > -1 && this.resetSelect();
          this.asking = false;
          this.models = { ...this.initModel };
          return Promise.resolve(res);
        });
      }
    },
    delMedia() {
      if (this.checkednextKeys.length > 0 && this.view_next && !this.view_more) {
        this.asking = true;
        this.sumbit({ ids: this.checkednextKeys, safeData: this.selRecord.id }, "del_multi");
        console.log("..");
      } else if (this.checkedmoreKeys.length > 0 && this.view_more) {
        this.sumbit({ ids: this.checkedmoreKeys, ppt1Datas: this.moreRecord.id }, "del_multi");
        console.log("...");
      } else {
        this.$message.error("未择操作数据");
      }
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
    shownextPop(visible, item) {
      visible && this.getnextCheck(item.id);
    },
    handleDell(vals) {
      this.getnextCheck(vals.id);
      this.asking = true;
      this.sumbit(vals, "del");
    },
    checkRulenextMedia(e, item, index) {
      const checknextIndex = this.checkednextKeys.indexOf(item.id);
      if (checknextIndex >= 0) {
        this.checkednextKeys.splice(checknextIndex, 1);
      } else {
        this.checkednextKeys.push(item.id);
      }
      console.log(this.checkednextKeys);
    },
    handlenextEdit(record) {
      this.getnextCheck(record.id);
      !this.visibleMedia && this.selectRow(record);
      this.visible = true;
      this.models = { ...record };
      this.type = "update";
      this.typeTitle = "编辑：" + this.models.name;
    },
    handlemoreDell(vals) {
      this.getmoreCheck(vals.id);
      this.asking = true;
      this.sumbit(vals, "del");
    },
    handlemoreEdit(record) {
      this.getmoreCheck(record.id);
      !this.visibleMedia && this.selectRow(record);
      this.visible = true;
      this.models = { ...record };
      this.type = "update";
      this.typeTitle = "编辑：" + this.models.name;
    },
    showmorePop(visible, item) {
      visible && this.getmoreCheck(item.id);
    },
    handleMore(record) {
      this.view_more = true;
      this.checkednextKeys = [];
      this.tabmoreKey = "image";
      this.getnextCheck(record.id);
      this.moreRecord = record;
    },
    getmoreCheck(id) {
      this.checkedmoreKeys = [];
      this.checkedmoreKeys.push(id);
      console.log(this.checkedmoreKeys);
    },
    getnextCheck(id) {
      this.checkednextKeys = [];
      this.checkednextKeys.push(id);
      console.log(this.checkednextKeys);
    },
    getSelectBy(name) {
      return this.selectedRows.map((val) => val[name]);
    },
    changenextModel() {
      if (this.view_next) {
        let { models = {}, configs = {} } = media_fields[this.tabnextKey] ? media_fields[this.tabnextKey] : {};
        this.models = models;
        this.configs = configs;
        this.cardLoading = true;
        let tabnextKey = this.tabnextKey,
          apiName = "list_" + tabnextKey;
        this.cardLoading = false;
        this.dataNext[tabnextKey] = [];
        this.$store.dispatch(apiName, this.selRecord).then((res) => {
          this.dataNext[tabnextKey] = res.data;
        });
      } else {
        this.models = models;
        this.configs = configs;
      }
    },
    changemoreModel() {
      if (this.view_more) {
        let { models = {}, configs = {} } = media_fields[this.tabmoreKey] ? media_fields[this.tabmoreKey] : {};
        this.models = models;
        this.configs = configs;
        this.cardLoading = true;
        let tabmoreKey = this.tabmoreKey,
          apiName = "list_" + tabmoreKey;
        this.cardLoading = false;
        this.dataMore[tabmoreKey] = [];
        this.$store.dispatch(apiName, this.moreRecord).then((res) => {
          this.dataMore[tabmoreKey] = res.data;
        });
      } else {
        let { models = {}, configs = {} } = media_fields[this.tabnextKey] ? media_fields[this.tabnextKey] : {};
        this.models = models;
        this.configs = configs;
      }
    },
  },
};
</script>

<style scoped>
.table-operator {
  margin: 20px 0;
}
.ant-card-extra {
  padding: 16px 10px !important;
}
</style>
