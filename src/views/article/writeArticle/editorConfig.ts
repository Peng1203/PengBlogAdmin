// 菜单栏配置
export const toolbarConfig = {
  /**
   * toolbarKeys 自定义配置
   */
  toolbarKeys: [
    // 菜单 key
    'blockquote',
    'header1',
    'header2',
    'header3',
    'headerSelect',
    // 分割线
    '|',
    'bold',
    'underline',
    'italic',
    'through',
    'color',
    'bgColor',
    'clearStyle',
    // 分割线
    '|',
    'bulletedList',
    'numberedList',
    'todo',
    '|',
    'justifyLeft',
    'justifyCenter',
    'justifyRight',
    '|',
    'insertTable',
    {
      key: 'group-image',
      title: '图片',
      iconSvg:
        '<svg viewBox="0 0 1024 1024"><path d="M959.877 128l0.123 0.123v767.775l-0.123 0.122H64.102l-0.122-0.122V128.123l0.122-0.123h895.775zM960 64H64C28.795 64 0 92.795 0 128v768c0 35.205 28.795 64 64 64h896c35.205 0 64-28.795 64-64V128c0-35.205-28.795-64-64-64zM832 288.01c0 53.023-42.988 96.01-96.01 96.01s-96.01-42.987-96.01-96.01S682.967 192 735.99 192 832 234.988 832 288.01zM896 832H128V704l224.01-384 256 320h64l224.01-192z"></path></svg>',
      menuKeys: ['insertImage', 'uploadImage'],
    },
    // 表情
    'emotion',
    'code',
    'codeBlock',
    // 菜单组，包含多个菜单
    // {
    //   key: 'group-more-style', // 必填，要以 group 开头
    //   title: '更多样式', // 必填
    //   iconSvg: '<svg t="1675230694727" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2732" width="200" height="200"><path d="M977.824 454.016C826.432 280.288 672.512 192 516.128 192c-156.384 0-310.304 88.288-461.696 262.016a112 112 0 0 0-1.632 145.248c138.24 165.984 293.088 250.24 463.328 250.24s325.088-84.256 463.328-250.24a112 112 0 0 0-1.632-145.248z m-47.552 104.32c-126.848 152.32-264.48 227.2-414.144 227.2s-287.296-74.88-414.144-227.2a48 48 0 0 1 0.704-62.24C243.008 335.072 380.8 256 516.128 256s273.152 79.072 413.44 240.064c15.488 17.792 15.776 44.16 0.704 62.272z" p-id="2733"></path><path d="M512 288a224 224 0 1 0 0 448 224 224 0 0 0 0-448z m-64 224a64 64 0 1 1 0.032-128.032A64 64 0 0 1 448 512z" p-id="2734"></path></svg>', // 可选
    //   menuKeys: ["through", "code", "clearStyle"] // 下级菜单 key ，必填
    // },
    // 继续配置其他菜单...
  ],

  // toolbarKeys: [
  //   "bold",
  //   "underline",
  //   "italic",
  //   "through",
  //   "code",
  //   "sub",
  //   "sup",
  //   "clearStyle",
  //   "color",
  //   "bgColor",
  //   "fontSize",
  //   "fontFamily",
  //   "indent",
  //   "delIndent",
  //   "justifyLeft",
  //   "justifyRight",
  //   "justifyCenter",
  //   "justifyJustify",
  //   "lineHeight",
  //   "insertImage",
  //   "deleteImage",
  //   "editImage",
  //   "viewImageLink",
  //   "imageWidth30",
  //   "imageWidth50",
  //   "imageWidth100",
  //   "divider",
  //   "emotion",
  //   "insertLink",
  //   "editLink",
  //   "unLink",
  //   "viewLink",
  //   "codeBlock",
  //   "blockquote",
  //   "headerSelect",
  //   "header1",
  //   "header2",
  //   "header3",
  //   "header4",
  //   "header5",
  //   "todo",
  //   "redo",
  //   "undo",
  //   "fullScreen",
  //   "enter",
  //   "bulletedList",
  //   "numberedList",
  //   "insertTable",
  //   "deleteTable",
  //   "insertTableRow",
  //   "deleteTableRow",
  //   "insertTableCol",
  //   "deleteTableCol",
  //   "tableHeader",
  //   "tableFullWidth",
  //   "insertVideo",
  //   "uploadVideo",
  //   "editVideoSize",
  //   "uploadImage",
  //   "codeSelectLang"
  // ]

  /**
   *  excludeKeys 如果仅仅想排除掉某些菜单，其他都保留
   */
  // excludeKeys: ["insertVideo"]

  /**
   * insertKeys 自定义扩展菜单
   */
  // insertKeys: {
  //   index: 1,
  //   keys: ['preview', '|']
  // }
}
// 编辑器配置
export const editorConfig = {
  placeholder: '请输入内容...', // 提示内容
  maxLength: 10000, // 最大高度
  hoverbarKeys: {
    link: {
      // 重写 link 元素的 hoverbar
      menuKeys: ['editLink', 'unLink', 'viewLink'],
    },
    image: {
      // 清空 image 元素的 hoverbar
      menuKeys: [],
    },
  },
  MENU_CONF: {
    // 图片上传
    uploadImage: {
      // 小于该值就插入 base64 格式（而不上传），默认为 0
      base64LimitSize: 2 * 1024 * 1024,
      server: 'http://127.0.0.1:3000/api/upload-img',
      // server: '/api/upload-img-10s', // test timeout
      // server: '/api/upload-img-failed', // test failed
      // server: '/api/xxx', // test 404

      timeout: 5 * 1000, // 5s
      fieldName: 'custom-fileName',
      meta: { token: 'xxx', a: 100 },
      metaWithUrl: true, // join params to url
      headers: { Accept: 'text/x-json' },

      maxFileSize: 15 * 1024 * 1024, // 15M
    },
    // 代码语言
    codeLangs: [
      { text: 'CSS', value: 'css' },
      { text: 'HTML', value: 'html' },
      { text: 'JS', value: 'js' },
      { text: 'XML', value: 'xml' },
      // 其他
    ],
  },
  // customConfig: {
  //   uploadImgShowBase64: true
  // }
}
