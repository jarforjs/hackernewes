const firstname = 'gu';
const lastname = 'hongbo';

const person = {
  firstname,
  lastname
}

export {
  firstname,
  lastname
}

export default person;

// • 为了导出和导入单一功能
// • 为了强调一个模块输出API 中的主要功能
// • 这样可以向后兼容ES5只有一个导出物的功能

// 此外，输入的名称可以与导入的default 名称不一样，你也可以将其与命名的导出和导入语句使用同一个名称。
