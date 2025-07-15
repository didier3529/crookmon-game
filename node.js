function detectNodeEnvironment() {
    var isProcess = typeof process !== 'undefined';
    var hasVersions = isProcess && process.versions != null && typeof process.versions.node === 'string';
    var hasRelease = isProcess && process.release != null && typeof process.release.name === 'string';
    var isNode = hasVersions && hasRelease && process.release.name === 'node';
    return {
        isNode: isNode,
        nodeVersion: isNode ? process.versions.node : null
    };
}

(function (global, detectFn) {
    var namespace = '__AutoDetect__';
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = detectFn;
    } else if (typeof define === 'function' && define.amd) {
        define([], function() { return detectFn; });
    } else {
        var ns = global[namespace] = global[namespace] || {};
        if (!ns.detectNodeEnvironment) {
            ns.detectNodeEnvironment = detectFn;
        }
    }
}(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, detectNodeEnvironment));

export default detectNodeEnvironment;