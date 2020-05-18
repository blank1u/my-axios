// Created by ganping on 2020/5/18

class Axios {
  constructor(defaultConfig) {
    this.defaultConfig = {};
    this.test = "test";
  }
  fetch() {
    return Promise.resolve(1);
  }
}

let utils = {
  /**
   * 把相关属性添加到实例上
   * @param instance
   * @param attributes
   * @param context
   */
  extends(instance, attributes, context) {
    for (let key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (typeof attributes[key] === "function") {
          instance[key] = attributes[key].bind(context);
        } else {
          instance[key] = attributes[key];
        }
      }
    }
  },
};

//扩展对象
methodsArrList = ["post", "put", "get", "head", "options", "delete"];
methodsArrList.forEach((method) => {
  Axios.prototype[method] = function () {
    return this.fetch();
  };
});

console.dir(Axios);

/**
 * 创建实例
 * @param defaultConfig
 * @returns {function(): Promise<number>}
 */
function createInstance(defaultConfig) {
  let context = new Axios();
  let instance = context.fetch;
  utils.extends(instance, Axios.prototype, context);
  utils.extends(instance, context);
  return instance;
}

let axios = createInstance();
