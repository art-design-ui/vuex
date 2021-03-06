import Module from './module'
import { forEachValue } from '../util';

/**
 * {
    state:{},
    getters:{},
    actions:{},
    mutations:{},
    modules:{}
 *  }
 * 转化为
 *  {
    _rawModule:{},
    _children:{},
    ...
 */

/**
 * 一.对用户传入的数据进行模块收集
 * 二.进行格式化
 */
class ModuleCollection {
    constructor(options) {
        this.register([], options)
    }
    /**
     * 
     * @param {*} path path数组的子项就是我们的模块名  每个模块都绑定了一个属于自己的path变量（不是共用的）path是用来记录递归模块的关系
     * @param {*} rootModule 表示根模块
     * 收集模块的时候 用path来记录模块之间的父子关系
     */
    register(path, rootModule) {
        let newModule = new Module(rootModule)
        if (path.length == 0) {
            /**
             * this.root表示根模块
             */
            this.root = newModule;
        } else {
            let parent = path.slice(0, -1).reduce((memo, current) => {
                return memo._children[current];
            }, this.root);
            parent._children[path[path.length - 1]] = newModule;
        }
        if (rootModule.modules) {
            /**
             * forEachValue对于对象的遍历
             */
            forEachValue(rootModule.modules, (module, moduleName) => {
                this.register(path.concat(moduleName), module);
            })
        }
    }
    /**
     * 获取命名空间
     */
    getNamespace(path) {
        let module = this.root
        return path.reduce((namespace, key) => {
            module = module.getChild(key);
            console.log(module)
            return namespace + (module.namespaced ? key + '/' : '')
        }, '');
    }
}


export default ModuleCollection