# using-components

基本告别 usingComponents

## 使用

```
npx using-components dist --write

npx using-components dist --write --ext axml // --ext defaults to wxml

npx using-components -h
```


## 举例

```
src/
  components/
    c1/
      c1.wxml
    c3/
      c3.wxml
  pages/
    home/
      components/
        c2/
          c2.wxml
      home.wxml // 使用 c1, c2, c3
      home.json
  app.json // 声明 c3
```

执行 `npx using-components src --write`

home.json:

```json
{
  "usingComponents": {
    "c1": "/components/c1/c1",
    "c2": "components/c2/c2"
  }
}
```

## 细节

* 读取 wxml 文件内容，得到自定义组件名列表 (过滤 app.json 里出现的组件名)
* [find-up](https://www.npmjs.com/package/find-up) 可能存在该组件的 components
* 根据参数 (--write)，决定是否写入 json
* 预设 `components` 作为自定义组件目录名 (--dirname)
* 预设 `wxml` 作为组件文件后缀 (--ext)

## License

MIT
