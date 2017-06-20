/**
 * util工具包
 */

module.exports = {
    /**
     * 将下划线连接的字段转成驼峰式
     */
    toCamel: function(str) {
        return str.replace(/_([a-zA-Z])/g, function(all, $1) {
            return $1.toUpperCase();
        });
    },

    /**
     * 将驼峰式转成下划线连接
     */
    toUnderline: function(str) {
        return str.replace(/[A-Z]/g, function(all) {
            return '_' + all.toLowerCase();
        });
    }
};
