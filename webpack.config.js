const path = require('path')

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist/js'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.m?jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			},
			{
				test: /\.jpg$/,
				loader: 'url-loader',
				options: {
					outputPath: path.resolve(__dirname, 'client/dist/images')
				}
			}
		]
	}
}