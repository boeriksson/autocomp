
module.exports = function (api) {
    api.cache(true)

    console.log('Babel.config.json loaded...')

    const presets = ['@babel/preset-env', ['@babel/preset-react', {"runtime": "automatic"}]]
    const plugins = [
        ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],
        ['@babel/plugin-proposal-decorators', {'decoratorsBeforeExport': true}],
        ['@babel/plugin-proposal-class-properties', { 'loose': false}]
    ]

    return {
        presets,
        plugins
    };
}