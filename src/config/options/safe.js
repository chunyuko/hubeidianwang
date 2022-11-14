export const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "名称",
    dataIndex: "title",
  },
  {
    title: "序号",
    dataIndex: "number",
  },
  {
    title: "发展篇",
    dataIndex: "develop",
    scopedSlots: { customRender: "develop" },
  },
  {
    title: "管理篇",
    dataIndex: "manage",
    scopedSlots: { customRender: "manage" },
  },

  {
    title: "安全篇",
    dataIndex: "info",
    scopedSlots: { customRender: "info" },
  },
  {
    title: "操作",
    dataIndex: "action",
    width: "200px",
    scopedSlots: { customRender: "action" },
  },
];

export const fields = {
  id: {
    init: "",
    label: "ID",
    placeholder: "唯一标识，自动生成",
    decorator: { initialValue: 0 },
    disabled: true,
    optional: true,
  },
  title: { init: "", label: "名称", placeholder: "请输入昵称", tip: "用户昵称" },
  number: {
    init: "",
    label: "序号",
    placeholder: "请输入序号",
    tip: "数据显示顺序,自动生成,也可自定义",
  },
  titleEn: { init: "", label: "名称框", placeholder: "请输入昵称", tip: "用户昵称" },
  videoPath: {
    init: "",
    label: "概述视频",
    type: "upload",
    accept: ".mp4",
    decorator: {
      rules: [
        { required: true, message: "不能为空", trigger: "blur" },
        { min: 1, max: 10, message: "1到10个字符", trigger: "blur" },
      ],
    },
    tip: "视频文件(修改时请4个视频一起修改)",
  },
  developVideoPath: {
    init: "",
    label: "发展篇概述",
    type: "upload",
    accept: ".mp4",
    decorator: {
      rules: [
        { required: true, message: "不能为空", trigger: "blur" },
        { min: 1, max: 10, message: "1到10个字符", trigger: "blur" },
      ],
    },
    tip: "视频文件(修改时请4个视频一起修改)",
  },
  manageVideoPath: {
    init: "",
    label: "管理篇概述",
    type: "upload",
    accept: ".mp4",
    decorator: {
      rules: [
        { required: true, message: "不能为空", trigger: "blur" },
        { min: 1, max: 10, message: "1到10个字符", trigger: "blur" },
      ],
    },
    tip: "视频文件(修改时请4个视频一起修改)",
  },
  safeVideoPath: {
    init: "",
    label: "安全篇概述",
    type: "upload",
    accept: ".mp4",
    decorator: {
      rules: [
        { required: true, message: "不能为空", trigger: "blur" },
        { min: 1, max: 10, message: "1到10个字符", trigger: "blur" },
      ],
    },
    tip: "视频文件(修改时请4个视频一起修改)",
  },
};

export const parseFields = () => {
  let models = {},
    configs = {};
  Object.keys(fields).forEach((key, index) => {
    let field = { ...fields[key] };
    field["init"] = field["init"] != undefined ? field["init"] : "";
    models[key] = field["init"];
    delete field.init;
    configs[key] = {};
    Object.assign(configs[key], field);
  });
  return [models, configs];
};
