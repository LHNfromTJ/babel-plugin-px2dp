# babel-plugin-px2dp

babel的样式单位处理插件，用于react-native开发者进行样式转换使用

----

## Why babel-plugin-px2dp

+ 对于rn的开发来说，样式单位转换是一个小痛点。
+ 类似于[px2rem](https://www.npmjs.com/package/px2rem) / [px2vw](https://www.npmjs.com/package/px2vw)等插件使我们在进行web开发的时候更为高效，本插件就是帮助rn开发者进行dp单位转换所使用的

## Where to add babel-plugin-import

- [babelrc](https://babeljs.io/docs/usage/babelrc/)

## Example

#### `["px2dp", { "uiWidth": 750 }]`

## Result
ps.请注意必须在你要转换的文件头部加上px2dp的标识用于插件检测，否则无法进行转换！
#### `最基础的转换`

```javascript
'px2dp';
...

StyleSheet.create({
    example: {
        width: '20px',
    }
})

      ↓ ↓ ↓ ↓ ↓ ↓

...
import { Dimensions } from 'react-native';

StyleSheet.create({
    example: {
        width: ds.get('window').width * 20 / 750, // 750是你设置的uiWidth的值
    }
})
```

#### `如果原始文件已经引用过Dimensions，则不去新增引用`
```javascript

'px2dp';
...
import { Dimensions, xxx } from 'react-native';

StyleSheet.create({
    example: {
        width: '20px',
        height: Dimensions.get('window').height,
    }
})

      ↓ ↓ ↓ ↓ ↓ ↓

...
import { Dimensions, xxx } from 'react-native';

StyleSheet.create({
    example: {
        width: Dimensions.get('window').width * 20 / 750,
        height: Dimensions.get('window').height,
    }
})
```

#### `如果原始文件已经引用过Dimensions并且设置了别名，插件会按照别名进行处理`
```javascript
'px2dp';
...
import { ds as Dimensions, xxx } from 'react-native';

StyleSheet.create({
    example: {
        width: '20px',
        height: ds.get('window').height,
    }
})

      ↓ ↓ ↓ ↓ ↓ ↓

...
import { ds as Dimensions, xxx } from 'react-native';

StyleSheet.create({
    example: {
        width: ds.get('window').width * 20 / 750,
        height: ds.get('window').height,
    }
})
```
#### `如果原始文件并未引用过Dimensions，插件会去融合之前的引用`
```javascript

'px2dp';
...
import { xxx } from 'react-native';

StyleSheet.create({
    example: {
        width: '20px',
    }
})

      ↓ ↓ ↓ ↓ ↓ ↓

...
import { Dimensions, xxx } from 'react-native';

StyleSheet.create({
    example: {
        width: Dimensions.get('window').width * 20 / 750,
    }
})
```

## Usage

```bash
npm install babel-plugin-px2dp --save-dev
```

Via `.babelrc`

```js
{
  "plugins": [["px2dp", options]]
}
```

### options

`options` can be object.

```javascript
{
  "uiWidth": 750, // ui设计稿宽度
}
```
