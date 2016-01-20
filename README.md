# 南京大学 MBA 移动课程表

## 在线演示
+ 直接扫描下方二维码（推荐）

![](https://chart.googleapis.com/chart?cht=qr&chl=http%3A%2F%2Fmba.coding.io&chs=180x180&choe=UTF-8&chld=L|2)
+ 或访问 [mba.coding.io](http://mba.coding.io)


## 安装
```
$ npm install
```

## 配置
在 config 目录中添加 production.json5，在此文件中覆盖你自己的配置项。
```javascript
{
    db: {
        mongodb: {
            url: "mongodb://localhost/csm"
        }
    }
}
```

## 数据库
```
$ mkdir db
$ mongod --dbpath db &
```

## 运行
```
$ webpack -p
$ npm start --production
```

## 开发 / 调试
```
$ npm start
```
