const   path                = require('path'),
        publicPath          = path.join(process.cwd(), '/public');

let     gutilConf           = {
            colors          : true,
            chunks          : false,
            hash            : false,
            version         : false
        },
        wpServerConfig      = {
            contentBase     : publicPath,
            output          : {
                publicPath  : publicPath
            },
            historyApiFallback: true,
            // proxy: {
            //     "**": "http://localhost:5050/",
            //     ignorePath: true,
            //     changeOrigin: true,
            //     secure: false
            // },
            stats           : {
                colors      : true
            },
            hot             : true
        };

export {gutilConf, wpServerConfig};
