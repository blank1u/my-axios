// Created by ganping on 2020/5/18

class Axios {
  constructor() {
    this.interceptors = {
      request: new InterceptorsManager(),
      response: new InterceptorsManager(),
    };
    this.adapter = new Adapters();
  }
  request(options) {
    let chain = [this.dispatchXHR.bind(this), undefined];
    this.interceptors.request.handeles.forEach((interceptor) => {
      chain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    this.interceptors.response.handeles.forEach((interceptor) => {
      chain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise = Promise.resolve(options);
    while (chain.length > 0) {
      promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
  }
  dispatchXHR() {
    if (typeof process === undefined) {
      // 服务端
      this.adapter.fetch();
    } else {
      // 客户端
      this.adapter.http();
    }
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
methodsList = ["post", "put", "get", "head", "options", "delete"];
methodsList.forEach((method) => {
  Axios.prototype[method] = function () {
    return this.request();
  };
});

// 拦截管理器
class InterceptorsManager {
  constructor() {
    this.handeles = [];
  }
  use(fulfilled, rejected) {
    this.handeles.push({
      fulfilled,
      rejected,
    });
  }
}
// 适配器（服务端与客户端）
class Adapters {
  fetch(options) {
    return new Promise((resolve, reject) => {
      let { url = "", method = "get" } = options;
      let xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.onload = function () {
        resolve(xhr.responseText);
      };
      xhr.onerror = function () {
        reject("err");
      };
      xhr.send(null);
    });
  }
  http() {
    console.log("服务端请求...doSomeThing");
  }
}

/**
 * 创建实例
 * @param defaultConfig
 * @returns {function(): Promise<number>}
 */
function createInstance(defaultConfig) {
  let context = new Axios();
  let instance = context.request.bind(context);
  utils.extends(instance, Axios.prototype, context);
  utils.extends(instance, context);
  return instance;
}

let axios = createInstance();
