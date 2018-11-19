npm install --save 局部安装，并会把模块自动写如入package.json中的dependencies里。

npm install --dev局部安装，并会把模块自动写入package.json中的devDependencies里。

npm 5 开始 通过npm install不加--save 和npm install --save一样 都是局部安装并会把模块自动写入package.json中的dependencies里。


babel-eslint让eslint用babel作解释器
eslint-plugin-react支持react语法
eslint-config-airbnb业界规范 
npm install --save-dev babel-eslint eslint eslint-plugin-react eslint-config-airbnb

package.json
"scripts":{
    "lint":"eslint --ext .js,.jsx src"
}
