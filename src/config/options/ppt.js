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
};

export const parseFields_ppt = () => {
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
