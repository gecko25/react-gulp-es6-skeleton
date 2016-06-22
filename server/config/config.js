var env = process.env.NODE_ENV = process.env.NODE_ENV || 'local'; 
var localport = 8888;

var envs = {
    local: {
        env: env,
        domain: 'localhost',
        db: {
            url: '', //mongo uri (or wherever your database needs to connect)
        },
        http: {
            port: process.env.PORT || localport
        },
    },

    staging: {
        env: env,
        domain: '', //myapp-staging.herokuapp.com
        db: {
            url: '',
        },
        http: {
            port: process.env.PORT || 80
        },
    },

    production: {
        env: env,
        domain: '', //myapp-production.herokuapp.com
        db: {
            url: ''
        },
        http: {
            port: process.env.PORT || 80
        }
    }
}
envs.test = envs.development;

module.exports = envs[env];
