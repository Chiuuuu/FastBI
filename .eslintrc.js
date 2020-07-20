module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: "babel-eslint"
    },
    extends: ["plugin:vue/essential", "@vue/prettier"],
    plugins: ["vue", "prettier"],
    rules: {
        eqeqeq: 0, //
        "no-console": 0,
        "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
        "no-new": 0,
        "no-new-object": 0,
        "prettier/prettier": [
            1,
            {
                singleQuote: true, //强制单引号
                trailingComma: "es5", //自动增加逗号
                printWidth: 150
            }
        ],

        "vue/html-indent": 0, //缩进
        "vue/html-self-closing": 0,
        "vue/singleline-html-element-content-newline": 0,
        // 属性排序
        "vue/attributes-order": 1,
        "vue/max-attributes-per-line": [
            0,
            {
                singleline: 4
            }
        ]
    }
};