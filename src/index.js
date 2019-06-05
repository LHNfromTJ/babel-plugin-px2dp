/*
 * @Description: rn样式px转dp插件
 * @Author: lihaonan
 * @LastEditors: lihaonan
 * @Date: 2019-05-30 16:17:21
 * @LastEditTime: 2019-06-05 17:39:22
 */

var localDimensions = '', // 本地Dimensions的引用名称
	isNeedPx2dp = false; // 是否需要转换

function plugin({ types, template }) {
	return {
		visitor: {
			Program: function(path) {
                var list = path.node.directives;
                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
					if (item.value.value === 'px2dp') {
						isNeedPx2dp = true;
					}
                }
			},
			ImportDeclaration: function(path) {
				if (!isNeedPx2dp) return;
				var node = path.node;
				// 判断是否为解构式引用
				if (types.isImportSpecifier(node.specifiers[0])) {
					// 必须是从'react-native'引进来的
					if (node.source.value === 'react-native') {
						var needTransform = true;
						// 循环所有被解构引用的字段
						for (var index = 0; index < node.specifiers.length; index++) {
							var specifier = node.specifiers[index];
							// 如果Dimensions被引用过了，那么标识置为false，不再处理
							if (specifier.imported.name === 'Dimensions') {
								localDimensions = specifier.local.name;
								needTransform = false;
								break;
							}
						}
						if (!needTransform) return;
						// 添加一个新的引用
						localDimensions = 'Dimensions';
						node.specifiers.push(
							types.importSpecifier(
								types.identifier('Dimensions'),
								types.identifier('Dimensions')
							)
						);
					}
				}
			},
			Property: function(path, option) {
				if (!isNeedPx2dp) return;
				var node = path.node;
				// 30px或30.5px或-30.5px这种的都可以被检测到
				if (/^(-|)\d+((\.\d+)|)px$/.test(node.value.value)) {
					var propertyVal = node.value.value.split('px')[0];
					var ast = types.objectProperty(
						types.identifier(node.key.name),
						template.expression(
							localDimensions + ".get('window').width * " + propertyVal + ' / ' + option.opts.uiWidth
						)()
					);
					path.replaceWith(ast);
				}
			},
		},
	};
}

module.exports = plugin;
