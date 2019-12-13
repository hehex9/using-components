# using-components

基本告别 usingComponents

## 使用

安装

```
yarn add using-components -D
```

使用

```
npx using-components dist --write
```

## 细节

* 读取 wxml 文件内容，得到自定义组件名列表
* [find-up](https://www.npmjs.com/package/find-up) 可能存在该组件的 components
* 根据参数 (--write)，决定是否写入 json
* 约定 -> `components` 作为自定义组件目录名


## License

MIT
