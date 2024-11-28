module.exports = {
  globals: {
    ElMessage: 'readonly',
    ElMessageBox: 'readonly',
    ElNotification: 'readonly'
  },

  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true
  },
  /* 指定如何解析語法 */
  parser: 'vue-eslint-parser',
  /** 優先級低於 parser 的語法解析配置 */
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true
    }
  },
  /* 繼承現有的規則 */
  extends: ['eslint:recommended', 'plugin:vue/vue3-essential', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  plugins: ['vue', '@typescript-eslint'],
  /*
   * "off" 或 0    ==>  關閉規則
   * "warn" 或 1   ==>  規則作為警告（不影響代碼執行）
   * "error" 或 2  ==>  規則作為錯誤（代碼不能執行，界面報錯）
   */
  rules: {
    // eslint（https://eslint.bootcss.com/docs/rules/）
    'no-var': 'error', // 要求使用 let 或 const 而不是 var
    'no-multiple-empty-lines': ['warn', { max: 1 }], // 不允許多個空行
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unexpected-multiline': 'error', // 禁止意外的多行
    'no-useless-escape': 'off', // 禁止不必要的轉義字符

    // TypeScript (https://typescript-eslint.io/rules)
    '@typescript-eslint/no-unused-vars': 'off', // 禁止定義未使用的變量
    '@typescript-eslint/prefer-ts-expect-error': 'error', // 禁止使用 @ts-ignore
    '@typescript-eslint/no-explicit-any': 'off', // 禁止使用 any 類型
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-namespace': 'off', // 禁止使用自定義 TypeScript 模組和命名空間
    '@typescript-eslint/semi': 'off',

    // eslint-plugin-vue (https://eslint.vuejs.org/rules/)
    'vue/multi-word-component-names': 'off', // 要求組件名稱使用多詞組成
    'vue/script-setup-uses-vars': 'off', // 防止在 <script setup> 使用的變量被標記為未使用
    'vue/no-mutating-props': 'off', // 不允許修改組件的 props
    'vue/attribute-hyphenation': 'off' // 強制在模板中的自定義組件中使用屬性連字命名法
  }
}
